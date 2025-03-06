export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
  contactEmail: string;
  industry: string;
};

export const siteConfig: SiteConfig = {
  name: "Rezervasyon",
  description: "A customizable reservation platform for appointment-based businesses",
  url: "https://rezervasyon.app",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/rezervasyon",
    github: "https://github.com/rezervasyon",
  },
  contactEmail: "contact@rezervasyon.app",
  industry: "Car Wash"
}; 