Hotel The Retinue – customer booking portal (Next.js). Book rooms, view bookings, sign up with OTP, blog.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE` | **No** | API base URL. Default: `https://hoteltheretinue.in/api/public` |
| `NEXT_PUBLIC_USE_API_PROXY` | **No** | Set to `true` for **local dev** so API calls go via your app (avoids CORS from localhost). Leave unset/false in production. |

- **Local:** Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_USE_API_PROXY=true` so availability, booking, and signup work without CORS.
- **Vercel:** Do **not** set `NEXT_PUBLIC_USE_API_PROXY` (or set false). Ensure the API allows your deployed origin in CORS.

No API keys or secrets are needed in this frontend; the backend handles auth and CORS.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
