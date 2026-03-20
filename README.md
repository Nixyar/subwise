# SubWise

SubWise is a modern subscription tracking app for people who want one clean place to understand what they pay for, when renewals happen, and where money can be saved.

Instead of just storing a list of services, SubWise helps users:
- see monthly and yearly spend at a glance
- track upcoming charges and trial expirations
- discover duplicate or forgotten subscriptions
- manage subscriptions across multiple currencies
- open the subscription management page directly from the app

## Why SubWise

Subscription fatigue is real. Between streaming services, AI tools, cloud storage, productivity apps, and regional memberships, it becomes easy to lose track of:

- how much is actually being spent every month
- which services are no longer used
- which subscriptions should be cancelled before renewal
- which tools overlap and can be consolidated

SubWise turns that into a focused workflow:

1. Add a service in seconds
2. Let the app autofill known products when possible
3. Track renewals and trial periods
4. Review savings suggestions
5. Keep the list current with direct management links

## Highlights

- Clean dashboard with monthly and yearly subscription totals
- Search, sorting, and multi-select category filtering
- Runtime localization in Russian, English, and Spanish
- Display currency switching with conversion for `USD`, `EUR`, and `RUB`
- Smart suggestions and autofill for known services
- Brand-aware service icons with website fallback
- Subscription management links on list items
- Advice engine for optimization opportunities
- Shareable summary screen
- Local-first storage with no backend required

## Screens

Recommended for the GitHub page:

- Dashboard overview
- Add subscription modal
- Advice screen
- Summary screen

You can place screenshots in a folder such as `docs/screenshots/` and reference them here later:

## Product Experience

### Smart subscription entry

When a user starts typing a known service, SubWise can suggest and autofill:

- service name
- price
- billing currency
- category
- subscription management URL
- brand metadata used for icons

This keeps data entry fast without forcing users into a closed catalog. Custom services can still be entered manually.

### Practical renewal management

Each subscription can include:

- next billing date
- trial status
- trial end date
- last used date
- optional management URL

The dashboard then surfaces what matters most:

- upcoming billing dates
- expensive services
- trial subscriptions
- category distribution

### Advice that stays useful

The advice page is designed to be pragmatic rather than noisy. It looks for patterns such as:

- forgotten subscriptions
- free trial deadlines
- duplicated AI services
- possible cheaper alternatives
- recurring plans that may not justify annual spend

## Tech Stack

- Angular 21
- Angular Material
- TypeScript
- SCSS
- Angular SSR support

## Getting Started

### Requirements

- Node.js 20+ recommended
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm start
```

The default dev server runs at:

- `http://localhost:4200`

Alternative development script:

```bash
npm run dev
```

## Available Scripts

- `npm start` — start the Angular dev server
- `npm run build` — build the application
- `npm run watch` — build in watch mode with development configuration
- `npm run test` — run tests
- `npm run lint` — run ESLint
- `npm run serve:ssr:app` — run the built SSR server

## How Data Works

SubWise is currently local-first.

The app stores data in the browser:

- subscriptions in `localStorage`
- selected interface language in `localStorage`
- selected display currency in `localStorage`

This makes the app easy to run and demo without backend infrastructure.

## Brands, And Icons

Brand rendering works like this:

1. Try a matching icon from `https://cdn.simpleicons.org`
2. If the brand icon is unavailable, fall back to the service website favicon
3. If neither exists, use the category icon

This gives the subscription list a more product-specific feel than generic category icons alone.

## Architecture

The project uses a feature-oriented structure:

```
src/app
├── core
│   ├── currency
│   ├── i18n
│   ├── layout
│   └── utils
├── features
│   ├── dashboard
│   ├── insights
│   ├── subscriptions
│   └── summary
└── routes
```

### Key areas

- `src/app/core/i18n` — locale service, language registry, translation registry
- `src/app/core/layout` — application shell and navigation
- `src/app/features/dashboard` — overview, list management, filters, and sorting
- `src/app/features/insights` — savings and optimization logic
- `src/app/features/subscriptions` — dialog flow, models, persistence, suggestions
- `src/app/features/summary` — export-friendly summary view
- `src/app/routes` — reusable route constants and route composition

## Development Conventions

- Type aliases start with `T`
- Interfaces start with `I`
- Components should stay thin
- Reusable validators, config maps, and domain helpers should live outside components
- Feature translations should stay near the feature
- Route constants should be reused instead of hardcoded links

## Roadmap Ideas

Potential next steps for the product:

- cloud sync and authentication
- recurring billing notifications
- richer analytics and time-based charts
- import from bank statements or email receipts
- region-aware preset pricing
- stronger insights and budgeting rules

## Notes

- Advice generation is heuristic-based and should not be treated as financial advice
- Currency display depends on the selected display currency and local exchange-rate logic
- Some brand icons may still require manual slug tuning for the best visual result

## License

This repository currently does not define a license. Add one before distributing the project publicly or accepting outside contributions.
