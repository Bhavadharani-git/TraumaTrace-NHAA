export default function Card({ children, className = "", noPadding = false }) {
  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-lg shadow-level1 ${
        noPadding ? "" : "p-space-lg"
      } ${className}`}
    >
      {children}
    </div>
  );
}

