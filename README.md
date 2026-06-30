# TEDxOrileIganmu

Website for TEDxOrileIganmu — an independently TED-licensed event coming October 2026 to The Stable by Union Bank, Surulere, Lagos. One day. One hundred seats.

**tedxorileiganmu.com**

---

## Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) (React + SSR) |
| Styling | Tailwind CSS v4 |
| Database & Auth | [Supabase](https://supabase.com) |
| Payments | [Paystack](https://paystack.com) (live) |
| Package manager | Bun |

---

## Local development

### 1. Clone and install

```bash
git clone https://github.com/TEDx-OrileIganmu/tedxorileiganmu.git
cd tedxorileiganmu
bun install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"

PAYSTACK_SECRET_KEY="sk_live_..."
VITE_PAYSTACK_PUBLIC_KEY="pk_live_..."
```

> `PAYSTACK_SECRET_KEY` is server-side only and never exposed to the browser.

### 3. Database

Apply the migration to your Supabase project:

```bash
supabase db push
```

Or run the SQL in `supabase/migrations/` directly from the Supabase dashboard.

### 4. Run

```bash
bun dev
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, section cards, pull quote |
| `/about` | About the event and organiser |
| `/speakers` | Speaker lineup (TBA slots) |
| `/tickets` | Ticket tiers + Paystack checkout |
| `/support` | Volunteer, partner, and donate forms |
| `/auth` | Admin sign-in |
| `/admin` | Curator dashboard (authenticated) |

---

## Payment flow

1. Attendee selects a tier and fills in their details
2. A **pending** order is created in Supabase with a unique reference (`TXOI-xxx`)
3. The server calls the Paystack API using `PAYSTACK_SECRET_KEY` and returns an `authorization_url`
4. The browser redirects to Paystack's hosted checkout
5. On completion, Paystack redirects back to `/tickets?reference=TXOI-xxx`
6. The server verifies the transaction with Paystack and marks the order `paid` in Supabase

All payment logic lives in `src/lib/paystack.ts` as TanStack Start server functions.

---

## Ticket tiers

| Tier | Price | Perks |
|---|---|---|
| Regular | ₦3,500 | Full-day access, open seating |
| Standard | ₦5,000 | Reserved mid-room seat, refreshments, printed programme |
| VIP | ₦25,000 | Front row, full lunch & dinner, speaker reception |

---

## Admin dashboard

Sign in at `/auth` with a curator email. The dashboard at `/admin` shows:

- **Overview** — ticket orders, volunteer applications, partner inquiries, donations count + revenue
- **Tickets** — update payment status (pending → paid / failed / refunded)
- **Volunteers** — review and accept/decline applications
- **Partners** — manage sponsor and media inquiries
- **Donations** — track pledges and update payment status

Admin access is granted automatically to `ekanemmichael100@gmail.com` via a Supabase trigger on sign-up. Additional admins can be added via the `user_roles` table.

---

## Database tables

| Table | Description |
|---|---|
| `ticket_orders` | Attendee reservations with Paystack payment status |
| `volunteer_applications` | Volunteer sign-ups |
| `partner_inquiries` | Sponsor and media partner interest |
| `donations` | Direct donation pledges |
| `user_roles` | Admin role assignments |

Row Level Security is enabled on all tables. Public users can `INSERT` only. Admins can read and update everything.

---

## Deployment

Set all environment variables from `.env` in your hosting provider (Vercel, Cloudflare, Railway, etc.), then:

```bash
bun build
```

The build output is a Nitro server compatible with Node.js, Cloudflare Workers, and other runtimes.

---

## Contact

- Email: tedxorileiganmu@gmail.com
- Phone: +234 817 238 6902
- Instagram: [@tedxorileiganmu](https://instagram.com/tedxorileiganmu)

*This independent TEDx event is operated under license from TED.*
