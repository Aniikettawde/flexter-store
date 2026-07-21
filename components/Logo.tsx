export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 210"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* left descending blade */}
      <path d="M10 44 L78 44 L112 190 L78 210 Z" fill="#f2f2ef" />
      {/* upper bar */}
      <path d="M78 44 L190 44 L152 118 L108 118 Z" fill="#a9a9ac" />
      {/* lower bar */}
      <path d="M96 130 L176 130 L146 190 L118 190 Z" fill="#8f8f94" />
    </svg>
  );
}
