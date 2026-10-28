import Button from './Button';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorState = ({
  message,
  onRetry,
  retryLabel = 'Tentar novamente',
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
      <p className="font-body text-body text-ink">{message}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
