export type SkillRow = { category: string; jp: string; items: string };

export const SKILLS: SkillRow[] = [
  {
    category: "Frontend",
    jp: "前面",
    items:
      "React · Next.js · React Native · Tamagui · Tailwind · ShadCN · ANTD · Bootstrap · MUI · Redux · GSAP",
  },
  {
    category: "Languages",
    jp: "言語",
    items: "JavaScript · TypeScript · HTML · CSS · Java · PHP",
  },
  {
    category: "Backend",
    jp: "背面",
    items:
      "Node.js · Express.js · REST API · MVC · Clean Architecture · JWT · Kafka · EJS",
  },
  { category: "Database", jp: "データ", items: "MongoDB · PostgreSQL · MySQL" },
  {
    category: "Services",
    jp: "サービス",
    items:
      "Firebase · Socket.IO · Cloudinary · Razorpay · Zegocloud · Passport.js · Nodemailer · Chart.js",
  },
  {
    category: "Deployment",
    jp: "配備",
    items: "Vercel · Render · NGINX · Hostinger · Android",
  },
  { category: "DevOps", jp: "運用", items: "Docker · Kubernetes · AWS · Git · GitHub" },
  { category: "Testing", jp: "試験", items: "Mocha · ESLint · Postman" },
  { category: "Concepts", jp: "概念", items: "DSA · OOPS · Microservices · JSON" },
  { category: "Tools", jp: "道具", items: "Figma · Notion · Moon Modeler" },
];

export const SKILLS_COPY = {
  eyebrow: "技能 · The whole kit",
  title: ["Every", "tool", "in the rack."] as const,
  footerSuffix: "categories · 全部で",
  closeHint: "Esc to close",
} as const;
