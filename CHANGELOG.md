# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.15](https://github.com/medikoo/fs2/compare/v0.3.14...v0.3.15) (2024-10-02)

### Bug Fixes

- Fix async function reference ([1582f08](https://github.com/medikoo/fs2/commit/1582f08935e47d5ff16f2fac52b7d9f22c5b60ed))
- Fix error handling in descriptors handler ([83aea92](https://github.com/medikoo/fs2/commit/83aea92bdaaa7072b9a781c634825128669405ba))

### Maintenance Improvements

- Remove unreachable code ([efaf6d3](https://github.com/medikoo/fs2/commit/efaf6d39e3d49065febee115fa1115b450d3b4f1))

## [0.3.14](https://github.com/medikoo/fs2/compare/v0.3.13...v0.3.14) (2024-09-30)

### Features

- Cover `fs.promised` with EMFILE descriptor handler ([eca1f08](https://github.com/medikoo/fs2/commit/eca1f08e5ad8f0aee505ae05001152d8d08e66df))
- Keep EMFILE limit 1 below to make room for sync executions ([6b757d2](https://github.com/medikoo/fs2/commit/6b757d2101d3a2f4dc438ad6c27df6899c2ca62c))

## [0.3.13](https://github.com/medikoo/fs2/compare/v0.3.12...v0.3.13) (2024-09-30)

### Features

- Cover `fs.opendir` with EMFILE descriptors handler ([9ae7424](https://github.com/medikoo/fs2/commit/9ae7424917799332641faf26dc32683d8296f590))

### Maintenance Improvements

- Bump dependencies ([86820ea](https://github.com/medikoo/fs2/commit/86820eacdc378ae3e4a8abe94741adbfa14352c7))
- Refactor into ES2015+ ([9133d39](https://github.com/medikoo/fs2/commit/9133d39f35d95e72e4742f85bb290b62f06980b9))
- Refactor to ES2015+ ([3a02945](https://github.com/medikoo/fs2/commit/3a02945b967597ec7031e6f590cbd81ad0e82f03))

### [0.3.12](https://github.com/medikoo/fs2/compare/v0.3.11...v0.3.12) (2024-09-08)

### Bug Fixes

- Fix cross device rename ([0a52b2d](https://github.com/medikoo/fs2/commit/0a52b2dfe1fb013233c72af58d4de89d44669ccb))

### [0.3.11](https://github.com/medikoo/fs2/compare/v0.3.10...v0.3.11) (2024-09-08)

### Maintenance Improvements

- Bump dependencies ([ab0be1e](https://github.com/medikoo/fs2/commit/ab0be1e6ed1498a22daa5fa64a841cda90930cdf))

## [0.3.10](https://github.com/medikoo/fs2/compare/v0.3.9...v0.3.10) (2024-09-08)

### Features

- `emptyDirSync` util ([7ad4055](https://github.com/medikoo/fs2/commit/7ad40550dc80444245daff89b4fec462a97840bf))
- `isFile` util ([d4ceee8](https://github.com/medikoo/fs2/commit/d4ceee8b873cc6838af65f2e55f42d94c46b24ee))
- `unlinkSync` function ([b80d0cd](https://github.com/medikoo/fs2/commit/b80d0cd0645871b88e89d901863e7b4803bd3358))
- Allow empty directory at `copyDir` destination ([2b9bbd6](https://github.com/medikoo/fs2/commit/2b9bbd6438bb774b98151c24952d5be6f2c367d4))
- **Symlink:**
  - `--force` option ([5216782](https://github.com/medikoo/fs2/commit/5216782a293967511d5841639ef5e74136116f54))
  - `--loose` option ([c87a45b](https://github.com/medikoo/fs2/commit/c87a45b91fc918c943c26337fe51488b79836e5e))
  - Return`true` if symlink was created ([a522bd8](https://github.com/medikoo/fs2/commit/a522bd81529c8e3eb35c5a9151daf30cb4af9ea8))

### Bug Fixes

- Fix directory rename across different devices ([24d70e1](https://github.com/medikoo/fs2/commit/24d70e119f008b213475d1cb103dd4572978eeaa))
- **rmdir:** Ensure `--force` option empties directory contents ([23d3f3a](https://github.com/medikoo/fs2/commit/23d3f3ac765951c0130c146a092202f5f79bbf79))
- **Symlink:** Fix resolution of `linkPath` option ([0ee13f6](https://github.com/medikoo/fs2/commit/0ee13f65e7616587ee9351dd52f14e0bf19814f1))

### Maintenance Improvements

- Clear ESLint errors ([0696308](https://github.com/medikoo/fs2/commit/0696308f033d04a106334792101fb330576bb385))
  33124bbd74d94d60629e6fb5ce712a74e04871b8))
- Fix lint issues ([cd4e2c6](https://github.com/medikoo/fs2/commit/cd4e2c638026cedd77f418bf23c8de456c5455e7))
- Prettier ([b8188b2](https://github.com/medikoo/fs2/commit/b8188b2119996f8ff434348df1c32fc10433af1d))
- Refactor `rename` to ES2015+ ([553c799](https://github.com/medikoo/fs2/commit/553c799acc557224bdc3ef40849ad39dcf4bae2c))
- Refactor `symlink` to ES2015 ([5ff2670](https://github.com/medikoo/fs2/commit/5ff26708c54a3c299cb904dfa675ff32101402aa))
- Refactor to ES2015 ([ae2c181](https://github.com/medikoo/fs2/commit/ae2c181d1653952d6c2f1d95cbf7a37c34a47394))
- Refactor to ES2015 ([22e8cbe](https://github.com/medikoo/fs2/commit/22e8cbe6b121f5cf55191e1bf61774d2125e7c54))
- Refactor to ES2015 ([433fe9c](https://github.com/medikoo/fs2/commit/433fe9c34c644e7754f99f7b716ba1ee8b97737c))
- Refactor to ES2015+ ([dc2b946](https://github.com/medikoo/fs2/commit/dc2b946025ed03eec2f58c69e8e19a8446d1d84c))
- Respect ESLint rules ([5f7e4cd](https://github.com/medikoo/fs2/commit/5f7e4cd516f1958d8ed7a9507c3f3818814dbf58))
- Reuse `emptyDirSync` logic in `rmDirSync` ([6cd7026](https://github.com/medikoo/fs2/commit/6cd7026b9f66b961bbfdd411be997f3b648c16b7))
- Simplify configuration of `test` command ([3bced0e](https://github.com/medikoo/fs2/commit/3bced0e8f453ddbe5ca93bae2f0930cd9ba3934b))
- Simplify meta configuration ([65ae563](https://github.com/medikoo/fs2/commit/65ae5633540804664fc713208e4deb70ff28265f))
- To ES2015 ([b10e364](https://github.com/medikoo/fs2/commit/b10e36426dc7430834ccd4cafe975d8d051cd374))
- Upgrade `eslint` to v8 and `eslint-config-medikoo` to v4 ([11a7d11](https://github.com/medikoo/fs2/commit/11a7d11eee46f6e6d00a43f9c8ec5b4b39599e11))

### [0.3.9](https://github.com/medikoo/fs2/compare/v0.3.8...v0.3.9) (2020-11-19)

### Features

- rmdirSync util ([3c50c17](https://github.com/medikoo/fs2/commit/3c50c17198bd77e52c2889e3ce05161d790250a8))

### [0.3.8](https://github.com/medikoo/fs2/compare/v0.3.7...v0.3.8) (2020-04-27)

### Bug Fixes

- Fix `mode` normalization in `fs.access` ([00f2a52](https://github.com/medikoo/fs2/commit/00f2a52b139576b5b5adcec7c3c01bb84b905076))

### [0.3.7](https://github.com/medikoo/fs2/compare/v0.3.6...v0.3.7) (2019-11-07)

### Features

- 'silent' option for mkdir ([e3fe863](https://github.com/medikoo/fs2/commit/e3fe863))

### [0.3.6](https://github.com/medikoo/fs2/compare/v0.3.5...v0.3.6) (2019-09-26)

### Bug Fixes

- Ensure to not leave open file descriptors when write crashes ([cf8ef7e](https://github.com/medikoo/fs2/commit/cf8ef7e))

### Features

- Expose debug stats in descriptors handler ([cdcac3f](https://github.com/medikoo/fs2/commit/cdcac3f))

### [0.3.5](https://github.com/medikoo/fs2/compare/v0.3.4...v0.3.5) (2019-07-10)

### Features

- 'append' mode for chmod ([afa7aaa](https://github.com/medikoo/fs2/commit/afa7aaa))

<a name="0.3.4"></a>

## [0.3.4](https://github.com/medikoo/fs2/compare/v0.3.3...v0.3.4) (2019-02-04)

### Features

- 'force' option for copy ([85a3560](https://github.com/medikoo/fs2/commit/85a3560))

<a name="0.3.3"></a>

## [0.3.3](https://github.com/medikoo/fs2/compare/v0.3.2...v0.3.3) (2019-02-04)

### Features

- 'access' util ([d85f934](https://github.com/medikoo/fs2/commit/d85f934))
- hasAccess util ([8c53ea9](https://github.com/medikoo/fs2/commit/8c53ea9))

<a name="0.3.2"></a>

## [0.3.2](https://github.com/medikoo/fs2/compare/v0.3.1...v0.3.2) (2019-02-04)

### Bug Fixes

- readdir 'loose' option handling with depth: Infinity ([f2c19ac](https://github.com/medikoo/fs2/commit/f2c19ac))

<a name="0.3.1"></a>

## [0.3.1](https://github.com/medikoo/fs2/compare/v0.3.0...v0.3.1) (2019-01-31)

### Features

- **readdir:** loose option ([7b2a5e7](https://github.com/medikoo/fs2/commit/7b2a5e7))

<a name="0.3.0"></a>

# [0.3.0](https://github.com/medikoo/fs2/compare/v0.2.21...v0.3.0) (2019-01-07)

### Bug Fixes

- Ensure git ignore resolution works as expected ([c5d68fb](https://github.com/medikoo/fs2/commit/c5d68fb))

### BREAKING CHANGES

- Due to switch to 'ignore' not supporting Node below v6,
  drop support for old verions of Node.js.

<a name="0.2.21"></a>

## [0.2.21](https://github.com/medikoo/fs2/compare/v0.2.20...v0.2.21) (2018-11-15)

### Bug Fixes

- 'loose' option handling on windows ([3788ebf](https://github.com/medikoo/fs2/commit/3788ebf))

<a name="0.2.20"></a>

## [0.2.20](https://github.com/medikoo/fs2/compare/v0.2.19...v0.2.20) (2018-11-07)

### Bug Fixes

- **copyDir:** symlink copying ([c0e4a6f](https://github.com/medikoo/fs2/commit/c0e4a6f))

<a name="0.2.19"></a>

## [0.2.19](https://github.com/medikoo/fs2/compare/v0.2.18...v0.2.19) (2018-10-31)

### Bug Fixes

- **symlink:** for symlink we should not fully resolve link path ([ae17653](https://github.com/medikoo/fs2/commit/ae17653))

<a name="0.2.18"></a>

## [0.2.18](https://github.com/medikoo/fs2/compare/v0.2.17...v0.2.18) (2018-10-31)

### Bug Fixes

- remove problematic stream.destroy() ([ceb67b9](https://github.com/medikoo/fs2/commit/ceb67b9))
- **copy:** validate destination existence ([7662c1e](https://github.com/medikoo/fs2/commit/7662c1e))
- **copyDir:** fix duplicate file copying ([41ff83b](https://github.com/medikoo/fs2/commit/41ff83b))

<a name="0.2.17"></a>

## [0.2.17](https://github.com/medikoo/fs2/compare/v0.2.16...v0.2.17) (2018-10-31)

### Bug Fixes

- **copyDir:** throw if destination path exists ([812fdfb](https://github.com/medikoo/fs2/commit/812fdfb))

<a name="0.2.16"></a>

## [0.2.16](https://github.com/medikoo/fs2/compare/v0.2.15...v0.2.16) (2018-10-31)

### Features

- copyDir util ([2f45d62](https://github.com/medikoo/fs2/commit/2f45d62))

<a name="0.2.15"></a>

## [0.2.15](https://github.com/medikoo/fs2/compare/v0.2.14...v0.2.15) (2018-10-25)

### Bug Fixes

- **readlink:** improve loose option handling ([b54f193](https://github.com/medikoo/fs2/commit/b54f193))
- improve arguments handling ([c32f340](https://github.com/medikoo/fs2/commit/c32f340))
- **lstat:** fix loose option handling ([889b829](https://github.com/medikoo/fs2/commit/889b829))

### Features

- isDirectory util ([835b4a9](https://github.com/medikoo/fs2/commit/835b4a9))

<a name="0.2.14"></a>

## [0.2.14](https://github.com/medikoo/fs2/compare/v0.2.13...v0.2.14) (2018-10-24)

### Bug Fixes

- **readlink:** fix support for loose option on existing non-symlinks ([3c52970](https://github.com/medikoo/fs2/commit/3c52970))

<a name="0.2.13"></a>

## [0.2.13](https://github.com/medikoo/fs2/compare/v0.2.12...v0.2.13) (2018-10-24)

### Bug Fixes

- require path ([6aa87f7](https://github.com/medikoo/fs2/commit/6aa87f7))

<a name="0.2.12"></a>

## [0.2.12](https://github.com/medikoo/fs2/compare/v0.2.11...v0.2.12) (2018-10-24)

### Features

- readlink util ([c5c63c7](https://github.com/medikoo/fs2/commit/c5c63c7))

<a name="0.2.11"></a>

## [0.2.11](https://github.com/medikoo/fs2/compare/v0.2.10...v0.2.11) (2018-10-23)

### Features

- introduce realpath ([727e7b8](https://github.com/medikoo/fs2/commit/727e7b8))

<a name="0.2.10"></a>

## [0.2.10](https://github.com/medikoo/fs2/compare/v0.2.9...v0.2.10) (2018-09-14)

### Bug Fixes

- support for very old versions of Node.js ([73bc389](https://github.com/medikoo/fs2/commit/73bc389))

### Features

- rm util, removes either file or directory ([6733df6](https://github.com/medikoo/fs2/commit/6733df6))

<a name="0.2.9"></a>

## [0.2.9](https://github.com/medikoo/fs2/compare/v0.2.8...v0.2.9) (2018-09-13)

### Features

- support "loose" option in stat and lstat ([76306c4](https://github.com/medikoo/fs2/commit/76306c4))

<a name="0.2.8"></a>

## [0.2.8](https://github.com/medikoo/fs2/compare/v0.2.7...v0.2.8) (2018-09-07)

### Features

- support `intermediate` option in symlink ([5846d47](https://github.com/medikoo/fs2/commit/5846d47))

<a name="0.2.7"></a>

## [0.2.7](https://github.com/medikoo/fs2/compare/v0.2.6...v0.2.7) (2017-09-05)

### Bug Fixes

- bring back node v0.12 support ([370fa80](https://github.com/medikoo/fs2/commit/370fa80))

<a name="0.2.6"></a>

## [0.2.6](https://github.com/medikoo/fs2/compare/v0.2.5...v0.2.6) (2017-06-19)

<a name="0.2.5"></a>

## [0.2.5](https://github.com/medikoo/fs2/compare/v0.2.4...v0.2.5) (2017-06-16)

### Features

- "loose" option for fs.copy ([885cba7](https://github.com/medikoo/fs2/commit/885cba7))
- resolve successful copy with `true` ([72d4961](https://github.com/medikoo/fs2/commit/72d4961))

## Old Changelog

See `CHANGES`
