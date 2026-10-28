import { useState } from 'react';

interface PosterImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src'
> {
  src?: string | null;
  alt: string;
  width?: number;
  height?: number;
}

const PosterImage = ({
  src,
  alt,
  width = 190,
  height = 285,
  className,
  ...props
}: PosterImageProps) => {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

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
        style={{ width, height, aspectRatio: `${width}/${height}` }}
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
      onError={() => setFailed(true)}
      {...props}
    />
  );
};

export default PosterImage;
