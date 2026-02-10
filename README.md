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

### Discussion Question

Imagine you are designing a streaming platform web application based on the CTV interface you've just completed. The application will manage content catalogs, handle user interactions with remote controls, and display media tiles in horizontal lists across different device types. Please answer **ONE** of the following discussion questions about the approach you'd take:

- **Frontend Architecture & State Management**: Describe how you would architect the frontend to handle complex state (user preferences, content data, navigation focus) across multiple screen types and input methods. How would you structure your components and manage data flow as users navigate with remote controls?

- **Performance & Data Loading**: How would you optimize the frontend for smooth performance when displaying thousands of content tiles with images and metadata? Discuss your approach to lazy loading, caching, and memory management for resource-constrained CTV devices.

- **API Design & Integration**: Describe how you would design the API contracts between your frontend and backend services for content discovery, user preferences, and real-time updates. How would you handle error states and offline scenarios?

- **Deployment & Infrastructure**: What infrastructure choices would you make to build and deploy this frontend application across different CTV platforms and web browsers? Consider how you'd handle device-specific optimizations and ensure consistent performance at scale.