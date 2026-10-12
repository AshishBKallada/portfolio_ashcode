import Link from "next/link";

// Square, uppercase, cream-on-oxblood: the same language as the navbar
// Contact button and the contact CTA.
const variants = {
  primary: "bg-cream text-brand hover:bg-white",
  secondary: "border border-cream text-cream hover:bg-cream hover:text-brand",
};

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  variant?: keyof typeof variants;
};

export function Button({
  href,
  children,
  external,
  variant = "primary",
}: ButtonProps) {
  const className = `inline-flex min-h-11 items-center gap-2 px-5 font-sans text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors focus-visible:outline-cream ${variants[variant]}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
