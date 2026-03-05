# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- [I18n] Add translation keys for page titles (head.*), SEO descriptions (seo.*), and auth layout strings in all 4 locales ([3ab5146](https://github.com/cmukanisa/olulimi-frontend/commit/3ab5146))
- [I18n] Translate auth layout hardcoded strings (back to home, all rights reserved, Google callback) ([9d7b052](https://github.com/cmukanisa/olulimi-frontend/commit/9d7b052))
- [I18n] Replace hardcoded useHead page titles and useSeoMeta with reactive i18n t() calls across 20 pages ([da728d8](https://github.com/cmukanisa/olulimi-frontend/commit/da728d8))
- [I18n] Add Mashi Simple (MS) as 4th locale with everyday words and French loanwords ([1adfeca](https://github.com/cmukanisa/olulimi-frontend/commit/1adfeca))
- [I18n] Rename Emashi to aMashi in Mashi translations ([6a31c82](https://github.com/cmukanisa/olulimi-frontend/commit/6a31c82))
- [SEO] Enable SSR for public pages and enhance meta tags (Open Graph, Twitter Card, keywords) ([de80104](https://github.com/cmukanisa/olulimi-frontend/commit/de80104))
- [SEO] Add robots.txt for search engine crawling ([90f17d6](https://github.com/cmukanisa/olulimi-frontend/commit/90f17d6))
- [SEO] Add favicon and PWA manifest assets with multi-format icons and web app manifest ([9c3a092](https://github.com/cmukanisa/olulimi-frontend/commit/9c3a092))
- [SEO] Add favicon link tags to nuxt config for cross-browser support ([ff5ca3c](https://github.com/cmukanisa/olulimi-frontend/commit/ff5ca3c))
- [Toast] Increase error and warning toast display duration to 6s ([c237280](https://github.com/cmukanisa/olulimi-frontend/commit/c237280))
- [API] Add network error detection and backend health check ([7814130](https://github.com/cmukanisa/olulimi-frontend/commit/7814130))
- [Health] Add client-side backend health check plugin ([d5d21fc](https://github.com/cmukanisa/olulimi-frontend/commit/d5d21fc))

### Fixed
- [Toast] Fix accents and shorten toast messages ([b2faba8](https://github.com/cmukanisa/olulimi-frontend/commit/b2faba8))
