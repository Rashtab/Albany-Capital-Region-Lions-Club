# Albany Capital Region Lions Club Website

A professional, responsive website for the Albany Capital Region Lions Club built with React + Vite.

## How to Run

The site runs automatically in Replit. To start it manually:

```bash
pnpm --filter @workspace/albany-lions run dev
```

---

## How to Update Club Content

All club content lives in one file:

**`artifacts/albany-lions/src/data/clubData.ts`**

Open that file and look for the `// UPDATE:` comments — they mark every field you should change.

---

### How to Update Club Officers

Find the `officers` array in `clubData.ts`. Each officer looks like this:

```ts
{
  id: 1,
  name: "Lion President",       // Replace with the officer's full name
  title: "Club President",      // The officer's title
  bio: "...",                   // A short bio (1-2 sentences)
  photo: null,                  // Add a photo path like "/images/officers/president.jpg"
                                // or leave null to show initials
}
```

Add or remove entries from the array as needed. Officers appear in the same order as the array.

---

### How to Update Sponsors

Find the `sponsors` array in `clubData.ts`. Each sponsor looks like this:

```ts
{
  id: 1,
  name: "Platinum Sponsor",     // Business name
  tier: "Platinum",             // Tier: Platinum, Gold, Silver, or Community
  description: "...",           // Short tagline or description
  website: null,                // Add URL like "https://example.com"
  logo: null,                   // Add logo path like "/images/sponsors/logo.png"
  phone: null,                  // Phone number (optional)
  address: null,                // Address (optional)
}
```

---

### How to Update Events

Find the `events` array in `clubData.ts`. Each event looks like this:

```ts
{
  id: 1,
  title: "Annual Vision Screening",
  date: "June 14, 2025",
  time: "9:00 AM – 2:00 PM",
  location: "Albany Community Center, Albany, NY",
  description: "...",
  category: "Health",            // Health, Community Service, Fundraiser, Youth, Environment
  image: null,                   // Add image path if available
  registrationLink: null,        // Add registration URL if applicable
}
```

Remove past events and add new ones as they are planned.

---

### How to Replace Images / Logos

**Officer Photos:**
1. Add the photo file to `artifacts/albany-lions/src/assets/images/`
2. In `clubData.ts`, update the officer's `photo` field:
   ```ts
   photo: "/images/officers/president.jpg"
   ```

**Gallery Photos:**
1. Add photos to `artifacts/albany-lions/src/assets/images/`
2. In `clubData.ts`, update the `galleryImages` array:
   ```ts
   { id: 1, src: "/images/gallery/event-2025.jpg", alt: "Event description", caption: "Caption here" }
   ```

**Sponsor Logos:**
1. Add logo files to `artifacts/albany-lions/src/assets/images/`
2. In `clubData.ts`, update the sponsor's `logo` field:
   ```ts
   logo: "/images/sponsors/acme-logo.png"
   ```

---

### How to Update Contact / Payment Info

All contact and donation information is in `clubData.ts`:

- `clubInfo.email` — Club email address
- `clubInfo.phone` — Club phone number
- `clubInfo.address` — Mailing/contact address
- `clubInfo.facebook` / `.instagram` / `.twitter` — Social media URLs
- `donationInfo.checkPayable` — Name on the check
- `donationInfo.mailingAddress` — Where to mail checks
- `donationInfo.zelle` — Zelle email or phone

---

## How to Deploy the Site

1. Click **Publish** in Replit
2. The site will be live at your `.replit.app` domain
3. You can also connect a custom domain in the Replit Deployment settings

---

## Site Structure

| Page | Route | File |
|------|-------|------|
| Home | `/` | `src/pages/home.tsx` |
| About | `/about` | `src/pages/about.tsx` |
| Leadership | `/leadership` | `src/pages/leadership.tsx` |
| Events | `/events` | `src/pages/events.tsx` |
| Sponsors | `/sponsors` | `src/pages/sponsors.tsx` |
| Gallery | `/gallery` | `src/pages/gallery.tsx` |
| Donate | `/donate` | `src/pages/donate.tsx` |
| Contact | `/contact` | `src/pages/contact.tsx` |

All shared navigation (header + footer) is in `src/components/layout.tsx`.
