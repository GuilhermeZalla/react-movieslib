interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-control px-4 py-2 font-body text-body transition-colors duration-fast ease-settle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants: Record<string, string> = {
    primary: 'bg-accent text-on-accent hover:bg-accent/90 active:bg-accent/80',
    secondary:
      'bg-surface text-ink border line border-line hover:bg-surface/80 active:bg-surface/70',
  };

  return (
    <button
      className={[base, variants[variant], className].filter(Boolean).join(' ')}
      {...props}
    />
  );
};

export default Button;
