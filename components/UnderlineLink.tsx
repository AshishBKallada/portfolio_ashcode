"use client";

import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  accent?: string;
  className?: string;
};

type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: "a";
  };

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as: "button";
  };

type Props = AnchorProps | ButtonProps;

const UnderlineLink = forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>(
  ({ children, accent = "#3fd75e", className = "", as, ...rest }, ref) => {
    const inner = (
      <span className="relative inline-block leading-none">
        <span className="relative z-[1]">{children}</span>
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 -bottom-1 h-[1.5px] origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-x-100"
          style={{ backgroundColor: accent }}
        />
      </span>
    );

    if (as === "button") {
      const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          {...buttonProps}
          className={`group inline-block ${className}`}
        >
          {inner}
        </button>
      );
    }

    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...anchorProps}
        className={`group inline-block ${className}`}
      >
        {inner}
      </a>
    );
  }
);
UnderlineLink.displayName = "UnderlineLink";

export default UnderlineLink;
