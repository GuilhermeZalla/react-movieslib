interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
}

const Container = ({
  fullWidth = false,
  className,
  ...props
}: ContainerProps) => {
  const base = fullWidth
    ? 'w-full px-6 sm:px-8'
    : 'max-w-page mx-auto px-6 sm:px-8';

  return (
    <div className={[base, className].filter(Boolean).join(' ')} {...props} />
  );
};

export default Container;
