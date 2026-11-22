export function SMark({ size = 20 }: { size?: number }) {
  return (
    <img
      src="./favicon.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="flex-shrink-0"
    />
  );
}
