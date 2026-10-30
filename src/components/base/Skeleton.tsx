import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'line' | 'poster' | 'chip';
}

const Skeleton = ({ variant = 'line', className, ...props }: SkeletonProps) => {
  useLocale();
  if (variant === 'poster') {
    return (
      <div
        role="status"
        aria-label={t('Carregando pôster')}
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
        variant === 'chip' ? 'h-8 w-24' : 'h-4 w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
};

export default Skeleton;
