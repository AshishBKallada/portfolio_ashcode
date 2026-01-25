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
  "nurturing-frontend-talent-teaching": {
    slug: "nurturing-frontend-talent-teaching",
    title: "The Unsung Art: Nurturing Frontend Talent Through Teaching",
    author: "Ashish B Kallada",
    date: "January 11, 2026",
    readTime: "10 min read",
    image: "/hero-background.jpg",
    content: {
      sections: [
        {
          heading: "More than just code",
          paragraphs: [
            "As a frontend developer, my days are often filled with the gratifying dance of code, the meticulous crafting of user interfaces, and the constant pursuit of elegant solutions. But there's another, equally rewarding, aspect of my role that I've come to cherish: the art of teaching. At our company, I've had the privilege of guiding interns and junior developers, helping them navigate the exciting, and sometimes overwhelming, world of frontend development.",
            "It's more than just sharing knowledge; it's about cultivating a mindset, fostering good habits, and empowering the next generation of developers to excel. Here's a glimpse into the 'art' of teaching that I've been honing:",
          ],
        },
        {
          heading: "Demystifying Code Practices: The Foundation of Excellence",
          paragraphs: [
            "One of the first things I emphasize is the importance of solid code practices. It's easy to get a piece of code working, but getting it right, readable, maintainable, scalable, is a different ball game. We dive into concepts like clean code principles, discussing variable naming conventions, function purity, and breaking down complex logic into smaller, manageable chunks.",
            "We explore modularization and understanding the power of components and modules, learning how to build applications that are easy to reason about and extend. And we cover version control best practices, guiding them through Git workflows, meaningful commit messages, and collaborative development.",
            "The goal isn't just to follow rules, but to understand the 'why' behind them, fostering a deeper appreciation for craftsmanship in code.",
          ],
        },
        {
          heading: "Spotting and Sidestepping Anti-Patterns: Learning from Others' Mistakes",
          paragraphs: [
            "Just as crucial as understanding good practices is recognizing anti-patterns. These are common solutions that, despite seeming effective in the short term, lead to problems down the line. We explore examples like God Objects, when a single component or module tries to do too much, or prop drilling, where props are passed through many layers of components unnecessarily.",
            "We also discuss magic strings and numbers, those hardcoded values without clear explanations that make code harder to maintain. By dissecting these anti-patterns, we learn to identify potential pitfalls early and steer clear of them, saving countless hours of refactoring and debugging in the future. It's a bit like learning from a roadmap of 'what not to do' to arrive at a better destination.",
          ],
        },
        {
          heading: "Navigating the Modern Library Landscape: A Compass in the Ecosystem",
          paragraphs: [
            "The frontend ecosystem is a vibrant, ever-evolving beast. New libraries and frameworks emerge constantly. For junior developers, this can be daunting. My role here is less about dictating what to use, and more about teaching them how to choose.",
            "We discuss understanding core concepts, emphasizing that many libraries solve similar problems, just in different ways. Focusing on core JavaScript, HTML, and CSS principles first makes learning new tools much easier. We evaluate trade-offs, discussing factors like community support, documentation quality, performance implications, and project requirements when selecting a library.",
            "And we talk about staying updated without burning out, strategies for keeping an eye on new trends without feeling overwhelmed, perhaps through newsletters, curated blogs, or following influential developers. It's about equipping them with a compass, not just a map, to navigate the ever-changing terrain.",
          ],
        },
        {
          heading: "The Art of Research and Continuous Learning: Becoming a Self-Sufficient Developer",
          paragraphs: [
            "Perhaps the most critical skill I try to impart is the ability to research effectively and commit to continuous learning. The answers aren't always going to be handed to them on a silver platter. We work on effective googling, crafting precise search queries to find relevant information quickly.",
            "We practice documentation diving, how to read and understand official documentation, which is often the most reliable source of truth. We explore community engagement, leveraging platforms like Stack Overflow, GitHub issues, and developer forums to find solutions and contribute. And we encourage experimentation, building small proof-of-concept projects to solidify their understanding of new concepts.",
            "Ultimately, my goal as a teacher isn't just to pass on my knowledge, but to instill a lifelong passion for learning and problem-solving. Seeing an intern or junior developer confidently tackle a complex problem, debug an elusive bug, or propose an innovative solution, that's when the art of teaching truly feels like a masterpiece in the making. It's a privilege to contribute to their journey, and in doing so, I find my own understanding of frontend development continually enriched.",
          ],
        },
      ],
    },
    sidebar: {
      author: {
        name: "Ashish B Kallada",
        description: "A frontend developer and mentor passionate about nurturing the next generation of developers. Believes teaching is an art that enriches both the teacher and the student.",
      },
      topStories: [
        {
          title: "The 'Rabbit Hole' Ritual: Why Curiosity is a Developer's Secret Weapon",
          image: "/hero-background.jpg",
          slug: "curiosity-driven-learning",
        },
        {
          title: "Beyond the Cursor: Why the Best Developers Switch to 'Scientist Mode'",
          image: "/skills-background.jpg",
          slug: "how-to-rewire-your-brain-to-be-addicted-to-coding",
        },
      ],
      topic: "Mentorship",
      perspective: "Personal",
      tags: ["Teaching", "Frontend", "Career Growth"],
    },
  },
  "how-to-rewire-your-brain-to-be-addicted-to-coding": {
    slug: "how-to-rewire-your-brain-to-be-addicted-to-coding",
    title: "Beyond the Cursor: Why the Best Developers Switch to 'Scientist Mode'",
    author: "Ashish B Kallada",
    date: "December 22, 2025",
    readTime: "8 min read",
    image: "/skills-background.jpg",
    content: {
      sections: [
        {
          heading: "The AI trap: convenience with a hidden cost",
          paragraphs: [
            "In the modern frontend landscape, we are blessed with tools like Cursor. It's like having a high-speed engine attached to your IDE. For 80% of our daily tasks, boilerplate, simple logic, or CSS tweaks, it feels like magic. But there is a dangerous trap hidden in that convenience.",
            "I see it often with the interns and junior developers I mentor. When a truly deep, complex issue arises, the kind that involves race conditions, architectural bottlenecks, or obscure browser quirks, they hit a wall. They keep prompting the AI, hoping for a 'fix,' but the AI keeps giving them the 'what' and the 'where' without ever understanding the 'how' or the 'why.'",
            "This is the moment where the modern developer either fails or levels up. This is where I switch into Scientist Mode.",
          ],
        },
        {
          heading: "The AI Ceiling: When 'What' Isn't Enough",
          paragraphs: [
            "AI is a pattern matcher, not a problem solver. When you feed Cursor a complex error, it might say: 'The state is undefined here because the effect is running twice.' That's great. But it doesn't know that your company's micro-frontend architecture handles hydration differently, or that a specific legacy library is intercepting that event. The AI gives you a bandage; a developer gives you a cure.",
          ],
        },
        {
          heading: "Entering 'Scientist Mode' (or The Wizard Workspace)",
          paragraphs: [
            "When the AI starts looping or giving generic advice, I close the chat and open my 'lab.' This process is less about typing and more about analysis.",
            "The Hypothesis: Instead of guessing, I form a theory. 'I suspect the state is being cleared by the cleanup function of a parent provider, not this component.'",
            "The Deep Dive: I stop relying on generated snippets and go to the source of truth. I check GitHub Issues to see if others hit the same wall in the library's repo. I read the 'Advanced' section of documentation that AI usually skims. I dig through Stack Overflow archives, looking for the logic behind the solution, not just the code to copy.",
            "The Experiment: I use breakpoints, not console.log. I isolate the component. I strip the code down to its barest form until the bug has nowhere to hide.",
          ],
        },
        {
          heading: "The Problem with 'AI-Only' Developers",
          paragraphs: [
            "The reason many modern developers are lagging is that they've outsourced their critical thinking.",
            "If you rely on AI to fix everything, your 'debugging muscle' atrophies. When production goes down and the AI doesn't have the context of your specific infrastructure, you'll be paralyzed.",
            "True expertise isn't knowing the syntax. AI knows syntax better than any of us. True expertise is the ability to navigate the unknown. It's the patience to spend three hours reading a technical whitepaper to fix a single line of code.",
          ],
        },
        {
          heading: "My Advice to Junior Devs",
          paragraphs: [
            "Don't let Cursor be your brain; let it be your intern.",
            "If the AI can't fix it in two prompts, stop. Switch to your Scientist Mode. Research the underlying technology.",
            "The fix you find through deep research and manual analysis is the one that actually teaches you something. That is the knowledge that turns a coder into a Software Engineer.",
          ],
        },
      ],
    },
    sidebar: {
      author: {
        name: "Ashish B Kallada",
        description: "A full-stack developer and mentor who believes in the power of deep thinking over quick fixes. Specializes in helping junior developers develop critical problem-solving skills beyond AI assistance.",
      },
      topStories: [
        {
          title: "The 'Rabbit Hole' Ritual: Why Curiosity is a Developer's Secret Weapon",
          image: "/hero-background.jpg",
          slug: "curiosity-driven-learning",
        },
        {
          title: "The Unsung Art: Nurturing Frontend Talent Through Teaching",
          image: "/skills-background.jpg",
          slug: "nurturing-frontend-talent-teaching",
        },
      
      ],
      topic: "Development",
      perspective: "Mentorship",
      tags: ["AI", "Problem Solving", "Career Growth"],
    },
  },
  "curiosity-driven-learning": {
    slug: "curiosity-driven-learning",
    title: "The 'Rabbit Hole' Ritual: Why Curiosity is a Developer's Secret Weapon",
    author: "Ashish B Kallada",
    date: "January 18, 2026",
    readTime: "7 min read",
    image: "/hero-background.jpg",
    content: {
      sections: [
        {
          heading: "Staying updated isn't a warning, it's a weekly ritual",
          paragraphs: [
            "We've all heard the advice: 'You need to stay updated.' In the tech world, that usually sounds like a warning, a constant pressure to keep your skills from rotting. But for me, staying updated isn't a defensive move, it's a weekly ritual fueled by pure, unfiltered curiosity.",
            "Every week, I find myself drifting away from my daily React or Next.js tasks and diving into something completely fresh. It might not even be about code. It might be a new AI model's architecture, a breakthrough in cloud infrastructure, or a radical new way a browser handles rendering.",
          ],
        },
        {
          heading: "The Spark: From 'What is this?' to 'How does it work?'",
          paragraphs: [
            "It usually starts with a single link or a mention in a newsletter. Most people see a new piece of tech and think, 'Will I use this at work?' If the answer is no, they move on.",
            "I take the opposite approach. If it's interesting, I dive in. I don't just read the headlines; I go into Scientist Mode.",
            "First, I hit the Medium/Blog phase, seeing how people are talking about it and what problems it claims to solve. Then comes the Documentation phase, where I look at the 'Getting Started' and 'Concepts' pages to understand the philosophy behind the tech. Finally, the Community phase: I check GitHub issues or Reddit to see where it breaks. That's where you learn the real stuff.",
          ],
        },
        {
          heading: "Curiosity vs. Enthusiasm",
          paragraphs: [
            "There's a difference between being enthusiastic about your job and being curious about the world. Enthusiasm can fade when a project gets tough, but curiosity is an itch that demands to be scratched. Sometimes I spend an entire Saturday night researching something I might never use in a production environment. To an outsider, it looks like wasted time. To me, it's like adding a new tool to a mental library.",
          ],
        },
        {
          heading: "Why This Makes You a Better Developer",
          paragraphs: [
            "This habit of 'aimless' deep-diving is actually what separates the seniors from the juniors. When you explore tech just because it's interesting, you build a mental map. When a new problem arises at work, you can say, 'I remember reading about a tech that handles this specifically...'",
            "You also develop intuition. You start seeing patterns in how technology evolves, making it easier to learn the next thing. And maybe most importantly, you avoid burnout. Learning for fun reminds you that tech is a playground, not just a series of tickets to close.",
          ],
        },
        {
          heading: "My Advice: Follow the Rabbit Hole",
          paragraphs: [
            "To the interns and juniors I mentor, I always say: Follow the itch. If you find a new tool, a new library, or a new concept that makes you wonder 'How did they do that?', don't stop at the surface. Spend the hour. Read the deep-dive.",
            "The industry is full of people who know how to follow instructions. Be the person who knows how the world is being built. In a world of AI-generated answers, your broad, curiosity-driven perspective is your greatest asset.",
          ],
        },
      ],
    },
    sidebar: {
      author: {
        name: "Ashish B Kallada",
        description: "A full-stack developer who believes curiosity is the most underrated skill in tech. Mentors junior developers and spends weekends diving into tech rabbit holes just for the fun of it.",
      },
      topStories: [
        {
          title: "The Unsung Art: Nurturing Frontend Talent Through Teaching",
          image: "/hero-background.jpg",
          slug: "nurturing-frontend-talent-teaching",
        },
        {
          title: "Beyond the Cursor: Why the Best Developers Switch to 'Scientist Mode'",
          image: "/skills-background.jpg",
          slug: "how-to-rewire-your-brain-to-be-addicted-to-coding",
        },
      ],
      topic: "Learning",
      perspective: "Personal",
      tags: ["Curiosity", "Learning", "Career Growth"],
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

      <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-16">
          <article className="max-w-4xl">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-chaney mb-8">
                <span className="text-2xl md:text-3xl font-safiro">{post.title}</span>
              </h1>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
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

            <div className="relative w-full h-[400px] md:h-[500px] mb-16 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              {post.content.sections.map((section, index) => (
                <div key={index} className="mb-12">
                  {section.heading && (
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 mt-12">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-base md:text-lg leading-relaxed text-black/80 font-safiro mb-6"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </article>

          <aside className="lg:pl-12">
            <div className="mb-16">
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-6 font-safiro border-b border-black/20 pb-2">
                Author
              </h3>
              <div className="mb-4">
                <p className="font-semibold text-base font-safiro">{post.sidebar.author.name}</p>
              </div>
              <p className="text-sm text-black/70 leading-relaxed font-safiro">
                {post.sidebar.author.description}
              </p>
            </div>

            <div className="mb-16">
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-6 font-safiro border-b border-black/20 pb-2">
                Top stories in {post.sidebar.topic}
              </h3>
              <div className="space-y-8">
                {post.sidebar.topStories.map((story, index) => (
                  <Link
                    key={index}
                    href={`/blog/${story.slug}`}
                    className="block group"
                  >
                    <div className="relative w-full h-32 mb-4 rounded overflow-hidden">
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

            <div className="mb-10">
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-3 font-safiro border-b border-black/20 pb-2">
                Topic
              </h3>
              <p className="text-sm font-safiro">{post.sidebar.topic}</p>
            </div>

            <div className="mb-10">
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-3 font-safiro border-b border-black/20 pb-2">
                Perspective
              </h3>
              <p className="text-sm font-safiro">{post.sidebar.perspective}</p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-3 font-safiro border-b border-black/20 pb-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-3">
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

