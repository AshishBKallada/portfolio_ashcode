"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  content: {
    sections: {
      heading?: string;
      paragraphs: string[];
    }[];
  };
  sidebar: {
    author: {
      name: string;
      description: string;
    };
    topStories: {
      title: string;
      image: string;
      slug: string;
    }[];
    topic: string;
    perspective: string;
    tags: string[];
  };
}

const blogPosts: Record<string, BlogPost> = {
  "the-creative-website-guide": {
    slug: "the-creative-website-guide",
    title: "The Creative Website Guide: Building Digital Experiences That Stand Out",
    author: "Ashish Kumar",
    date: "January 11, 2026",
    readTime: "8 min read",
    image: "/hero-background.jpg",
    content: {
      sections: [
        {
          heading: "A year of strategic adaptation",
          paragraphs: [
            "The digital landscape has evolved dramatically, and creating websites that truly stand out requires more than just technical skills. It demands a deep understanding of user experience, visual storytelling, and creative problem-solving.",
            "In this comprehensive guide, we'll explore the fundamental principles of building creative websites that not only look stunning but also deliver exceptional user experiences. From initial concept to final deployment, every step matters in creating a digital presence that resonates with your audience.",
          ],
        },
        {
          heading: "Meeting design and functionality demands",
          paragraphs: [
            "Modern web development requires a balance between aesthetic appeal and functional excellence. The best websites seamlessly integrate beautiful design with intuitive navigation, ensuring users can easily find what they're looking for while enjoying the journey.",
            "Key considerations include responsive design principles, performance optimization, and accessibility standards. These aren't just technical requirements—they're essential components of a creative website that works for everyone, everywhere.",
          ],
        },
        {
          heading: "Integrating technology with purpose",
          paragraphs: [
            "Technology should serve creativity, not hinder it. Modern frameworks like React and Next.js provide powerful tools for building dynamic, interactive experiences. However, the real magic happens when these tools are used thoughtfully to enhance the user's journey.",
            "From smooth animations that guide attention to micro-interactions that delight, every technical decision should support the creative vision. This approach ensures that your website isn't just functional—it's memorable.",
          ],
        },
      ],
    },
    sidebar: {
      author: {
        name: "Ashish Kumar",
        description: "A creative developer and designer with a passion for building digital experiences that combine aesthetic beauty with functional excellence. Specializing in modern web technologies and user-centered design.",
      },
      topStories: [
        {
          title: "How to rewire your brain to be addicted to coding",
          image: "/skills-background.jpg",
          slug: "how-to-rewire-your-brain-to-be-addicted-to-coding",
        },
        {
          title: "Everything You Need to Know To Make A Good Developer Portfolio Site",
          image: "/contact-image.jpg",
          slug: "everything-you-need-to-know-to-make-a-good-developer-portfolio-site",
        },
      ],
      topic: "Web Development",
      perspective: "Insights",
      tags: ["Design", "Development", "UX"],
    },
  },
  "how-to-rewire-your-brain-to-be-addicted-to-coding": {
    slug: "how-to-rewire-your-brain-to-be-addicted-to-coding",
    title: "How to Rewire Your Brain to Be Addicted to Coding",
    author: "Ashish Kumar",
    date: "December 22, 2025",
    readTime: "6 min read",
    image: "/skills-background.jpg",
    content: {
      sections: [
        {
          heading: "Understanding the coding mindset",
          paragraphs: [
            "Coding isn't just a skill—it's a way of thinking. The most successful developers have rewired their brains to see problems as opportunities, bugs as puzzles, and complex systems as elegant solutions waiting to be discovered.",
            "This transformation doesn't happen overnight. It requires consistent practice, the right mindset, and an understanding of how your brain adapts to new challenges. By applying principles from neuroscience and psychology, we can accelerate this process.",
          ],
        },
        {
          heading: "Building sustainable coding habits",
          paragraphs: [
            "The key to becoming addicted to coding isn't about forcing yourself to code—it's about creating an environment and routine that makes coding feel natural and rewarding. This involves understanding your peak performance times, setting up your workspace for success, and creating a feedback loop that keeps you engaged.",
            "Small, consistent sessions often outperform marathon coding sessions. The brain learns best through repetition and gradual complexity increases. By breaking down large projects into manageable chunks, you create multiple opportunities for the satisfaction of completion.",
          ],
        },
        {
          heading: "The psychology of flow state",
          paragraphs: [
            "When you're truly engaged in coding, time seems to disappear. This flow state is where the magic happens—where problem-solving becomes intuitive and creativity flourishes. Understanding how to enter and maintain this state is crucial for long-term coding success.",
            "Flow state requires the right balance of challenge and skill. Too easy, and you get bored. Too hard, and you get frustrated. The sweet spot is where you're constantly pushing your boundaries just enough to stay engaged without becoming overwhelmed.",
          ],
        },
      ],
    },
    sidebar: {
      author: {
        name: "Ashish Kumar",
        description: "A developer passionate about the psychology of learning and productivity. Specializes in helping others develop sustainable coding practices and maintain long-term motivation in their development journey.",
      },
      topStories: [
        {
          title: "The Creative Website Guide",
          image: "/hero-background.jpg",
          slug: "the-creative-website-guide",
        },
        {
          title: "Everything You Need to Know To Make A Good Developer Portfolio Site",
          image: "/contact-image.jpg",
          slug: "everything-you-need-to-know-to-make-a-good-developer-portfolio-site",
        },
      ],
      topic: "Productivity",
      perspective: "Insights",
      tags: ["Learning", "Psychology", "Development"],
    },
  },
  "everything-you-need-to-know-to-make-a-good-developer-portfolio-site": {
    slug: "everything-you-need-to-know-to-make-a-good-developer-portfolio-site",
    title: "Everything You Need to Know To Make A Good Developer Portfolio Site",
    author: "Ashish Kumar",
    date: "December 15, 2025",
    readTime: "10 min read",
    image: "/contact-image.jpg",
    content: {
      sections: [
        {
          heading: "The foundation of a great portfolio",
          paragraphs: [
            "Your portfolio is more than a collection of projects—it's your digital identity, your professional story, and your first impression. A well-crafted portfolio can open doors, while a poorly executed one can close them just as quickly.",
            "The best portfolios tell a story. They showcase not just what you've built, but how you think, how you solve problems, and how you approach challenges. This narrative approach helps potential clients and employers understand not just your technical skills, but your creative process and problem-solving abilities.",
          ],
        },
        {
          heading: "Essential components and structure",
          paragraphs: [
            "Every great portfolio includes certain key elements: a compelling hero section that immediately communicates who you are, a projects section that showcases your best work, and a clear way for visitors to get in touch. But the magic is in how these elements work together.",
            "Navigation should be intuitive, performance should be optimized, and the design should reflect your personal brand. Whether you prefer minimalism or bold creativity, consistency is key. Your portfolio should feel cohesive from the first pixel to the last.",
          ],
        },
        {
          heading: "Showcasing your work effectively",
          paragraphs: [
            "The projects you choose to feature matter. Quality over quantity is the rule here. Each project should demonstrate different skills, solve different problems, and tell a different story. Include case studies that explain your process, the challenges you faced, and how you overcame them.",
            "Visual presentation is crucial. High-quality screenshots, interactive demos, and clear descriptions help visitors understand your work. But don't forget the technical details—explain the technologies you used, the problems you solved, and the impact you made.",
          ],
        },
      ],
    },
    sidebar: {
      author: {
        name: "Ashish Kumar",
        description: "A full-stack developer and designer who has built numerous portfolio sites for clients and personal projects. Passionate about helping developers create portfolios that truly represent their skills and personality.",
      },
      topStories: [
        {
          title: "The Creative Website Guide",
          image: "/hero-background.jpg",
          slug: "the-creative-website-guide",
        },
        {
          title: "How to rewire your brain to be addicted to coding",
          image: "/skills-background.jpg",
          slug: "how-to-rewire-your-brain-to-be-addicted-to-coding",
        },
      ],
      topic: "Portfolio",
      perspective: "Insights",
      tags: ["Design", "Portfolio", "Career"],
    },
  },
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
          <article className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-chaney mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-black/70 font-safiro">
                    <span className="font-semibold">{post.author}</span>
                  </div>
                  <div className="text-sm text-black/60 font-safiro">
                    {post.date} • {post.readTime}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="w-10 h-10 flex items-center justify-center border border-black/20 rounded hover:bg-black/5 transition-colors">
                    <span className="text-lg">f</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center border border-black/20 rounded hover:bg-black/5 transition-colors">
                    <span className="text-lg">in</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center border border-black/20 rounded hover:bg-black/5 transition-colors">
                    <span className="text-lg">🔗</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative w-full h-[400px] md:h-[500px] mb-12 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              {post.content.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  {section.heading && (
                    <h2 className="text-2xl md:text-3xl font-bold font-chaney mb-4 mt-8">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </article>

          <aside className="lg:pl-8">
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-4 font-safiro border-b border-black/20 pb-2">
                Author
              </h3>
              <div className="mb-2">
                <p className="font-semibold text-base font-safiro">{post.sidebar.author.name}</p>
              </div>
              <p className="text-sm text-black/70 leading-relaxed font-safiro">
                {post.sidebar.author.description}
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-4 font-safiro border-b border-black/20 pb-2">
                Top stories in {post.sidebar.topic}
              </h3>
              <div className="space-y-6">
                {post.sidebar.topStories.map((story, index) => (
                  <Link
                    key={index}
                    href={`/blog/${story.slug}`}
                    className="block group"
                  >
                    <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-sm font-semibold font-safiro group-hover:opacity-70 transition-opacity">
                      {story.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-2 font-safiro border-b border-black/20 pb-2">
                Topic
              </h3>
              <p className="text-sm font-safiro">{post.sidebar.topic}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-2 font-safiro border-b border-black/20 pb-2">
                Perspective
              </h3>
              <p className="text-sm font-safiro">{post.sidebar.perspective}</p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-2 font-safiro border-b border-black/20 pb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.sidebar.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm text-black/70 font-safiro"
                  >
                    {tag}
                    {index < post.sidebar.tags.length - 1 && ","}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

