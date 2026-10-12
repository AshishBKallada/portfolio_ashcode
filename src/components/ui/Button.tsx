import Link from "next/link";
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
