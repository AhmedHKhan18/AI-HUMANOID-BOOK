---
id: 0008
title: Implement Multilingual i18n English Urdu
stage: general
date: 2025-12-11
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: 1-vision-language-action
user: ahmed
command: /sp.refine
labels: ["i18n", "urdu", "rtl", "multilingual", "docusaurus"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - docusaurus.config.js
  - src/css/custom.css
  - i18n/ur/docusaurus-plugin-content-docs/current.json
  - i18n/ur/docusaurus-theme-classic/navbar.json
  - i18n/ur/docusaurus-theme-classic/footer.json
  - i18n/ur/code.json
  - i18n/ur/docusaurus-plugin-content-docs/current/intro.md
tests:
  - Manual verification of language toggle in navbar
  - RTL layout verification for Urdu locale
  - Font rendering verification for Noto Nastaliq Urdu
---

## Prompt

/sp.refine You are an expert Docusaurus architect and your task is to implement a complete multilingual feature (English ↔ Urdu) for my Docusaurus book built with Speckit Plus.

### Feature Summary
Add a language switch button in the navbar that allows users to toggle between English and Urdu at any time, without reloading the page layout or breaking any MDX modules.

### Requirements

## Core i18n Setup
- Enable Docusaurus i18n with two locales:
  - defaultLocale: "en"
  - locales: ["en", "ur"]
- Configure `docusaurus.config.js` to support RTL for Urdu pages.
- Ensure fonts support Urdu (Noto Nastaliq or Noto Sans Arabic).

## Navbar Language Toggle Button
- Add a visible button/icon on the navbar that allows switching languages.
- The button must:
  - Display current language (EN/UR)
  - Toggle to the other language instantly
  - Work on all routes
  - Use Docusaurus `<LocaleDropdown/>` or a custom dropdown
  - Maintain the same sidebar selection when switching languages
  - Follow the theme of my book (green theme)

## Content Translation Support
- All Markdown/MDX content should load automatically from:
  - English: `/docs/**`
  - Urdu: `/i18n/ur/docusaurus-plugin-content-docs/current/**`
- Sidebar JSON should translate from:
  `/i18n/ur/docusaurus-plugin-content-docs/current.json`

## Urdu Localization Needs
- Direction: RTL (right-to-left)
- Typography: readable Urdu font
- Ensure UI components like tables, code blocks, alerts, tabs remain aligned under RTL.

## Response snapshot

Implemented complete multilingual i18n feature for Docusaurus with English and Urdu support:

1. **Fixed and configured docusaurus.config.js:**
   - Added proper i18n configuration with localeConfigs for en and ur
   - Set direction: 'rtl' and htmlLang: 'ur-PK' for Urdu locale
   - Added localeDropdown to navbar with "Help translate" link

2. **Added comprehensive RTL CSS support:**
   - Imported Noto Nastaliq Urdu and Noto Sans Arabic fonts via Google Fonts
   - Created 250+ lines of RTL-specific CSS rules for:
     - Navbar, sidebar, footer direction reversal
     - Content area RTL text alignment
     - Lists, blockquotes, tables, admonitions alignment
     - Table of contents and pagination RTL support
     - Code blocks maintain LTR direction for readability

3. **Created i18n folder structure:**
   - `/i18n/ur/docusaurus-plugin-content-docs/current.json` - sidebar translations
   - `/i18n/ur/docusaurus-theme-classic/navbar.json` - navbar translations
   - `/i18n/ur/docusaurus-theme-classic/footer.json` - footer translations
   - `/i18n/ur/code.json` - UI string translations (60+ strings)
   - `/i18n/ur/docusaurus-plugin-content-docs/current/intro.md` - example translated page

## Outcome

- Impact: Complete i18n infrastructure with RTL support for Urdu locale
- Tests: Manual verification required - run `npm run start -- --locale ur` to test Urdu
- Files: 7 files created/modified
- Next prompts: Add more translated content files, test build with `npm run build`
- Reflection: Fixed existing syntax error in docusaurus.config.js where i18n was incorrectly nested

## Evaluation notes (flywheel)

- Failure modes observed: Original config had i18n nested inside navbar items array (syntax error)
- Graders run and results (PASS/FAIL): N/A - implementation task
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test full build and verify all RTL components render correctly
