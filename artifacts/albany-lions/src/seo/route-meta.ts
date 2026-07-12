export interface RouteMeta {
  title: string;
  description: string;
  ogType?: "website" | "article";
}

export const SITE_NAME = "Albany Capital Region Lions Club";
export const DEFAULT_DESCRIPTION =
  "The Albany Capital Region Lions Club serves the Albany and Schenectady communities through vision care, hunger relief, youth programs, and community service. District 20-R2, Lions Clubs International.";
export const DEFAULT_OG_IMAGE = "/opengraph.jpg";
export const SITE_URL = "https://albanylionsclub.org";

export const staticRouteMeta: Record<string, RouteMeta> = {
  "/": {
    title: SITE_NAME,
    description:
      "The Albany Capital Region Lions Club serves Albany and Schenectady through vision care, hunger relief, youth programs, and community service. Join us — We Serve, We Lead, We Impact.",
  },
  "/about": {
    title: `About Us | ${SITE_NAME}`,
    description:
      "Learn about the Albany Capital Region Lions Club — our mission, vision, history, and commitment to serving the Albany and Schenectady communities as part of Lions Clubs International.",
  },
  "/leadership": {
    title: `Leadership | ${SITE_NAME}`,
    description:
      "Meet the officers, directors, and members leading the Albany Capital Region Lions Club. Our dedicated leadership team drives our service programs across Albany and Schenectady.",
  },
  "/events": {
    title: `Events & Programs | ${SITE_NAME}`,
    description:
      "Upcoming events and programs from the Albany Capital Region Lions Club. Join us for community service projects, fundraisers, and social gatherings in Albany and Schenectady.",
  },
  "/blog": {
    title: `Club Blog | ${SITE_NAME}`,
    description:
      "News, stories, and updates from the Albany Capital Region Lions Club. Read about our community service events, member spotlights, and club announcements.",
  },
  "/calendar": {
    title: `Event Calendar | ${SITE_NAME}`,
    description:
      "Browse the Albany Capital Region Lions Club event calendar. Find upcoming meetings, service projects, and community events in the Albany and Schenectady area.",
  },
  "/magazine": {
    title: `Club Magazine | ${SITE_NAME}`,
    description:
      "Read the Albany Capital Region Lions Club magazine. Featuring club news, member stories, community impact reports, and highlights from our service programs.",
  },
  "/projects": {
    title: `Community Projects | ${SITE_NAME}`,
    description:
      "Explore community service projects led by the Albany Capital Region Lions Club — vision care, hunger relief, youth programs, environmental initiatives, and more.",
  },
  "/sponsors": {
    title: `Sponsors & Partnerships | ${SITE_NAME}`,
    description:
      "Support the Albany Capital Region Lions Club as a sponsor. View our 2026 sponsorship packages — Platinum, Gold, Silver, Bronze, and Friend — and partner with us to serve our community.",
  },
  "/gallery": {
    title: `Photo Gallery | ${SITE_NAME}`,
    description:
      "Photo gallery from Albany Capital Region Lions Club events — charter night, community service projects, Eid celebrations, fundraisers, and more moments from our club community.",
  },
  "/donate": {
    title: `Donate & Support | ${SITE_NAME}`,
    description:
      "Support the Albany Capital Region Lions Club with a tax-deductible donation. Your gift funds vision care, hunger relief, youth programs, and community service in Albany and Schenectady.",
  },
  "/contact": {
    title: `Contact Us | ${SITE_NAME}`,
    description:
      "Get in touch with the Albany Capital Region Lions Club. Whether you want to join, volunteer, donate, or partner with us — we'd love to hear from you.",
  },
  "/sponsors/magazine-advertisers-2026": {
    title: `Magazine Advertisers 2026 | ${SITE_NAME}`,
    description:
      "Advertisers featured in the 2026 Albany Capital Region Lions Club magazine. Thank you to our business partners for their support of our community service mission.",
  },
};
