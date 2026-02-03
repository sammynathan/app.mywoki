import "./MyWokiLoader.css";

export default function MyWokiLoader() {
  return (
    <div className="mywoki-loader" aria-live="polite" aria-busy="true">
      <img
        src="/mywoki-logo.png"
        alt="MyWoki Loading"
        className="mw-path"
      />
    </div>
  );
}
