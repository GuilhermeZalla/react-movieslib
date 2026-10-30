import { t } from '../../i18n/translate';
import { useLocale } from '../../i18n/useLocale';
import Button from './Button';
import type { ReactNode } from 'react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  preview?: boolean;
  illustration?: ReactNode;
}

const ErrorState = ({
  message,
  onRetry,
  retryLabel = t('Tentar novamente'),
  preview = false,
  illustration,
}: ErrorStateProps) => {
  useLocale();
  return (
    <div
      role="alert"
      className={
        preview
          ? 'flex flex-col items-start gap-3 rounded-preview-control bg-preview-accent-soft p-6 text-left'
          : 'flex flex-col items-center justify-center gap-4 p-12 text-center'
      }
    >
      {preview && illustration && <div aria-hidden="true">{illustration}</div>}
      <p
        className={
          preview
            ? 'font-display text-preview-section font-bold text-preview-accent-text'
            : 'font-body text-body text-ink'
        }
      >
        {t(message)}
      </p>
      {onRetry && (
        <Button variant="primary" preview={preview} onClick={onRetry}>
          {t(retryLabel)}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
