export default function Icon({ name, size = 20, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      {...props}
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  )
}
