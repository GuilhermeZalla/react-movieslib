interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'primary' | 'muted' | 'accent';
  children: React.ReactNode;
}

const Link = ({
  variant = 'primary',
  className,
  children,
  ...props
}: LinkProps) => {
  const base =
    'font-body text-body transition-colors duration-(--duration-fast) ease-settle focus-visible:underline focus-visible:outline-none';
  const variants: Record<string, string> = {
    primary: 'text-accent hover:underline',
    muted: 'text-muted hover:underline',
    accent: 'text-accent font-bold hover:underline',
  };

  return (
    <a
      className={[base, variants[variant], className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
