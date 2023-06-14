# Template

A Next.js 13 application with authentication and payments, built with PlanetScale, Drizzle ORM, Lucia, Tailwind and LemonSqueezy

https://github.com/amosbastian/template/assets/9199433/ec672969-dd51-42ee-9dc6-4c3b69877e35

## About this project

I used this as a way to play around with the new Next.js app directory, so it is more than likely that things aren't optimal / implemented correctly, so **keep this in mind if you decide to fork it and use it for a real app**

If you encounter something that's broken, you can message me [@amosbastian](https://twitter.com/amosbastian) or create an issue here. Contributions are also very much welcome! 😁

## Features

- Nearly everything included in the Next.js app directory
- TypeScript ORM for SQL databases: [**Drizzle ORM**](https://github.com/drizzle-team/drizzle-orm)
- Authentication using [**Lucia**](https://github.com/pilcrowOnPaper/lucia)
- Database on [**PlanetScale**](https://planetscale.com/)
- UI components from [**shadcn/ui**](https://github.com/shadcn/ui)
- Blog using **MDX** and [**Contentlayer**](https://github.com/contentlayerdev/contentlayer)
- Subscriptions using [**LemonSqueezy**](https://www.lemonsqueezy.com/)
- Styled using **Tailwind CSS**
- Fetching data using RSCs and [**tRPC**](https://github.com/trpc/trpc)
- Email verification
- Teams with team member management
- RBAC using [**CASL**](https://github.com/stalniy/casl)
- Emails using [**Mailing**](https://github.com/sofn-xyz/mailing) and [Resend](https://resend.com)

## Known Issues

A list of things not working or implemented right now:

1. Sometimes MySQL will complain about too many connections: restart your Next.js app and it will go away
2. Pricing plans currently aren't synced to the database, which would be ideal
3. RBAC might not work as intended and I haven't tested it enough
4. Not using tRPC in RSCs, so not sure if that works properly
5. [Importing MJML breaks the new app router](https://github.com/vercel/next.js/issues/50042), which is why we put the email sending part in the `/pages` directory

## Running Locally

1. Install dependencies using npm:

```sh
npm install
```

2. Copy `.env.example` to `.env` and update the variables

```sh
cp .env.example .env
```

3. Start the development server:

```sh
npx nx serve web
```

### Setting up the database

#### Local

1. Log in to MySQL

```bash
mysql -u root
```

2. Create the database

```bash
CREATE DATABASE template;
```

3. Push your schema

```bash
npx drizzle-kit mysql:push
```

#### PlanetScale

You don't have to use a local database and use PlanetScale as your only database if you want

TODO:

### Authentication

To set up GitHub OAuth you need to

1. Go to https://github.com/settings/developers

2. Click "New OAuth App"

3. Add your authorisation callback URL: http://localhost:4200/api/oauth/github

### Emails

You can run Mailing to get a preview of the email in development mode instead of actually sending an email

```bash
npx mailing
```

In production it will use [Resend](resend.com), so you will need to get an API key and verify your domain.

### Payments

We are using LemonSqueezy for payments and syncing subscriptions via a webhook (`lemonsqueezy/route.ts`). If you want to test this locally, then you will need to use something like ngrok to expose the webhook:

```bash
npx ngrok http 4200
```

And then add the webhook URL (e.g. `https://abc.eu.ngrok.io/api/lemonsqueezy`) to [your webhook settings in LemonSqueezy](https://app.lemonsqueezy.com/settings/webhooks)

### Asset generation

To generate assets (favicon etc.) with your own logo you can replace `logo-mark.svg` with your and then use the following command

```bash
npm run asset-generator
```

### Thanks to

- [shadcn](https:twitter.com/shadcn)'s amazing example repositories and UI library
- Copied a lot of design & emails from Vercel
- Copied tRPC stuff from [@ploskovytskyy's repository](https://github.com/ploskovytskyy/next-app-router-trpc-drizzle-planetscale-edge)

## License

Licensed under the [MIT license](https://github.com/amosbastian/template/blob/main/LICENSE.md).
