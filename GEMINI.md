# Pose Off! - Project Context

## Project Overview
**Pose Off!** is a high-energy party game where users compete to recreate poses. A host provides a target pose image, and players upload their best attempt. Google Gemini AI acts as the judge, analyzing the images to provide a similarity score and roast-style feedback.

The application is built as a Server-Side Rendered (SSR) React app using React Router v7, deployed to Cloudflare Workers.

## Tech Stack
- **Framework:** React Router v7 (SSR)
- **Runtime:** Cloudflare Workers (Node.js compatibility mode)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/vite`)
- **AI Integration:** Google Gemini Flash (`gemini-3-flash-preview`) via Vercel AI SDK Core (`ai`) and Google Provider (`@ai-sdk/google`).
- **Animations:** Framer Motion
- **Icons:** Lucide React, React Icons
- **Tooling:** Vite, Wrangler, Oxlint, Oxfmt

## Building and Running

### Prerequisites
- Node.js v24+
- `pnpm`
- Google Gemini API Key

### Commands
- **Install Dependencies:**
  ```bash
  pnpm install
  ```
- **Development Server:**
  ```bash
  pnpm run dev
  ```
- **Type Checking:**
  ```bash
  pnpm run typecheck
  ```
- **Linting:**
  ```bash
  pnpm run lint
  ```
- **Formatting:**
  ```bash
  pnpm run format
  ```
- **Build for Production:**
  ```bash
  pnpm run build
  ```
- **Deploy to Cloudflare:**
  ```bash
  pnpm run deploy
  ```

### Environment Variables
Local development requires a `.dev.vars` file in the root directory:
```
GEMINI_API_KEY=your_api_key_here
```

## Key Files and Structure

### Core Application (`app/`)
- **`app/routes.ts`**: Route configuration. Defines `/` (UI) and `/api/compare` (AI Endpoint).
- **`app/routes/party.tsx`**: Main UI component. Handles image uploads, previews, and real-time streaming of AI results using `experimental_useObject`.
- **`app/routes/api.compare.ts`**: (Inferred) Server-side API route handler that calls the Gemini service.
- **`app/lib/gemini.server.ts`**: Contains the `comparePosesStream` function. Uses `streamText` with the Gemini model to analyze image pairs.
- **`app/lib/schema.ts`**: (Inferred) Zod schema defining the structured output expected from the AI (score, feedback).

### Infrastructure & Config
- **`workers/app.ts`**: Cloudflare Worker entry point. Adapts React Router's request handler for the Cloudflare runtime.
- **`wrangler.jsonc`**: Cloudflare Workers configuration. Enables Node.js compatibility and observability.
- **`vite.config.ts`**: Vite configuration with plugins for Cloudflare, Tailwind CSS, and React Router.
- **`react-router.config.ts`**: React Router specific configuration.

## Development Conventions
- **Routing:** Uses React Router v7's `routes.ts` config file pattern.
- **AI Streaming:** Leverages Vercel AI SDK's `streamText` on the server and `useObject` on the client for structured, streaming responses.
- **Styling:** Uses Tailwind CSS v4.
- **Linting/Formatting:** Relies on the Oxidation Compiler (Oxc) tools (`oxlint`, `oxfmt`) for performance.
- **Type Safety:** Strict TypeScript usage, including Cloudflare Worker types (`Env`, `ExecutionContext`) and Zod schemas for AI data validation.
