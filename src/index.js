'use strict'
const debug = require('debug')
const log = debug('dns-over-http-resolver')
log.error = debug('dns-over-http-resolver:error')

const { buildResource, fetch } = require('./utils')

/**
 * DNS over HTTP resolver.
 * Uses a list of servers to resolve DNS records with HTTP requests.
 */
class Resolver {
  /**
   * @class
   */
  constructor () {
    this._servers = [
      'https://cloudflare-dns.com/dns-query',
      'https://dns.google/resolve'
    ]
  }

  /**
   * Get an array of the IP addresses currently configured for DNS resolution.
   * These addresses are formatted according to RFC 5952. It can include a custom port.
   *
   * @returns {Array<string>}
   */
  getServers () {
    return this._servers
  }

  /**
   * Sets the IP address and port of servers to be used when performing DNS resolution.
   *
   * @param {Array<string>} servers - array of RFC 5952 formatted addresses.
   */
  setServers (servers) {
    this._servers = servers
  }

  /**
   * Uses the DNS protocol to resolve the given host name into the appropriate DNS record.
   *
   * @param {string} hostname - host name to resolve.
   * @param {string} [rrType = 'A'] - resource record type.
   * @returns {Promise<*>}
   */
  resolve (hostname, rrType = 'A') {
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
   * Uses the DNS protocol to resolve the given host name into IPv4 addresses.
   *
   * @param {string} hostname - host name to resolve.
   * @returns {Promise<Array<string>>}
   */
  async resolve4 (hostname) {
    for (const server of this._servers) {
      try {
        const response = await fetch(buildResource({
          serverResolver: server,
          hostname,
          recordType: 'A'
        }))

        const d = await response.json()
        return d.Answer.map(a => a.data)
      } catch (err) {
        log.error(`${server} could not resolve ${hostname} record A`)
      }
    }

    throw new Error(`Could not resolve ${hostname} record A`)
  }

  /**
   * Uses the DNS protocol to resolve the given host name into IPv6 addresses.
   *
   * @param {string} hostname - host name to resolve.
   * @returns {Promise<Array<string>>}
   */
  async resolve6 (hostname) {
    for (const server of this._servers) {
      try {
        const response = await fetch(buildResource({
          serverResolver: server,
          hostname,
          recordType: 'AAAA'
        }))

        const d = await response.json()
        return d.Answer.map(a => a.data)
      } catch (err) {
        log.error(`${server} could not resolve ${hostname} record AAAA`)
      }
    }

    throw new Error(`Could not resolve ${hostname} record AAAA`)
  }

  /**
   * Uses the DNS protocol to resolve the given host name into a Text record.
   *
   * @param {string} hostname - host name to resolve.
   * @returns {Promise<Array<Array<string>>>}
   */
  async resolveTxt (hostname) {
    for (const server of this._servers) {
      try {
        const response = await fetch(buildResource({
          serverResolver: server,
          hostname,
          recordType: 'TXT'
        }))

        const d = await response.json()

        return d.Answer.map(a => [a.data.replace(/['"]+/g, '')])
      } catch (err) {
        log.error(`${server} could not resolve ${hostname} record TXT`)
      }
    }

    throw new Error(`Could not resolve ${hostname} record TXT`)
  }
}

Resolver.Resolver = Resolver
module.exports = Resolver
