## [3.0.5](https://github.com/vasco-santos/dns-over-http-resolver/compare/v3.0.4...v3.0.5) (2025-02-17)

### Dependencies

* **dev:** bump aegir from 44.1.4 to 45.0.9 ([#124](https://github.com/vasco-santos/dns-over-http-resolver/issues/124)) ([ae88784](https://github.com/vasco-santos/dns-over-http-resolver/commit/ae88784292be720e7566c1db6a4215c6502676e3))

## [3.0.4](https://github.com/vasco-santos/dns-over-http-resolver/compare/v3.0.3...v3.0.4) (2025-02-12)

### Dependencies

* **dev:** bump sinon from 18.0.1 to 19.0.2 ([#118](https://github.com/vasco-santos/dns-over-http-resolver/issues/118)) ([a19379f](https://github.com/vasco-santos/dns-over-http-resolver/commit/a19379f04d40321e268c628d714c6242ee96c33f))

## [3.0.3](https://github.com/vasco-santos/dns-over-http-resolver/compare/v3.0.2...v3.0.3) (2024-08-02)

### Bug Fixes

* remove cjs deps ([#116](https://github.com/vasco-santos/dns-over-http-resolver/issues/116)) ([df1d6f6](https://github.com/vasco-santos/dns-over-http-resolver/commit/df1d6f68316ab4f1bc421762225d2e4beda75166))

### Dependencies

* **dev:** bump aegir from 42.2.11 to 43.0.1 ([#114](https://github.com/vasco-santos/dns-over-http-resolver/issues/114)) ([bf396fe](https://github.com/vasco-santos/dns-over-http-resolver/commit/bf396fe4796a995a4c82b298f5f994c5819242c4))
* **dev:** bump aegir from 43.0.3 to 44.0.0 ([#115](https://github.com/vasco-santos/dns-over-http-resolver/issues/115)) ([ff0a161](https://github.com/vasco-santos/dns-over-http-resolver/commit/ff0a1615e25c6cc4832ca12b5ddc5dc9a5c8e40b))
* **dev:** bump sinon from 17.0.2 to 18.0.0 ([#112](https://github.com/vasco-santos/dns-over-http-resolver/issues/112)) ([e2da10b](https://github.com/vasco-santos/dns-over-http-resolver/commit/e2da10bac2118a62934213aa1de6fad7499c1f1e))

## [3.0.2](https://github.com/vasco-santos/dns-over-http-resolver/compare/v3.0.1...v3.0.2) (2024-01-12)


### Dependencies

* **dev:** bump aegir from 41.3.5 to 42.1.1 ([#111](https://github.com/vasco-santos/dns-over-http-resolver/issues/111)) ([8d8d5c6](https://github.com/vasco-santos/dns-over-http-resolver/commit/8d8d5c64007fd998f88f7a36b45a557f1484660d))

## [3.0.1](https://github.com/vasco-santos/dns-over-http-resolver/compare/v3.0.0...v3.0.1) (2024-01-10)


### Dependencies

* **dev:** bump @types/sinon from 10.0.20 to 17.0.3 ([#110](https://github.com/vasco-santos/dns-over-http-resolver/issues/110)) ([94b4014](https://github.com/vasco-santos/dns-over-http-resolver/commit/94b401483d74859b758e146325be9a3120fc5ee8))

## [3.0.0](https://github.com/vasco-santos/dns-over-http-resolver/compare/v2.1.3...v3.0.0) (2023-11-06)


### ⚠ BREAKING CHANGES

* requires node 18+

### Bug Fixes

* use native fetch API ([#104](https://github.com/vasco-santos/dns-over-http-resolver/issues/104)) ([58453c7](https://github.com/vasco-santos/dns-over-http-resolver/commit/58453c70f04977ca16feb8edd0d12ce453d57f85))

## [2.1.3](https://github.com/vasco-santos/dns-over-http-resolver/compare/v2.1.2...v2.1.3) (2023-10-26)


### Bug Fixes

* specify correct return type from `resolve` ([#101](https://github.com/vasco-santos/dns-over-http-resolver/issues/101)) ([6dd2bd8](https://github.com/vasco-santos/dns-over-http-resolver/commit/6dd2bd89a8ea900adfee47cea52a0a638fe768cb))


### Dependencies

* **dev:** bump sinon from 14.0.2 to 17.0.0 ([#100](https://github.com/vasco-santos/dns-over-http-resolver/issues/100)) ([f946dcb](https://github.com/vasco-santos/dns-over-http-resolver/commit/f946dcb278bbf9555b6d6dd0fee23241c961db2a))

## [2.1.2](https://github.com/vasco-santos/dns-over-http-resolver/compare/v2.1.1...v2.1.2) (2023-08-14)


### Trivial Changes

* add or force update .github/workflows/js-test-and-release.yml ([#98](https://github.com/vasco-santos/dns-over-http-resolver/issues/98)) ([7147501](https://github.com/vasco-santos/dns-over-http-resolver/commit/7147501e96b4dda1706a99f90053c5cff9061d2a))
* delete templates [skip ci] ([#97](https://github.com/vasco-santos/dns-over-http-resolver/issues/97)) ([f3f9a24](https://github.com/vasco-santos/dns-over-http-resolver/commit/f3f9a2478da00cdc28cacb2df12cbc453358a1bb))

## [2.1.1](https://github.com/vasco-santos/dns-over-http-resolver/compare/v2.1.0...v2.1.1) (2022-11-23)


### Bug Fixes

* add `undici` to satisfy peer dep requirements ([#78](https://github.com/vasco-santos/dns-over-http-resolver/issues/78)) ([cf7a941](https://github.com/vasco-santos/dns-over-http-resolver/commit/cf7a94180ea604261f367f4742e9111b5503c7ff)), closes [#44](https://github.com/vasco-santos/dns-over-http-resolver/issues/44)

## [2.1.0](https://github.com/vasco-santos/dns-over-http-resolver/compare/v2.0.2...v2.1.0) (2022-07-07)


### Features

* allow aborting DNS requests ([#71](https://github.com/vasco-santos/dns-over-http-resolver/issues/71)) ([a37e8de](https://github.com/vasco-santos/dns-over-http-resolver/commit/a37e8debadf93972b5c268d67360ed046a312387))


### Trivial Changes

* **deps-dev:** bump sinon from 13.0.2 to 14.0.0 ([#64](https://github.com/vasco-santos/dns-over-http-resolver/issues/64)) ([cb45791](https://github.com/vasco-santos/dns-over-http-resolver/commit/cb457915d3447516655b4ee6cabae3a29f060d17))

## [2.0.2](https://github.com/vasco-santos/dns-over-http-resolver/compare/v2.0.1...v2.0.2) (2022-07-07)


### Trivial Changes

* **deps-dev:** bump sinon from 12.0.1 to 13.0.0 ([#58](https://github.com/vasco-santos/dns-over-http-resolver/issues/58)) ([288fb4b](https://github.com/vasco-santos/dns-over-http-resolver/commit/288fb4b609bce0e0251fe10b594bcf611898019d))
* update aegir ([#72](https://github.com/vasco-santos/dns-over-http-resolver/issues/72)) ([a33d9ad](https://github.com/vasco-santos/dns-over-http-resolver/commit/a33d9ad7ff552606783f713029405779ce5e556f))
* update project config ([#73](https://github.com/vasco-santos/dns-over-http-resolver/issues/73)) ([8a892be](https://github.com/vasco-santos/dns-over-http-resolver/commit/8a892be11058ea46a30d903e6e24286aba55b8b2))

## [2.0.1](https://github.com/vasco-santos/dns-over-http-resolver/compare/v2.0.0...v2.0.1) (2021-12-17)


### Bug Fixes

* add types path to package.json ([#56](https://github.com/vasco-santos/dns-over-http-resolver/issues/56)) ([902408b](https://github.com/vasco-santos/dns-over-http-resolver/commit/902408b6005ddb5a92c364106abcda99db668339))



# [2.0.0](https://github.com/vasco-santos/dns-over-http-resolver/compare/v1.2.3...v2.0.0) (2021-12-14)


### Features

* convert to typescript ([#53](https://github.com/vasco-santos/dns-over-http-resolver/issues/53)) ([4eac9f6](https://github.com/vasco-santos/dns-over-http-resolver/commit/4eac9f61a7d8aa89848230f90c5cb3cfcc559647))


### BREAKING CHANGES

* ESM only publishing



## [1.2.3](https://github.com/vasco-santos/dns-over-http-resolver/compare/v1.2.2...v1.2.3) (2021-05-11)



## [1.2.2](https://github.com/vasco-santos/dns-over-http-resolver/compare/v1.2.1...v1.2.2) (2021-02-22)



## [1.2.1](https://github.com/vasco-santos/dns-over-http-resolver/compare/v1.2.0...v1.2.1) (2021-01-18)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/vasco-santos/dns-over-http-resolver/compare/v1.1.0...v1.2.0) (2020-11-09)



<a name="1.1.0"></a>
# [1.1.0](https://github.com/vasco-santos/dns-over-http-resolver/compare/v1.0.0...v1.1.0) (2020-11-05)


### Features

* cache ([2a2aa61](https://github.com/vasco-santos/dns-over-http-resolver/commit/2a2aa61))



<a name="1.0.0"></a>
# 1.0.0 (2020-10-13)


### Features

* initial implementation ([c6a9dbd](https://github.com/vasco-santos/dns-over-http-resolver/commit/c6a9dbd))
