import Link from "next/link";

const variants = {
  primary: "bg-foreground text-background hover:opacity-80",
  secondary: "border border-border text-foreground hover:bg-foreground/[.04]",
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
  const className = `inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition-opacity ${variants[variant]}`;

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
