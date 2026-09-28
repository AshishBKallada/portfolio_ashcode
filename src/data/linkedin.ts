export type LinkedInItem = {
  id: string;
  title: string;
  tag: string;
  note: string;
  image: string;
  width: number;
  height: number;
};

export const linkedinSays = {
  title: "What my LinkedIn says",
  subtitle: "more than a highlight reel",
  headingSmallOne: "What my",
  headingItalic: "LinkedIn",
  headingSmallTwo: "more than a highlight reel —",
  headingLarge: "says.",
  teaser: "Real posts. Real reach.",
  stat: "53k+ impressions on a single post.",
  cta: "Read on LinkedIn",
  href: "https://www.linkedin.com/in/ashishbkallada",
  items: [
    {
      id: "bca-grad",
      title: "From BCA Graduate to Full Stack Developer",
      tag: "Career",
      note: "17,149 impressions",
      image: "/images/linkedin/posts/post-1.png",
      width: 572,
      height: 870,
    },
    {
      id: "pwa",
      title: "Do you know what PWAs are?",
      tag: "Web",
      note: "9,175 impressions",
      image: "/images/linkedin/posts/post-2.png",
      width: 572,
      height: 870,
    },
    {
      id: "sql-injection",
      title: "Still fearing SQL injections?",
      tag: "Security",
      note: "3,945 impressions",
      image: "/images/linkedin/posts/post-3.png",
      width: 572,
      height: 870,
    },
    {
      id: "discipline",
      title: "Passion or Pure discipline",
      tag: "Craft",
      note: "4,553 impressions",
      image: "/images/linkedin/posts/post-4.png",
      width: 572,
      height: 870,
    },
    {
      id: "react-native",
      title: "React devs, learning React Native",
      tag: "Mobile",
      note: "53,547 impressions",
      image: "/images/linkedin/posts/post-5.png",
      width: 572,
      height: 870,
    },
    {
      id: "deadline",
      title: "Mobile app in one week",
      tag: "Ship",
      note: "2,237 impressions",
      image: "/images/linkedin/posts/post-6.png",
      width: 572,
      height: 870,
    },
  ] satisfies LinkedInItem[],
} as const;
