import Button from './Button';

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <h2 className="font-display text-title text-ink">{title}</h2>
      {message && <p className="font-body text-body text-muted">{message}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
