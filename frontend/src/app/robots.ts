import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dashboard", // Disallow indexing of private dashboard routes containing user metrics and resumes
    },
    sitemap: "https://margapply-saas-f5vl.vercel.app/sitemap.xml",
  };
}
