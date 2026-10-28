interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'accent';
}

const Badge = ({
  variant = 'neutral',
  className,
  children,
  ...props
}: BadgeProps) => {
  const variants: Record<string, string> = {
    neutral: 'bg-surface text-ink border border-line',
    accent: 'bg-accent text-on-accent',
  };
  return (
    <span
      className={[
        'inline-flex items-center rounded-control px-2 py-0.5 font-body text-caption',
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
