import debug from 'debug'
import Receptacle from 'receptacle'
import * as utils from './utils.js'
import type { DNSJSON } from './utils'

const log = Object.assign(debug('dns-over-http-resolver'), {
  error: debug('dns-over-http-resolver:error')
})

export interface Request { (resource: string, signal: AbortSignal): Promise<DNSJSON> }

interface ResolverOptions {
  maxCache?: number
  request?: Request
}

type RecordTypes = 'A' | 'AAAA' | 'TXT'

interface DNSResolver<T> {
  hostname: string
  recordType: RecordTypes
  cache?: Receptacle<T[], undefined>
}

const RECORD_EXTRACTORS: Record<RecordTypes, (input: DNSJSON['Answer'][0]) => string | string[]> = {
  A: ({ data }): string => data,
  AAAA: ({ data }): string => data,
  TXT: ({ data }): string[] => [data.replace(/['"]+/g, '')]
}

/**
 * DNS over HTTP resolver.
 * Uses a list of servers to resolve DNS records with HTTP requests.
 */
class Resolver {
  private readonly _cache: Receptacle<string[]>
  private readonly _TXTcache: Receptacle<string[][]>
  private _servers: string[]
  private readonly _request: Request
  private _abortControllers: AbortController[]

  /**
   * @class
   * @param {object} [options]
   * @param {number} [options.maxCache = 100] - maximum number of cached dns records
   * @param {Request} [options.request] - function to return DNSJSON
   */
  constructor (options: ResolverOptions = {}) {
    this._cache = new Receptacle({ max: options?.maxCache ?? 100 })
    this._TXTcache = new Receptacle({ max: options?.maxCache ?? 100 })
    this._servers = [
      'https://cloudflare-dns.com/dns-query',
      'https://dns.google/resolve'
    ]
    this._request = options.request ?? utils.request
    this._abortControllers = []
  }

  /**
   * Cancel all outstanding DNS queries made by this resolver. Any outstanding
   * requests will be aborted and promises rejected.
   */
  cancel (): void {
    this._abortControllers.forEach(controller => { controller.abort() })
  }

  /**
   * Get an array of the IP addresses currently configured for DNS resolution.
   * These addresses are formatted according to RFC 5952. It can include a custom port.
   */
  getServers (): string[] {
    return this._servers
  }

  /**
   * Get a shuffled array of the IP addresses currently configured for DNS resolution.
   * These addresses are formatted according to RFC 5952. It can include a custom port.
   */
  _getShuffledServers (): string[] {
    const newServers = [...this._servers]

    for (let i = newServers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = newServers[i]
      newServers[i] = newServers[j]
      newServers[j] = temp
    }

    return newServers
  }

  /**
   * Sets the IP address and port of servers to be used when performing DNS resolution.
   *
   * @param {string[]} servers - array of RFC 5952 formatted addresses.
   */
  setServers (servers: string[]): void {
    this._servers = servers
  }

  /**
   * Uses the DNS protocol to resolve the given host name into the appropriate DNS record
   *
   * @param {string} hostname - host name to resolve
   * @param {string} [rrType = 'A'] - resource record type
   */
  async resolve (hostname: string, rrType: 'TXT'): Promise<string[][]>
  async resolve (hostname: string, rrType: 'A' | 'AAAA'): Promise<string[]>
  async resolve (hostname: string): Promise<string[]>
  async resolve (hostname: string, rrType: string = 'A'): Promise<string[] | string[][]> {
    switch (rrType) {
      case 'A':
        return this.resolve4(hostname)
      case 'AAAA':
        return this.resolve6(hostname)
      case 'TXT':
        return this.resolveTxt(hostname)
      default:
        throw new Error(`${rrType} is not supported`)
    }
  }

  /**
   * Uses the DNS protocol to resolve the given host name into IPv4 addresses
   *
   * @param {string} hostname - host name to resolve
   */
  async resolve4 (hostname: string): Promise<string[]> {
    return this.resolveAny({
      hostname,
      recordType: 'A'
    })
  }

  /**
   * Uses the DNS protocol to resolve the given host name into IPv6 addresses
   *
   * @param {string} hostname - host name to resolve
   */
  async resolve6 (hostname: string): Promise<string[]> {
    return this.resolveAny({
      hostname,
      recordType: 'AAAA'
    })
  }

  /**
   * Uses the DNS protocol to resolve the given host name into a Text record
   *
   * @param {string} hostname - host name to resolve
   */
  async resolveTxt (hostname: string): Promise<string[][]> {
    return this.resolveAny({
      hostname,
      recordType: 'TXT',
      cache: this._TXTcache
    })
  }

  /**
   * Resolves any record type.
   *
   * @param DNSResolver<T> - DNSResolver object
   */
  private async resolveAny ({
    hostname,
    recordType,
    cache
  }: DNSResolver<string>): Promise<string[]>
  private async resolveAny ({
    hostname,
    recordType,
    cache
  }: DNSResolver<string[]>): Promise<string[][]>
  private async resolveAny ({
    hostname,
    recordType,
    cache = this._cache
  }: DNSResolver<string | string[]>): Promise<Array<string | string[]>> {
    const cached = cache.get(utils.getCacheKey(hostname, recordType))
    if (cached != null) {
      return cached
    }
    let aborted = false

    for (const server of this._getShuffledServers()) {
      const controller = new AbortController()
      this._abortControllers.push(controller)

      try {
        const response = await this._request(utils.buildResource(
          server,
          hostname,
          recordType
        ), controller.signal)

        const data = response.Answer.map(RECORD_EXTRACTORS[recordType])
        const ttl = Math.min(...response.Answer.map(a => a.TTL))

        cache.set(utils.getCacheKey(hostname, recordType), data, { ttl })

        return data
      } catch (err) {
        if (controller.signal.aborted) {
          aborted = true
        }

        log.error(`${server} could not resolve ${hostname} record ${recordType}`)
      } finally {
        this._abortControllers = this._abortControllers.filter(c => c !== controller)
      }
    }

    if (aborted) {
      throw Object.assign(new Error(`query${recordType} ECANCELLED`), {
        code: 'ECANCELLED'
      })
    }

    throw new Error(`Could not resolve ${hostname} record ${recordType}`)
  }

  /**
   * Clears the cache.
   */
  clearCache (): void {
    this._cache.clear()
    this._TXTcache.clear()
  }
}

export default Resolver
