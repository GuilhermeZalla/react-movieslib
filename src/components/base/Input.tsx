type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: InputProps) => {
  const base =
    'block w-full rounded-control border line border-line bg-surface text-ink px-3 py-2 font-body text-body transition-colors duration-(--duration-fast) ease-settle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none placeholder:text-muted/60';

  return (
    <input className={[base, className].filter(Boolean).join(' ')} {...props} />
  );
};

export default Input;
