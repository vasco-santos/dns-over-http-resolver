'use strict'

const { default: nativeFetch, Headers } = require('native-fetch')

/**
 * Build fetch resource for request.
 *
 * @param {object} properties
 * @param {string} properties.serverResolver
 * @param {string} properties.hostname
 * @param {string} properties.recordType
 * @returns {string}
 */
function buildResource ({ serverResolver, hostname, recordType }) {
  return `${serverResolver}?name=${hostname}&type=${recordType}`
}

module.exports.buildResource = buildResource

function fetch (resource) {
  return nativeFetch(resource, {
    headers: new Headers({
      accept: 'application/dns-json'
    })
  })
}

module.exports.fetch = fetch
