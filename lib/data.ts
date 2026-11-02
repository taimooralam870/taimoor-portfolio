export const profile = {
  name: "Taimoor Alam",
  role: "Shopify Plus Developer & CRO Specialist",
  email: "taimooralam870@gmail.com",
  phone: "+92 317 5992862",
  whatsapp: "https://wa.me/923175992862",
  linkedin: "https://www.linkedin.com/in/taimooralam870/",
  location: "Chakwal, Punjab, Pakistan",
  timezone: "Asia/Karachi",
  cv: "https://drive.google.com/file/d/1cvrSMNEYWNt9sLgntPKCnbx9QLo7GWZr/view?usp=drive_link",
};

export const roles = [
  "Shopify Plus Developer",
  "CRO Specialist",
  "A/B Test Builder",
  "Checkout Engineer",
  "Theme Architect",
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "lab", label: "Lab" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export const stats = [
  { value: 4, suffix: "+", label: "Years building Shopify & Shopify Plus stores" },
  { value: 41, prefix: "+", suffix: "%", label: "Revenue per visitor on a winning PDP test" },
  { value: 44, prefix: "+", suffix: "%", label: "Subscription share of orders after a buy-box redesign" },
  { value: 4, label: "Markets served: US, UK, EU & Canada" },
];

export type Metric = {
  label: string;
  lift: number;
  control?: number;
  variant?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export type Experiment = {
  id: string;
  index: string;
  name: string;
  surface: string;
  hypothesis: string;
  headline: Metric;
  metrics: Metric[];
  estimates: { label: string; value: number; prefix?: string; suffix?: string }[];
  proof: string;
  // revenue per visitor, used by the calculator
  rpv: { control: number; lift: number };
};

export const experiments: Experiment[] = [
  {
    id: "pdp",
    index: "01",
    name: "Clarity-focused product page",
    surface: "Product page · Intelligems",
    hypothesis:
      "When the product page makes shoppers work to understand what they're buying, they leave. Lead with clarity and more of them will add to cart and check out.",
    headline: { label: "Revenue per visitor", lift: 41, control: 9.75, variant: 13.74, prefix: "$", decimals: 2 },
    metrics: [
      { label: "Conversion rate", lift: 29.7, control: 7.8, variant: 10.2, suffix: "%", decimals: 1 },
      { label: "Add-to-cart rate", lift: 27.4, control: 15, variant: 19, suffix: "%", decimals: 1 },
      { label: "Profit per visitor", lift: 31.2, control: 6.47, variant: 8.48, prefix: "$", decimals: 2 },
      { label: "Average order value", lift: 8.7, control: 124.27, variant: 135.07, prefix: "$", decimals: 2 },
    ],
    estimates: [
      { label: "Est. revenue / month", value: 56887, prefix: "+$" },
      { label: "Est. profit / month", value: 28698, prefix: "+$" },
      { label: "Est. orders / month", value: 332, prefix: "+" },
    ],
    proof: "/images/proof/pdp-test.webp",
    rpv: { control: 9.75, lift: 40.99 },
  },
  {
    id: "buybox",
    index: "02",
    name: "Redesigned buy box",
    surface: "Subscription store · Intelligems",
    hypothesis:
      "A buy box that makes the subscription value obvious will move more shoppers to subscribe, and lift order value without hurting conversion.",
    headline: { label: "Subscription share of orders", lift: 44, control: 29.9, variant: 43.1, suffix: "%", decimals: 1 },
    metrics: [
      { label: "Average order value", lift: 11.8, control: 190.62, variant: 213.16, prefix: "$", decimals: 2 },
      { label: "Revenue per visitor", lift: 16.6, control: 10.98, variant: 12.8, prefix: "$", decimals: 2 },
      { label: "Profit per visitor", lift: 16.2, control: 7.58, variant: 8.81, prefix: "$", decimals: 2 },
      { label: "Conversion rate", lift: 4.3, control: 5.76, variant: 6.01, suffix: "%", decimals: 2 },
    ],
    estimates: [
      { label: "Est. revenue / month", value: 20034, prefix: "+$" },
      { label: "Est. profit / month", value: 13514, prefix: "+$" },
      { label: "Est. orders / month", value: 27, prefix: "+" },
    ],
    proof: "/images/proof/buybox-test.webp",
    rpv: { control: 10.98, lift: 16.6 },
  },
];

export const services = [
  {
    title: "Custom OS 2.0 Themes",
    body: "Custom Online Store 2.0 themes and reusable sections, built from Figma or from scratch, all editable in the theme editor.",
    tags: ["Liquid", "Sections", "Metaobjects", "Figma → Shopify"],
  },
  {
    title: "CRO & A/B Testing",
    body: "I plan, build, QA and analyze tests on product pages, buy boxes, offers and pricing, then ship the winners.",
    tags: ["Intelligems", "Hypothesis design", "Shopify Analytics"],
  },
  {
    title: "Checkout & Functions",
    body: "Checkout UI extensions and Shopify Functions for discounts, checkout rules and validations on Shopify Plus.",
    tags: ["Checkout extensions", "Shopify Functions", "Plus"],
  },
  {
    title: "Subscriptions",
    body: "Subscription purchase flows and buy boxes built to grow recurring revenue, on Recharge and Loop.",
    tags: ["Recharge", "Loop", "Buy-box UX"],
  },
  {
    title: "Speed & Core Web Vitals",
    body: "Faster stores that rank and convert better. Also bundles, product filters, discount logic and B2B/wholesale setups.",
    tags: ["CWV", "Bundles", "Filters", "B2B"],
  },
  {
    title: "Integrations",
    body: "Connecting stores to ERPs, 3PLs, marketplaces and subscription platforms through APIs and webhooks.",
    tags: ["Admin GraphQL", "Webhooks", "ERP", "3PL"],
  },
];

export const projects = [
  {
    name: "ProLon",
    url: "https://prolonlife.com",
    domain: "prolonlife.com",
    kind: "Shopify Plus · Multi-region",
    body: "Multi-region Shopify Plus store for a fasting-nutrition brand: custom theme sections, subscription purchase flows, checkout customization and ERP integration.",
    tags: ["Shopify Plus", "Subscriptions", "Checkout", "ERP"],
    image: "/images/work/prolon.webp",
    color: "#c8ff2e",
  },
  {
    name: "L-Nutra Health",
    url: "https://l-nutrahealth.com",
    domain: "l-nutrahealth.com",
    kind: "Custom theme · Landing pages",
    body: "Custom responsive Shopify theme and content-driven landing pages for a nutrition-science company.",
    tags: ["Custom theme", "Landing pages", "Content"],
    image: "/images/work/l-nutra.webp",
    color: "#8b5cf6",
  },
  {
    name: "MoxieLash",
    url: "https://moxielash.com",
    domain: "moxielash.com",
    kind: "High-volume beauty",
    body: "High-volume beauty store: custom product filters, bundles, discount logic, app integrations and performance tuning.",
    tags: ["Filters", "Bundles", "Discounts", "Performance"],
    image: "/images/work/moxielash.webp",
    color: "#ff5c9a",
  },
];

export const process = [
  { step: "Dig into data", body: "Analytics, heatmaps and funnels show where shoppers drop off and why." },
  { step: "Form a hypothesis", body: "One clear, testable bet tied to a metric that matters: RPV, CR, AOV or subscription share." },
  { step: "Build the variant", body: "I code the variant myself in Liquid and JavaScript, so no handoff gets in the way and every pixel is intentional." },
  { step: "Run the test", body: "QA across devices, then a clean split in Intelligems against control." },
  { step: "Ship the winner", body: "Winners go into the theme permanently, and what we learn feeds the next test." },
];

export const stack = [
  {
    group: "Shopify",
    items: [
      "Liquid",
      "Shopify Plus",
      "OS 2.0 Themes",
      "Shopify CLI",
      "Storefront API",
      "Admin GraphQL",
      "Metafields",
      "Metaobjects",
      "Checkout Extensions",
      "Shopify Functions",
      "Custom & Public Apps",
    ],
  },
  {
    group: "CRO",
    items: [
      "Intelligems",
      "A/B Testing",
      "Hypothesis Design",
      "Landing Pages",
      "Funnels",
      "Buy-box Optimization",
      "Offer Optimization",
      "Shopify Analytics",
    ],
  },
  {
    group: "Front-end & more",
    items: [
      "JavaScript ES6+",
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "Node.js",
      "Tailwind CSS",
      "SCSS",
      "WordPress",
      "WooCommerce",
      "Recharge",
      "Loop",
    ],
  },
];

export const marqueeWords = [
  "Shopify Plus",
  "Liquid",
  "A/B Testing",
  "Checkout Extensions",
  "Shopify Functions",
  "Recharge",
  "Loop",
  "Core Web Vitals",
  "Intelligems",
  "Metaobjects",
  "GraphQL",
];
