export function Card({ className = "", ...props }) {
  return <div className={`border rounded-2xl bg-white ${className}`} {...props} />;
}
export function CardHeader({ className = "", ...props }) {
  return <div className={`p-4 ${className}`} {...props} />;
}
export function CardTitle({ className = "", ...props }) {
  return <h3 className={`font-semibold ${className}`} {...props} />;
}
export function CardContent({ className = "", ...props }) {
  return <div className={`p-4 ${className}`} {...props} />;
}
export default Card;
