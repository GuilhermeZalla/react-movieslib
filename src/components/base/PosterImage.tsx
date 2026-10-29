import { useState } from 'react';

interface PosterImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src'
> {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

const PosterImage = ({
  src,
  alt,
  width = 190,
  height = 285,
  className,
  fill = false,
  fetchPriority,
  ...props
}: PosterImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  if (!showImage) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={[
          'flex items-center justify-center bg-surface border border-line text-muted font-body text-caption',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        style={
          fill
            ? undefined
            : { width, height, aspectRatio: `${width}/${height}` }
        }
      >
        Sem pôster
      </div>
    );
  }

  return (
    <img
      src={src as string}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={width}
      height={height}
      className={['rounded-poster object-cover', className]
        .filter(Boolean)
        .join(' ')}
      onError={() => setFailedSrc(src ?? null)}
      // React 18 accepts this native attribute in lowercase, without a DOM warning.
      {...(fetchPriority ? { fetchpriority: fetchPriority } : {})}
      {...props}
    />
  );
};

export default PosterImage;
