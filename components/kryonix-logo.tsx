export function KryonixLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="6" fill="#a1887f" />
      <text
        x="16"
        y="22"
        fontSize="14"
        fontWeight="bold"
        textAnchor="middle"
        fill="white"
      >
        K
      </text>
    </svg>
  );
}
