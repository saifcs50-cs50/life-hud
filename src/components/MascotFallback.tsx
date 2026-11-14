interface MascotFallbackProps {
  stageName: string;
  color: string;
}

export function MascotFallback({ stageName, color }: MascotFallbackProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full border-2"
        style={{ borderColor: color }}
      >
        <span className="font-tele text-[11px] tracking-wide" style={{ color }}>
          {stageName}
        </span>
      </div>
    </div>
  );
}
