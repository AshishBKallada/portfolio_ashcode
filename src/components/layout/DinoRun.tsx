// Chrome-offline-style T-Rex that runs in place while cacti scroll past and it
// hops over them. Pure SVG + CSS keyframes (see `.dino-*` in globals.css).

const BODY = [
  "..........########",
  ".........##.######",
  ".........#########",
  ".........#########",
  ".........#####....",
  ".........########.",
  "#.......#####.....",
  "#.....#######.....",
  "##...##########...",
  "###.#########.#...",
  "#############.....",
  ".###########......",
  "..#########.......",
  "...#######........",
];

const LEGS_A = [
  "....###.##........",
  "....##....#.......",
  "....#.............",
  "....##............",
];
const LEGS_B = [
  "....##..###.......",
  "....#.....##......",
  "..........#.......",
  "..........##......",
];

const CACTUS = [
  "..##..",
  "..##..",
  "#.##..",
  "#.##.#",
  "#.##.#",
  "######",
  "..####",
  "..##..",
  "..##..",
  "..##..",
];

function Pixels({ rows, y = 0 }: { rows: string[]; y?: number }) {
  return rows.flatMap((row, r) =>
    [...row].map((c, x) =>
      c === "#" ? (
        <rect key={`${r}-${x}`} x={x} y={y + r} width={1.02} height={1.02} />
      ) : null,
    ),
  );
}

export function DinoRun() {
  const bodyRows = BODY.length;
  return (
    <div
      aria-hidden="true"
      className="dino-track relative h-16 w-60 overflow-hidden text-foreground sm:w-72"
    >
      <svg
        viewBox={`0 0 18 ${bodyRows + LEGS_A.length}`}
        className="dino-jump absolute bottom-[6px] left-5 h-11 w-auto fill-current"
        shapeRendering="crispEdges"
      >
        <Pixels rows={BODY} />
        <g className="dino-legs-a">
          <Pixels rows={LEGS_A} y={bodyRows} />
        </g>
        <g className="dino-legs-b">
          <Pixels rows={LEGS_B} y={bodyRows} />
        </g>
      </svg>

      <svg
        viewBox={`0 0 6 ${CACTUS.length}`}
        className="dino-cactus absolute bottom-[4px] left-full h-8 w-auto fill-current"
        shapeRendering="crispEdges"
      >
        <Pixels rows={CACTUS} />
      </svg>

      <div className="absolute inset-x-0 bottom-[5px] h-px bg-current" />
      <div className="dino-ground absolute bottom-0 left-0 flex h-[3px] w-[200%] gap-3">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="block h-px bg-current opacity-60"
            style={{ width: 2 + ((i * 7) % 6), marginTop: i % 2 ? 2 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}
