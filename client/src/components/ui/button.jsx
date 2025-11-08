export function Button({ as: Tag = "button", variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition";
  const styles = {
    primary: "bg-orange-500 text-white hover:opacity-90",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };
  return <Tag className={`${base} ${styles[variant] ?? styles.primary} ${className}`} {...props} />;
}
export default Button;
