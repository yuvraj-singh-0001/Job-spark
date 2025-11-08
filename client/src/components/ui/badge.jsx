export function Badge({ variant = "default", className = "", ...props }) {
  const styles = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-900",
    outline: "border border-slate-200 text-slate-700 bg-white",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${styles[variant]} ${className}`} {...props} />
  );
}
export default Badge;
