export default function Icon({ name, className = "", size = 20 }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: size, width: size, height: size }}
    >
      {name}
    </span>
  );
}
