/* eslint-env mocha */
import { expect } from 'aegir/chai'
// import * as utils from '../src/utils.js'
import DnsOverHttpResolver from '../src/index.js'
import type { DNSJSON } from '../src/utils.js'
import sinon from 'sinon'
import type { SinonStub } from 'sinon'

// const getFetchPair = () => [utils, 'fetch']
// const getFetch = () => utils.fetch

describe('dns-over-http-resolver', () => {
  let resolver: DnsOverHttpResolver
  let request: SinonStub<[string], Promise<DNSJSON>>

  beforeEach(() => {
    request = sinon.stub()
    resolver = new DnsOverHttpResolver({ request })
  })

  afterEach(() => {
    resolver.clearCache()
    sinon.restore()
  })

  it('can get and set http servers', () => {
    const servers1 = resolver.getServers()
    expect(servers1).to.exist()
    expect(servers1).to.have.lengthOf(2)

    const newServer = 'https://dns.google/resolve'
    resolver.setServers([newServer])

    const servers2 = resolver.getServers()
    expect(servers2).to.exist()
    expect(servers2).to.have.lengthOf(1)
    expect(servers2[0]).to.equal(newServer)
  })

  it('shuffles the available servers on resolve', async () => {
    const hostname = 'google.com'
    const recordType = 'A'

    request.resolves({
      Question: [{ name: 'google.com', type: 1 }],
      Answer: [{ name: 'google.com', type: 1, TTL: 285, data: '216.58.212.142' }]
    })

    const spy = sinon.spy(resolver, '_getShuffledServers')
    await resolver.resolve(hostname, recordType)
    expect(spy.callCount).to.equal(1)
  })

  it('resolves a dns record of type A', async () => {
    const hostname = 'google.com'
    const recordType = 'A'

    request.resolves({
      Question: [{ name: 'google.com', type: 1 }],
      Answer: [{ name: 'google.com', type: 1, TTL: 285, data: '216.58.212.142' }]
    })

    const response = await resolver.resolve(hostname, recordType)
    expect(response).to.exist()
    expect(response).to.deep.equal(['216.58.212.142'])
  })

  it('resolves a dns record using IPv4', async () => {
    const hostname = 'google.com'

    request.resolves({
      Question: [{ name: 'google.com', type: 1 }],
      Answer: [{ name: 'google.com', type: 1, TTL: 285, data: '216.58.212.142' }]
    })

    const response = await resolver.resolve4(hostname)
    expect(response).to.exist()
    expect(response).to.deep.equal(['216.58.212.142'])
  })

  it('resolves a dns record using IPv4 and caches it for next resolve', async () => {
    const hostname = 'google.com'

    request.resolves({
      Question: [{ name: 'google.com', type: 1 }],
      Answer: [{ name: 'google.com', type: 1, TTL: 1000, data: '216.58.212.142' }]
    })

    const response1 = await resolver.resolve4(hostname)
    expect(response1).to.exist()
    expect(request.callCount).to.equal(1)

    const response2 = await resolver.resolve4(hostname)
    expect(response2).to.exist()
    expect(request.callCount).to.equal(1)

    expect(response1).to.deep.equal(response2)
  })

  it('resolves a dns record of type AAAA', async () => {
    const hostname = 'google.com'
    const recordType = 'AAAA'

    request.resolves({
      Question: [{ name: 'google.com', type: 1 }],
      Answer: [{
        name: 'google.com',
        type: 28,
        TTL: 148,
        data: '2a00:1450:4001:801::200e'
      }]
    })

    const response = await resolver.resolve(hostname, recordType)
    expect(response).to.exist()
    expect(response).to.deep.equal(['2a00:1450:4001:801::200e'])
  })

  it('resolves a dns record using IPv6', async () => {
    const hostname = 'google.com'

    request.resolves({
      Question: [{ name: 'google.com', type: 1 }],
      Answer: [{
        name: 'google.com',
        type: 28,
        TTL: 148,
        data: '2a00:1450:4001:801::200e'
      }]
    })

    const response = await resolver.resolve6(hostname)
    expect(response).to.exist()
    expect(response).to.deep.equal(['2a00:1450:4001:801::200e'])
  })

  it('resolves a dns record using IPv6 and caches it for next resolve', async () => {
    const hostname = 'google.com'

    request.resolves({
      Question: [{ name: 'google.com', type: 1 }],
      Answer: [{
        name: 'google.com',
        type: 28,
        TTL: 1000,
        data: '2a00:1450:4001:801::200e'
      }]
    })

    const response1 = await resolver.resolve6(hostname)
    expect(response1).to.exist()
    expect(request.callCount).to.equal(1)

    const response2 = await resolver.resolve6(hostname)
    expect(response2).to.exist()
    expect(request.callCount).to.equal(1)

    expect(response1).to.deep.equal(response2)
  })

  it('resolves a dns record of type TXT', async () => {
    const hostname = 'google.com'
    const recordType = 'TXT'

    request.resolves({
      Question: [{ name: 'example.com', type: 1 }],
      Answer: [{
        name: 'example.com',
        type: 16,
        TTL: 86400,
        data: '"v=spf1 -all"'
      }, {
        name: 'example.com',
        type: 16,
        TTL: 86400,
        data: '"docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e"'
      }]
    })

    const response = await resolver.resolve(hostname, recordType)
    expect(response).to.exist()
    expect(response).to.have.length(2)
    expect(response).to.deep.equal([['v=spf1 -all'], ['docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e']])
  })

  it('resolves a dns record using TXT', async () => {
    const hostname = 'example.com'

    request.resolves({
      Question: [{ name: 'example.com', type: 1 }],
      Answer: [{
        name: 'example.com',
        type: 16,
        TTL: 86400,
        data: '"v=spf1 -all"'
      }, {
        name: 'example.com',
        type: 16,
        TTL: 86400,
        data: '"docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e"'
      }]
    })

    const response = await resolver.resolveTxt(hostname)
    expect(response).to.exist()
    expect(response).to.have.length(2)
    expect(response).to.deep.equal([['v=spf1 -all'], ['docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e']])
  })

  it('resolves a dns record using TXT and caches it for next resolve', async () => {
    const hostname = 'example.com'

    request.resolves({
      Question: [{ name: 'example.com', type: 1 }],
      Answer: [{
        name: 'example.com',
        type: 16,
        TTL: 86400,
        data: '"v=spf1 -all"'
      }, {
        name: 'example.com',
        type: 16,
        TTL: 86400,
        data: '"docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e"'
      }]
    })

    const response1 = await resolver.resolveTxt(hostname)
    expect(response1).to.exist()
    expect(response1).to.have.length(2)
    expect(request.callCount).to.equal(1)

    const response2 = await resolver.resolveTxt(hostname)
    expect(response2).to.exist()
    expect(response2).to.have.length(2)
    expect(request.callCount).to.equal(1)

    expect(response1).to.deep.equal(response2)
  })

  it('should fail if cannot resolve', async () => {
    const hostname = 'example.com'
    const recordType = 'TXT'

    request.rejects(new Error())

    await expect(resolver.resolve(hostname, recordType)).to.eventually.be.rejected()
  })

  it('resolved a dns record from the second server if the first fails', async () => {
    const hostname = 'example.com'

    request.onCall(0).rejects(new Error())
    request.onCall(1).resolves({
      Question: [{ name: 'google.com', type: 1 }],
      Answer: [{ name: 'google.com', type: 1, TTL: 285, data: '216.58.212.142' }]
    })

    const response = await resolver.resolve(hostname)
    expect(response).to.exist()
    expect(response).to.deep.equal(['216.58.212.142'])
  })
})
