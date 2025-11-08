export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400 ${className}`}
      {...props}
    />
  );
}
export default Input;
