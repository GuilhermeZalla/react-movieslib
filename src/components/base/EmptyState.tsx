import { useLocale } from '../../i18n/useLocale';
import { t } from '../../i18n/translate';
import Button from './Button';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  preview?: boolean;
  illustration?: ReactNode;
}

const EmptyState = ({
  title,
  message,
  actionLabel,
  onAction,
  preview = false,
  illustration,
}: EmptyStateProps) => {
  useLocale();
  return (
    <div
      className={
        preview
          ? 'flex flex-col items-start gap-3 rounded-preview-control bg-preview-surface p-6 text-left'
          : 'flex flex-col items-center justify-center gap-4 p-12 text-center'
      }
    >
      {preview && illustration && <div aria-hidden="true">{illustration}</div>}
      <h2
        className={
          preview
            ? 'font-display text-preview-section font-bold text-preview-ink'
            : 'font-display text-title text-ink'
        }
      >
        {t(title)}
      </h2>
      {message && (
        <p
          className={
            preview
              ? 'font-body text-preview-body text-preview-muted'
              : 'font-body text-body text-muted'
          }
        >
          {t(message)}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" preview={preview} onClick={onAction}>
          {t(actionLabel)}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
