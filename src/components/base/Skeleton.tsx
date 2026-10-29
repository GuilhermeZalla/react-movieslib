interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  width?: number | string;
  variant?: 'line' | 'poster';
}

const Skeleton = ({
  height = '1rem',
  width = '100%',
  variant = 'line',
  className,
  ...props
}: SkeletonProps) => {
  if (variant === 'poster') {
    return (
      <div
        role="status"
        aria-label="Carregando pôster"
        className={[
          'aspect-preview-poster w-full max-w-preview-card animate-pulse rounded-preview-poster bg-preview-skeleton motion-reduce:animate-none',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  }
  return (
    <div
      className={[
        'animate-pulse motion-reduce:animate-none rounded-poster bg-surface border line border-line',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ height, width }}
      {...props}
    />
  );
};

export default Skeleton;
