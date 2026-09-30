export default function Icon({ name, className = "", size = 20 }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontFamily: '"Material Symbols Outlined"',
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        fontWeight: 400,
        fontStyle: "normal",
        lineHeight: 1,
        letterSpacing: "normal",
        textTransform: "none",
        display: "inline-block",
        whiteSpace: "nowrap",
        wordWrap: "normal",
        direction: "ltr",
        fontFeatureSettings: '"liga"',
        fontVariationSettings:
          '"FILL" 0, "GRAD" 0, "opsz" 24, "wght" 400',
      }}
    >
      {name}
    </span>
  );
}

