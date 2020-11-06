'use strict'

/* eslint-env mocha */
const { expect } = require('aegir/utils/chai')
const sinon = require('sinon')
const { default: nativeFetch } = require('native-fetch')
const { isBrowser } = require('ipfs-utils/src/env')

const DnsOverHttpResolver = require('../')

const getFetchPair = () => isBrowser ? [window, 'fetch'] : [nativeFetch, 'Promise']
const getFetch = () => isBrowser ? window.fetch : nativeFetch.Promise

describe('dns-over-http-resolver', () => {
  let resolver

  beforeEach(() => {
    resolver = new DnsOverHttpResolver()
  })

  afterEach(() => {
    resolver._cache.clear()
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
    expect(servers2[0]).to.eql(newServer)
  })

  it('shuffles the available servers on resolve', async () => {
    const hostname = 'google.com'
    const recordType = 'A'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'google.com', type: 1 }],
        Answer: [{ name: 'google.com', type: 1, TTL: 285, data: '216.58.212.142' }]
      })
    }))

    sinon.spy(resolver, '_getShuffledServers')
    await resolver.resolve(hostname, recordType)
    expect(resolver._getShuffledServers.callCount).to.eql(1)
  })

  it('resolves a dns record of type A', async () => {
    const hostname = 'google.com'
    const recordType = 'A'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'google.com', type: 1 }],
        Answer: [{ name: 'google.com', type: 1, TTL: 285, data: '216.58.212.142' }]
      })
    }))

    const response = await resolver.resolve(hostname, recordType)
    expect(response).to.exist()
    expect(response).to.eql(['216.58.212.142'])
  })

  it('resolves a dns record using IPv4', async () => {
    const hostname = 'google.com'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'google.com', type: 1 }],
        Answer: [{ name: 'google.com', type: 1, TTL: 285, data: '216.58.212.142' }]
      })
    }))

    const response = await resolver.resolve4(hostname)
    expect(response).to.exist()
    expect(response).to.eql(['216.58.212.142'])
  })

  it('resolves a dns record using IPv4 and caches it for next resolve', async () => {
    const hostname = 'google.com'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'google.com', type: 1 }],
        Answer: [{ name: 'google.com', type: 1, TTL: 1000, data: '216.58.212.142' }]
      })
    }))

    const response1 = await resolver.resolve4(hostname)
    expect(response1).to.exist()
    expect(getFetch().callCount).to.eql(1)

    const response2 = await resolver.resolve4(hostname)
    expect(response2).to.exist()
    expect(getFetch().callCount).to.eql(1)

    expect(response1).to.eql(response2)
  })

  it('resolves a dns record of type AAAA', async () => {
    const hostname = 'google.com'
    const recordType = 'AAAA'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'google.com', type: 1 }],
        Answer: [
          {
            name: 'google.com',
            type: 28,
            TTL: 148,
            data: '2a00:1450:4001:801::200e'
          }
        ]
      })
    }))

    const response = await resolver.resolve(hostname, recordType)
    expect(response).to.exist()
    expect(response).to.eql(['2a00:1450:4001:801::200e'])
  })

  it('resolves a dns record using IPv6', async () => {
    const hostname = 'google.com'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'google.com', type: 1 }],
        Answer: [
          {
            name: 'google.com',
            type: 28,
            TTL: 148,
            data: '2a00:1450:4001:801::200e'
          }
        ]
      })
    }))

    const response = await resolver.resolve6(hostname)
    expect(response).to.exist()
    expect(response).to.eql(['2a00:1450:4001:801::200e'])
  })

  it('resolves a dns record using IPv6 and caches it for next resolve', async () => {
    const hostname = 'google.com'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'google.com', type: 1 }],
        Answer: [
          {
            name: 'google.com',
            type: 28,
            TTL: 1000,
            data: '2a00:1450:4001:801::200e'
          }
        ]
      })
    }))

    const response1 = await resolver.resolve6(hostname)
    expect(response1).to.exist()
    expect(getFetch().callCount).to.eql(1)

    const response2 = await resolver.resolve6(hostname)
    expect(response2).to.exist()
    expect(getFetch().callCount).to.eql(1)

    expect(response1).to.eql(response2)
  })

  it('resolves a dns record of type TXT', async () => {
    const hostname = 'google.com'
    const recordType = 'TXT'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'example.com', type: 1 }],
        Answer: [
          {
            name: 'example.com',
            type: 16,
            TTL: 86400,
            data: '"v=spf1 -all"'
          },
          {
            name: 'example.com',
            type: 16,
            TTL: 86400,
            data: '"docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e"'
          }
        ]
      })
    }))

    const response = await resolver.resolve(hostname, recordType)
    expect(response).to.exist()
    expect(response).to.have.length(2)
    expect(response).to.eql([['v=spf1 -all'], ['docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e']])
  })

  it('resolves a dns record using TXT', async () => {
    const hostname = 'example.com'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'example.com', type: 1 }],
        Answer: [
          {
            name: 'example.com',
            type: 16,
            TTL: 86400,
            data: '"v=spf1 -all"'
          },
          {
            name: 'example.com',
            type: 16,
            TTL: 86400,
            data: '"docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e"'
          }
        ]
      })
    }))

    const response = await resolver.resolveTxt(hostname)
    expect(response).to.exist()
    expect(response).to.have.length(2)
    expect(response).to.eql([['v=spf1 -all'], ['docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e']])
  })

  it('resolves a dns record using TXT and caches it for next resolve', async () => {
    const hostname = 'example.com'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'example.com', type: 1 }],
        Answer: [
          {
            name: 'example.com',
            type: 16,
            TTL: 86400,
            data: '"v=spf1 -all"'
          },
          {
            name: 'example.com',
            type: 16,
            TTL: 86400,
            data: '"docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e"'
          }
        ]
      })
    }))

    const response1 = await resolver.resolveTxt(hostname)
    expect(response1).to.exist()
    expect(response1).to.have.length(2)
    expect(getFetch().callCount).to.eql(1)

    const response2 = await resolver.resolveTxt(hostname)
    expect(response2).to.exist()
    expect(response2).to.have.length(2)
    expect(getFetch().callCount).to.eql(1)

    expect(response1).to.eql(response2)
  })

  it('should fail if cannot resolve', async () => {
    const hostname = 'example.com'
    const recordType = 'TXT'

    const stub = sinon.stub(...getFetchPair())
    stub.returns(Promise.reject(new Error()))

    await expect(resolver.resolve(hostname, recordType)).to.eventually.be.rejected()
  })

  it('resolved a dns record from the second server if the first fails', async () => {
    const hostname = 'example.com'

    const stub = sinon.stub(...getFetchPair())
    stub.onCall(0).returns(Promise.reject(new Error()))
    stub.onCall(1).returns(Promise.resolve({
      json: () => ({
        Question: [{ name: 'google.com', type: 1 }],
        Answer: [{ name: 'google.com', type: 1, TTL: 285, data: '216.58.212.142' }]
      })
    }))

    const response = await resolver.resolve(hostname)
    expect(response).to.exist()
    expect(response).to.eql(['216.58.212.142'])
  })
})
