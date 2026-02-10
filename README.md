<img width="1630" height="506" alt="image" src="https://github.com/user-attachments/assets/096933f9-495e-4fcd-9765-253602940024" />


# Horizontal keyboard-navigable list

A React app that shows a horizontal list of content items. The focused item is always in the first (leftmost) position. You can move focus with the **Left** and **Right** arrow keys. Item cover images use `images.artwork_portrait` from the provided data.

## Requirements

- **Node.js** 18 or later
- **npm** (or yarn)

## Setup

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open the URL shown in the terminal (e.g. `http://localhost:5173`). Click or focus the list area and use **Arrow Left** / **Arrow Right** to move focus.

## Build

```bash
npm run build
```

Output is in the `dist/` directory. Preview the production build with:

```bash
npm run preview
```

## Tests

- **Unit tests** (Vitest + React Testing Library):

  ```bash
  npm run test
  ```

- **E2E tests** (Playwright; starts the dev server automatically):

  ```bash
  npm run test:e2e
  ```

  To install Playwright browsers first (only needed once):

  ```bash
  npx playwright install chromium
  ```
