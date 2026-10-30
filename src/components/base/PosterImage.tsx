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
  placeholder?: string;
}

const PosterImage = ({
  src,
  alt,
  width = 190,
  height = 285,
  className,
  fill = false,
  fetchPriority,
  placeholder = 'Sem pôster',
  ...props
}: PosterImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  if (!showImage) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={!alt || undefined}
        className={[
          'flex items-center justify-center bg-surface text-muted font-body text-caption',
          !fill && 'w-preview-card aspect-preview-poster',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {placeholder}
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
