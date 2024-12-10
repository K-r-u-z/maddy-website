# Cake Pops by Maddy

A modern, responsive website for a cake pop business built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design
- ⚡ Built with Next.js 14 for optimal performance
- 🎯 TypeScript for type safety
- 💅 Tailwind CSS for styling
- 🔤 Custom fonts (Geist and Geist Mono)
- 📱 Mobile-first approach
- 🖼️ Optimized image loading
- 🎭 Custom SVG icons

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18.17 or higher)
- npm, yarn, or pnpm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cake-pops-by-maddy.git
cd cake-pops-by-maddy
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory and add any necessary environment variables.
```bash
MONGODB_URI= 
NEXTAUTH_SECRET= 
ADMIN_USERNAME= 
ADMIN_PASSWORD= 
NEXTAUTH_URL= 
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
cake-pops-by-maddy/
├── src/
│   ├── app/
│   │   ├── fonts/         # Custom font files
│   │   ├── globals.css    # Global styles
│   │   └── page.tsx       # Home page
│   └── components/        # React components
├── public/               # Static assets
│   └── svg files        # Custom SVG icons
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Customization

- **Styling**: Modify `src/app/globals.css` and `tailwind.config.ts` for custom styles
- **Components**: Add or modify components in the `src/components` directory
- **Fonts**: Custom fonts are located in `src/app/fonts`
- **Icons**: SVG icons are stored in the `public` directory

## Building for Production

Build the application for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## Deployment

The easiest way to deploy this website is using the [Vercel Platform](https://vercel.com/new).

1. Push your code to a GitHub repository
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and deploy your site

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository.
