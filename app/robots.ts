import { MetadataRoute } from "next";

const BASE_URL = "https://flexter.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/checkout/success"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}