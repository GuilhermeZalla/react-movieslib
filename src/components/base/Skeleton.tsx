interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number | string;
  width?: number | string;
}

const Skeleton = ({
  height = '1rem',
  width = '100%',
  className,
  ...props
}: SkeletonProps) => {
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
