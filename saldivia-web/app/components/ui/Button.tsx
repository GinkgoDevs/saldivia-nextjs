import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "icon"
  | "link-cta";
export type ButtonSize = "sm" | "md" | "lg";

export type UIButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-blue text-white border border-accent-blue hover:bg-accent-blue-alt hover:border-accent-blue-alt shadow-elev-1",
  secondary:
    "bg-primary text-white border border-primary hover:opacity-95 dark:bg-secondary-container dark:text-primary dark:border-secondary-container",
  outline:
    "bg-transparent text-primary border border-outline-variant/50 hover:bg-surface-container dark:text-zinc-100 dark:border-white/15 dark:hover:bg-white/5",
  ghost:
    "bg-transparent text-primary border border-transparent hover:bg-surface-container-low dark:text-zinc-100 dark:hover:bg-white/10",
  icon:
    "bg-transparent text-primary border border-outline-variant/45 hover:bg-surface-container-low dark:text-zinc-100 dark:border-white/15 dark:hover:bg-white/10",
  "link-cta":
    "bg-transparent text-accent-blue border border-transparent hover:text-primary dark:text-secondary-container dark:hover:text-zinc-100",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]",
  md: "min-h-[44px] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.12em]",
  lg: "min-h-[48px] px-8 py-3.5 text-sm font-black uppercase tracking-[0.16em]",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}) {
  return cn(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-curve-sm font-headline transition-all duration-base ease-brand-fluid ui-focus-ring active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60",
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    fullWidth && "w-full",
    variant === "icon" && "h-11 w-11 min-h-0 min-w-0 p-0 rounded-curve-md",
    className
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  loading = false,
  disabled,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  children,
  ...props
}: UIButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={buttonClass({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          aria-hidden
        />
      ) : (
        leadingIcon
      )}
      {children}
      {trailingIcon}
    </button>
  );
}
