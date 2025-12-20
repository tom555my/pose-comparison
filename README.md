# Tommy Chung | Full-Stack AI Developer

A premium, minimalist personal portfolio website built with React Router 7 and Tailwind CSS 4.

## 🚀 Tech Stack

- **Core**: [React Router 7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)

## 🛠 Tooling

- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linter**: [oxlint](https://oxc.rs/docs/guide/usage/linter.html) (Fastest JS linter)
- **Formatter**: [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) (Fastest JS formatter)
- **Version Management**: Enforced Node.js >= 24

## 🏁 Getting Started

### Prerequisites

Ensure you are using **Node.js v24** or higher. You can use `nvm` to switch:

```bash
nvm use
```

### Installation

Install dependencies using `pnpm`:

```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm run dev
```

The site will be available at `http://localhost:5173`.

### Linting & Formatting

Clean and format the code using high-performance Rust-based tools:

```bash
# Run linter
pnpm run lint

# Run formatter
pnpm run format
```

## 🏗 Project Structure

- `app/components/`: Reusable UI components (Hero, Experience, Projects, Skills).
- `app/routes/`: Page routes.
- `app/app.css`: Global styles and Tailwind 4 design tokens.
- `public/`: Static assets (favicon, etc.).

## 📦 Building for Production

Create a production build:

```bash
pnpm run build
```

## ☁️ Deployment

Deploy to Cloudflare:

```bash
pnpm run deploy
```

---

Built with ❤️ by Tommy Chung.
