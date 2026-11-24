// The strip down a sheet's right edge: its title set sideways, running slowly like a ticker,
// with the red marks of a printer's colour bar near the foot.
export function Spine({ text, tone, marks = false }: { text: string; tone: "light" | "dark"; marks?: boolean }) {
  return (
    <div className={`sh-spine sh-spine--${tone}`} aria-hidden="true">
      <div className="sh-spine__run">
        <span>{text}</span>
        <span>{text}</span>
      </div>
      {marks && (
        <div className="sh-spine__marks">
          <span />
          <span />
        </div>
      )}
    </div>
  );
}
