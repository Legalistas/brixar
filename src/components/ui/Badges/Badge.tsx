const Badge = ({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => <span className={className} style={style}>{children}</span>;

export default Badge;