type IconProps = {
  name: string;
  size?: number;
  isFilled?: boolean;
  color?: string;        // custom color (hex, rgb, etc.)
  className?: string;    // Tailwind classes
};

const MaterialIcon = ({
  name,
  size = 24,
  isFilled = true,
  color,
  className,
}: IconProps) => {
  return (
    <span
      className={`material-symbols-outlined ${className ?? ""}`}
      style={{
        //  fontVariationSettings: `
        //    'FILL' ${isFilled ? 1 : 0},
        //    'wght' 400,
        //    'GRAD' 0,
        //    'opsz' 24
        //  `,
        fontSize: `${size}px`,
        color: color, // 👈 dynamic color
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {name}
    </span>
  );
};

export default MaterialIcon;