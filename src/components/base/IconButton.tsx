import { forwardRef } from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={[
          'inline-flex items-center justify-center rounded-control p-2 font-body text-body transition-colors duration-(--duration-fast) ease-settle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line disabled:opacity-50 disabled:pointer-events-none motion-reduce:transition-none',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';

export default IconButton;
