import { Helmet } from "react-helmet-async";

const SITE_NAME = "Albany Capital Region Lions Club";
const DEFAULT_DESCRIPTION =
  "The Albany Capital Region Lions Club serves the Albany and Schenectady communities through vision care, hunger relief, youth programs, and community service. District 20-R2, Lions Clubs International.";
const SITE_URL = "https://albanylionsclub.org";
const DEFAULT_IMAGE_PATH = "/opengraph.jpg";

function toAbsoluteUrl(urlOrPath: string | null | undefined): string {
  if (!urlOrPath) return `${SITE_URL}${DEFAULT_IMAGE_PATH}`;
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return urlOrPath;
  }
  const path = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  return `${SITE_URL}${path}`;
}

interface PageMetaProps {
  title?: string;
  description?: string;
  image?: string | null;
  path?: string;
  type?: "website" | "article";
}

export function PageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  path = "",
  type = "website",
}: PageMetaProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const ogImage = toAbsoluteUrl(image);
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
