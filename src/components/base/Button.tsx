interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  preview?: boolean;
}

const Button = ({
  variant = 'primary',
  preview = false,
  className,
  ...props
}: ButtonProps) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-control px-4 py-2 font-body text-body transition-colors duration-(--duration-fast) ease-settle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variants: Record<string, string> = {
    primary: 'bg-accent text-on-accent hover:bg-accent/90 active:bg-accent/80',
    secondary:
      'bg-surface text-ink border line border-line hover:bg-surface/80 active:bg-surface/70',
  };
  const previewVariants: Record<string, string> = {
    primary:
      'bg-preview-accent text-preview-on-accent hover:bg-preview-accent-hover active:bg-preview-accent-pressed',
    secondary:
      'border border-preview-line bg-preview-surface text-preview-ink hover:bg-preview-accent-soft',
  };

  return (
    <button
      className={[
        base,
        preview ? previewVariants[variant] : variants[variant],
        preview &&
          'duration-(--duration-preview) ease-preview motion-reduce:transition-none',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
};

export default Button;
