/**
 * Resting three-quarter pose (deg): turned so its right side comes toward
 * the viewer, seen from a little above so the deck shows, lid tipped back.
 * The hero's zoom eases all three to 0 so the screen faces the viewer.
 */
export const LAPTOP_POSE = { tiltX: -16, turnY: -30, lid: 14 } as const;

export const laptopPose = (t: number) => ({
  body: `rotateX(${LAPTOP_POSE.tiltX * t}deg) rotateY(${LAPTOP_POSE.turnY * t}deg)`,
  lid: `rotateX(${LAPTOP_POSE.lid * t}deg)`,
});

type Props = {
  /** The glass: transparent, so the screen layer beneath shows through. */
  screenRef: React.RefObject<HTMLDivElement | null>;
  /** The glass's corners (TL, TR, BR, BL), read back every frame to map
      the screen content onto it in perspective. */
  cornerRefs: React.RefObject<(HTMLSpanElement | null)[]>;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  lidRef: React.RefObject<HTMLDivElement | null>;
};

const CORNERS = ["top-0 left-0", "top-0 right-0", "bottom-0 right-0", "bottom-0 left-0"];
const rest = laptopPose(1);

// A silver MacBook-style laptop built in CSS 3D: a thin black bezel with a
// camera notch around an open pane of glass, on a lid hinged to an aluminium
// deck with black keys, speaker grilles and a wide trackpad.
// The bezel is a border, not a fill, so nothing paints over the glass, and
// the glass takes the stage's aspect ratio (--screen-aspect) so the screen
// can zoom to cover it exactly. No filters here: they would flatten the 3D.
export function Laptop({ screenRef, cornerRefs, bodyRef, lidRef }: Props) {
  return (
    <div aria-hidden className="relative [perspective:1400px]">
      {/* Soft contact shadow on the ground under the deck. */}
      <span className="absolute -inset-x-[6%] top-[96%] h-[42%] rounded-[50%] bg-black/45 blur-2xl" />
      <div
        ref={bodyRef}
        style={{ transform: rest.body }}
        className="relative [transform-style:preserve-3d]"
      >
        {/* Lid, hinged along its bottom edge. */}
        <div
          ref={lidRef}
          style={{ transform: rest.lid }}
          className="relative origin-bottom rounded-[clamp(8px,1vw,14px)] border-[clamp(4px,0.45vw,8px)] border-[#0b0b0c] shadow-[0_0_0_1.5px_#d4d6d9,0_0_0_2.5px_#a9acb1]"
        >
          <div
            ref={screenRef}
            style={{ aspectRatio: "var(--screen-aspect)" }}
            className="relative overflow-hidden rounded-[2px]"
          >
            {CORNERS.map((pos, i) => (
              <span
                key={pos}
                ref={(el) => {
                  cornerRefs.current[i] = el;
                }}
                className={`absolute size-0 ${pos}`}
              />
            ))}
            {/* Camera notch, dipping into the top of the display. */}
            <span className="absolute top-0 left-1/2 flex h-[3.2%] w-[11%] -translate-x-1/2 items-center justify-center rounded-b-[clamp(3px,0.35vw,6px)] bg-[#0b0b0c]">
              <span className="size-[clamp(2px,0.2vw,3px)] rounded-full bg-[#1f2a33]" />
            </span>
          </div>
        </div>

        {/* Deck: brushed aluminium, lying flat from the hinge toward the viewer. */}
        <div className="absolute top-full -left-[5%] aspect-[1/0.68] w-[110%] origin-top rotate-x-90 rounded-b-[clamp(8px,1vw,14px)] bg-[linear-gradient(180deg,#c9cbcf,#e8e9eb_40%,#dcdee1)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)] [transform-style:preserve-3d]">
          {/* Speaker grilles either side of the keyboard. */}
          {["left-[3.5%]", "right-[3.5%]"].map((pos) => (
            <span
              key={pos}
              className={`absolute top-[9%] h-[44%] w-[4%] ${pos} bg-[radial-gradient(circle,rgba(0,0,0,0.35)_0.5px,transparent_0.9px)] bg-[size:3px_3px]`}
            />
          ))}
          {/* Keyboard: black keys with aluminium between them. */}
          <div className="absolute top-[9%] left-[9.5%] h-[44%] w-[81%] rounded-[3px] bg-[#111113] bg-[linear-gradient(90deg,#c3c5c9_1px,transparent_1px),linear-gradient(#c3c5c9_1px,transparent_1px)] bg-[size:6.66%_16.66%] shadow-[inset_0_0_0_1px_#c3c5c9]" />
          {/* Trackpad. */}
          <div className="absolute top-[58%] left-1/2 h-[36%] w-[44%] -translate-x-1/2 rounded-[clamp(3px,0.4vw,6px)] bg-[#d6d8db] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]" />
          {/* Front lip, with the thumb notch for opening the lid. */}
          <div className="absolute top-full inset-x-0 h-[clamp(5px,0.6vw,9px)] origin-top -rotate-x-90 rounded-b-[clamp(6px,0.8vw,12px)] bg-[linear-gradient(#cfd1d4,#8e9196)]">
            <span className="absolute top-0 left-1/2 h-[50%] w-[14%] -translate-x-1/2 rounded-b-[4px] bg-[#9a9da2]" />
          </div>
        </div>
      </div>
    </div>
  );
}
