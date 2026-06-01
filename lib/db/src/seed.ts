import { db } from ".";
import {
  members, pages, projects, sponsors, donations, siteSettings,
} from "./schema";

async function seed() {
  console.log("🌱  Seeding database…");

  // ── Members ──────────────────────────────────────────────────
  console.log("  → members");
  await db.insert(members).values([
    {
      name: "Carlos Rivera",
      email: "carlos.rivera@albanylionsclub.org",
      phone: "518-555-0101",
      role: "president",
      joinDate: "2026-01-15",
      duesStatus: "paid",
      isVisible: true,
      bio: "Carlos has served the Albany community for over 15 years and founded the Capital Region Lions Club chapter in 2026. He is passionate about vision health programs and youth development.",
      status: "active",
    },
    {
      name: "Priya Nair",
      email: "priya.nair@albanylionsclub.org",
      phone: "518-555-0102",
      role: "secretary",
      joinDate: "2026-01-15",
      duesStatus: "paid",
      isVisible: true,
      bio: "Priya brings 10 years of nonprofit administration experience to her role as Club Secretary. She coordinates communications and manages membership records.",
      status: "active",
    },
    {
      name: "James Okafor",
      email: "james.okafor@albanylionsclub.org",
      phone: "518-555-0103",
      role: "treasurer",
      joinDate: "2026-02-01",
      duesStatus: "paid",
      isVisible: true,
      bio: "James is a certified public accountant and ensures the club's finances support maximum community impact. He chairs the fundraising committee.",
      status: "active",
    },
  ]).onConflictDoNothing();

  // ── Projects ─────────────────────────────────────────────────
  console.log("  → projects");
  await db.insert(projects).values([
    {
      slug: "charter-night-eye-screening-2026",
      title: "Charter Night Free Eye Screening",
      causeArea: "sight",
      description: "In partnership with Capital Eye Associates, we provided free vision screenings and eyeglasses referrals to 45 residents of the Capital Region during our Charter Night celebration. Community members without insurance received prioritized care and referrals to low-cost clinics.",
      projectDate: "2026-04-24",
      impactMetrics: {
        peopleServed: 45,
        hoursVolunteered: 32,
        fundsRaised: 1200,
      },
      partnerOrgs: ["Capital Eye Associates", "Lions Club International Foundation"],
      gallery: [
        { url: "/uploads/images/eye-screening-1.jpg", caption: "Volunteers conducting screenings" },
        { url: "/uploads/images/eye-screening-2.jpg", caption: "Attendees at Charter Night" },
      ],
      status: "published",
    },
    {
      slug: "capital-region-food-drive-spring-2026",
      title: "Capital Region Spring Food Drive",
      causeArea: "hunger",
      description: "Club members organized a multi-site food collection drive across Schenectady and Albany, partnering with local schools and grocery stores. All donations were delivered to the Regional Food Bank of Northeastern New York.",
      projectDate: "2026-03-15",
      impactMetrics: {
        itemsCollected: 523,
        hoursVolunteered: 48,
        peopleServed: 210,
      },
      partnerOrgs: ["Regional Food Bank of NE New York", "Price Chopper", "Golub Corporation"],
      gallery: [
        { url: "/uploads/images/food-drive-1.jpg", caption: "Food collection at Price Chopper" },
      ],
      status: "published",
    },
    {
      slug: "youth-vision-camp-summer-2026",
      title: "Youth Vision Camp",
      causeArea: "youth",
      description: "A week-long summer camp designed for children aged 8–14 with identified vision needs. Activities include science experiments, reading programs, and outdoor education — all adapted for participants with low vision.",
      projectDate: "2026-07-14",
      impactMetrics: {
        peopleServed: 28,
        hoursVolunteered: 120,
        fundsRaised: 4500,
      },
      partnerOrgs: ["Albany County Youth Bureau", "SUNY Albany Department of Education"],
      gallery: [],
      status: "draft",
    },
  ]).onConflictDoNothing();

  // ── Pages ─────────────────────────────────────────────────────
  console.log("  → pages");
  await db.insert(pages).values([
    {
      slug: "home",
      title: "Home",
      metaDescription: "Albany Capital Region Lions Club — We Serve, We Lead, We Impact. Proudly serving the greater Albany and Schenectady area.",
      sections: [
        {
          type: "hero",
          headline: "We Serve • We Lead • We Impact",
          subtext: "A proud chapter of Lions Clubs International serving the Albany and Schenectady communities with vision care, hunger relief, and youth programs.",
          ctaLabel: "Join Us",
          ctaHref: "/donate",
        },
        {
          type: "stats",
          items: [
            { label: "Members", value: "24" },
            { label: "Lives Touched", value: "280+" },
            { label: "Projects", value: "6" },
            { label: "Volunteer Hours", value: "200+" },
          ],
        },
        {
          type: "cta",
          heading: "Make a Difference Today",
          body: "Your donation funds free eye exams, food drives, and youth programs right here in the Capital Region.",
          buttonLabel: "Donate Now",
          buttonHref: "/donate",
        },
      ],
      status: "published",
    },
    {
      slug: "about",
      title: "About Us",
      metaDescription: "Learn about the Albany Capital Region Lions Club, our mission, history, and the Lions Club International movement.",
      sections: [
        {
          type: "text",
          heading: "Who We Are",
          body: "The Albany Capital Region Lions Club is a newly chartered chapter of Lions Clubs International, established in 2026 in District 20-R2. We are a diverse group of community leaders committed to the Lions motto: 'We Serve.'",
        },
        {
          type: "text",
          heading: "Our Mission",
          body: "To empower volunteers to serve their communities, meet humanitarian needs, encourage peace, and promote international understanding through Lions Clubs International.",
        },
      ],
      status: "published",
    },
    {
      slug: "get-involved",
      title: "Get Involved",
      metaDescription: "Join the Albany Capital Region Lions Club or support our work through volunteering, sponsorship, or donation.",
      sections: [
        {
          type: "cta",
          heading: "Become a Lion",
          body: "We meet on the third Tuesday of every month at 6:30 PM in Schenectady. New members are always welcome.",
          buttonLabel: "Learn More",
          buttonHref: "/contact",
        },
        {
          type: "cta",
          heading: "Sponsor Our Work",
          body: "Businesses and organizations can support our programs through sponsorship partnerships. Contact us to learn about tier benefits.",
          buttonLabel: "Become a Sponsor",
          buttonHref: "/sponsors",
        },
      ],
      status: "published",
    },
  ]).onConflictDoNothing();

  // ── Sponsors ─────────────────────────────────────────────────
  console.log("  → sponsors");
  await db.insert(sponsors).values([
    {
      name: "Capital Eye Associates",
      tier: "gold",
      website: "https://capitaleyeassociates.com",
      contactName: "Dr. Anita Sharma",
      contactEmail: "asharma@capitaleyeassociates.com",
      contactPhone: "518-555-0201",
      sortOrder: 1,
      status: "active",
    },
    {
      name: "Albany Medical Group",
      tier: "silver",
      website: "https://albanymedicalgroup.com",
      contactName: "Robert Walsh",
      contactEmail: "rwalsh@albanymedgroup.com",
      contactPhone: "518-555-0202",
      sortOrder: 1,
      status: "active",
    },
    {
      name: "Stewart's Shops",
      tier: "community",
      website: "https://stewarts.com",
      contactName: "Community Relations",
      contactEmail: "community@stewarts.com",
      sortOrder: 1,
      status: "active",
    },
  ]).onConflictDoNothing();

  // ── Donations ─────────────────────────────────────────────────
  console.log("  → donations");
  await db.insert(donations).values([
    {
      amount: "250.00",
      fundDesignation: "sight",
      donorName: "Margaret Callahan",
      donorEmail: "m.callahan@email.com",
      donorPhone: "518-555-0301",
      isAnonymous: false,
      isRecurring: false,
      status: "completed",
      transactionId: "txn_seed_001",
      notes: "In memory of my father who benefited from Lions eye care programs.",
    },
    {
      amount: "100.00",
      fundDesignation: "hunger",
      donorName: "Tech Albany LLC",
      donorEmail: "giving@techalbany.com",
      isAnonymous: false,
      isRecurring: true,
      recurringInterval: "monthly",
      status: "completed",
      transactionId: "txn_seed_002",
      notes: "Monthly corporate matching gift.",
    },
    {
      amount: "50.00",
      fundDesignation: "youth",
      donorName: null,
      donorEmail: null,
      isAnonymous: true,
      isRecurring: false,
      status: "completed",
      transactionId: "txn_seed_003",
    },
  ]).onConflictDoNothing();

  // ── Site Settings ─────────────────────────────────────────────
  console.log("  → site_settings");
  const defaults = [
    { key: "hero_headline",       value: "We Serve • We Lead • We Impact",             label: "Hero Headline",          description: "Main headline displayed on the homepage hero" },
    { key: "hero_subtext",        value: "A proud chapter of Lions Clubs International, serving the Albany and Schenectady communities with vision care, hunger relief, and youth programs.", label: "Hero Subtext", description: "Supporting text below the hero headline" },
    { key: "meeting_location",    value: "3311 East Lydius St, Schenectady, NY 12303",  label: "Meeting Location",       description: "Physical address where the club meets" },
    { key: "meeting_schedule",    value: "Third Tuesday of every month at 6:30 PM",     label: "Meeting Schedule",       description: "Human-readable meeting schedule" },
    { key: "contact_email",       value: "lionsclubalbany@gmail.com",                  label: "Contact Email",          description: "Primary public contact email" },
    { key: "contact_phone",       value: "845-216-5523",                               label: "Contact Phone",          description: "Primary public phone number" },
    { key: "club_founded",        value: "2026",                                        label: "Year Founded",           description: "Year the club was chartered" },
    { key: "district",            value: "20-R2",                                       label: "Lions District",         description: "Lions Club International district designation" },
    { key: "member_count",        value: "24",                                          label: "Member Count",           description: "Current active member count (shown on homepage)" },
    { key: "facebook_url",        value: "https://facebook.com/albanylionsclub",        label: "Facebook URL",           description: "Club Facebook page URL" },
    { key: "instagram_url",       value: "https://instagram.com/albanylionsclub",       label: "Instagram URL",          description: "Club Instagram profile URL" },
    { key: "donate_url",          value: "/donate",                                     label: "Donate URL",             description: "URL for the donate button (can be external)" },
    { key: "join_form_url",       value: "/contact",                                    label: "Join Form URL",          description: "URL for the membership application or contact form" },
  ];

  for (const row of defaults) {
    await db.insert(siteSettings).values(row).onConflictDoNothing();
  }

  console.log("✅  Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
