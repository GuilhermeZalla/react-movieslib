interface PosterPlaceholderProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
}

const PosterPlaceholder = ({
  width = 190,
  height = 285,
  className,
  ...props
}: PosterPlaceholderProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 190 285"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={[
        'rounded-poster shadow-poster bg-surface border line border-line',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <rect width="190" height="285" fill="currentColor" opacity="0.08" />
      <path
        d="M85 80L105 80L105 95L85 95ZM75 110L115 110L115 120L75 120Z"
        fill="currentColor"
        opacity="0.12"
      />
      <path
        d="M95 145L105 145L105 155L95 155ZM75 170L115 170L115 180L75 180Z"
        fill="currentColor"
        opacity="0.12"
      />
    </svg>
  );
};

export default PosterPlaceholder;
