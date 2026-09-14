# Daniel Meireles Portfolio

Personal portfolio built to present projects, technical background and contact links.

The website is a single-page Next.js application with light and dark themes, Portuguese and English content, animated sections, project previews and an optional Spotify now-playing card.

## Tech stack

- Next.js and React
- TypeScript
- Tailwind CSS with the global stylesheet in `src/app/globals.css`
- Node.js scripts for the local Spotify authorization flow

Vercel appears in the portfolio's own technology list, but this repository does not contain hosting configuration or deployment workflows. The current deployment target is therefore not defined here.

## Running locally

The repository does not declare a required Node.js or npm version.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

The available package scripts are:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Start the production server after a build. |
| `npm run lint` | Run the configured Next.js lint command. |
| `npm run spotify:auth` | Run the local Spotify authorization helper. |

Spotify is optional for the rest of the portfolio. Its setup and runtime behavior are documented in [`docs/spotify.md`](docs/spotify.md).

## Project structure

```txt
src/
  app/          App Router entrypoints, global styles and the Spotify API route
  components/   Page sections and reusable UI components
  context/      Theme, language and Spotify providers
  data/         Portfolio content, translations and Spotify response parsing
  lib/          Server-side Spotify integration

scripts/        Local Spotify authorization helper and its tests
public/         Images, CV files and other static assets
docs/           Maintainer documentation
```

The homepage is composed in `src/app/page.tsx`. Global providers are nested in `src/components/Providers.tsx`; the page sections consume those providers through the components under `src/components/`.

## Maintaining portfolio content

The main content is managed in `src/data/content.ts`:

- UI strings are stored in `ui.pt` and `ui.en`.
- Each project has Portuguese and English descriptions, categories, tags, status and repository/site links.
- Social links and CV paths are stored in `socials`.
- Project images use paths relative to `public/`.

When changing a project, review its links, both language descriptions and its image path together. The UI falls back to a generated preview when an image fails to load.

Theme and language preferences are stored in the browser's `localStorage`; they are not route-based locales or server-side user settings.

## Development notes

The Spotify route reads server-side environment variables. Keep `.env.local` out of version control; `.env` and `.env.*` are ignored by `.gitignore`. Never place client secrets or refresh tokens in source files or variables exposed to the browser.

The direct Node test file for the authorization helper is `scripts/spotify-auth.test.mjs`. There is currently no `npm test` script.
