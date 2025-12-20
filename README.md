# Pose Off! - Party Game

**Pose Off!** is a high-energy party game where teams compete to recreate poses. A host provides a target pose, teams upload their best attempt, and AI (Google Gemini 1.5 Flash) acts as the judge, scoring the similarity and providing roast-style feedback.

## Features

- **AI Judging**: Uses Google's Gemini 1.5 Flash model to analyze limb angles, body orientation, and facial expressions.
- **Instant Feedback**: Get a similarity percentage (0-100%) and a fun, context-aware comment from the AI judge.
- **Modern UI**: Built with a sleek, dark-mode aesthetic using Tailwind CSS v4 and Framer Motion animations.

## Prerequisites

- **Node.js**: v24 or higher.
- **Package Manager**: `pnpm` (recommended).
- **API Key**: A Google Gemini API Key.

## Setup

1.  **Install Dependencies**

    ```bash
    pnpm install
    ```

2.  **Environment Configuration**
    Create a `.dev.vars` file in the root directory and add your Gemini API key:

    ```bash
    GEMINI_API_KEY=your_api_key_here
    ```

3.  **Run Locally**
    Start the development server:
    ```bash
    pnpm run dev
    ```
    Open your browser to [http://localhost:5173](http://localhost:5173).

## Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com/)
- **Deployment**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI Model**: [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## Development

- **Typecheck**: `pnpm run typecheck`
- **Build**: `pnpm run build`
- **Deploy**: `pnpm run deploy`
