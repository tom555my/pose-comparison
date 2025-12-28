import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';

export const meta: Route.MetaFunction = () => [
  { title: 'Pose Off! - AI-Powered Pose Comparison Party Game' },
  {
    name: 'description',
    content:
      'Challenge your friends to recreate poses and let AI judge your attempts! A fun, high-energy party game powered by Google Gemini AI.',
  },
  {
    name: 'keywords',
    content:
      'pose game, party game, AI game, pose comparison, Gemini AI, photo challenge, recreation game',
  },
  { name: 'author', content: 'Pose Off!' },
  { name: 'robots', content: 'index, follow' },

  // Open Graph / Facebook
  { property: 'og:type', content: 'website' },
  { property: 'og:title', content: 'Pose Off! - AI-Powered Pose Comparison Party Game' },
  {
    property: 'og:description',
    content:
      'Challenge your friends to recreate poses and let AI judge your attempts! A fun party game.',
  },
  { property: 'og:site_name', content: 'Pose Off!' },

  // Twitter
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: 'Pose Off! - AI Pose Comparison Game' },
  {
    name: 'twitter:description',
    content: 'Recreate the pose. Let AI be the judge. Party game fun!',
  },

  // Theme color for mobile browsers
  { name: 'theme-color', content: '#9333EA' },
];

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,100..1000&display=swap',
  },
  { rel: 'icon', type: 'image/png', href: '/favicon.png' },
  { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
  { rel: 'apple-touch-icon', href: '/favicon.png' },
  { rel: 'canonical', href: 'https://poseoff.app' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main className="section-container">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
