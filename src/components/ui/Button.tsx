import Link from "next/link";
import { Dot } from "@/components/signal/primitives";
import { buttonOutline, buttonSolid } from "@/components/ui/buttonStyles";

const variants = {
  primary: buttonSolid,
  secondary: buttonOutline,
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
  const className = variants[variant];
  const content = (
    <>
      <Dot className={variant === "primary" ? "bg-flame" : "bg-current"} />
      {children}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
