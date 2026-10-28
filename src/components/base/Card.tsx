interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

const Card = ({ padded = true, className, ...props }: CardProps) => {
  const base =
    'rounded-poster shadow-poster border line border-line bg-surface text-ink transition-transform duration-fast ease-settle hover:-translate-y-1';
  const padding = padded ? 'p-6' : 'p-0';

  return (
    <div
      className={[base, padding, className].filter(Boolean).join(' ')}
      {...props}
    />
  );
};

export default Card;
