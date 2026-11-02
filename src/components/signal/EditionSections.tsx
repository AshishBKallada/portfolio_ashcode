import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { WORK_SCROLL } from "@/lib/hero";
import { AboutScene } from "./AboutScene";
import { Card, CardGrid, Chapter, DropCap } from "./Editions";
import { PinnedCourier } from "./LeapingFigure";
import { PointerParallax } from "./PointerParallax";
import { SwirlClouds } from "./SwirlClouds";

const about = site.aboutEdition;

/** Who, then the principles, as text cards in the panel's own style. */
const notes = [
  { title: about.kicker, body: site.bio, actions: [about.cta] },
  ...about.cards.map((card, i) => ({ title: `Principle ${String(i + 1).padStart(2, "0")}`, body: card.text, actions: [] })),
];

/**
 * [01] About, Editions-style: after the hero's reveal (SkyHero), its scene
 * (AboutScene: nebula and visor figure) pins over the hero and dissolves in from the
 * bottom, dissolving "Obsession beats Talent" away; then the title and lede
 * scroll over it in cream, and the heading, who I am and the principles, as
 * text cards, in one cream box. The annotated meditating courier
 * (AnnotatedFigure) and the earlier About (SignalAbout: AboutMeStage,
 * LinkedInSection, ticket cards) are kept but not shown.
 */
export function EditionAbout() {
  return (
    <Chapter
      id="about"
      label="About"
      title="About"
      lede={about.body}
      intro={false}
      besideRail
      pinned={<AboutScene track="about-reveal" />}
    >
      {/* The heading and the cards in one cream box over the scene, in the page ground as Work's panel. */}
      <div className="bg-background p-6 text-ink [text-shadow:none] md:p-10">
        <h3 className="max-w-[60rem] pb-8 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.98] text-balance md:pb-12">
          <DropCap>{`${about.dropCap}${about.headline}`}</DropCap>
        </h3>
        <CardGrid>
          {notes.map((note, i) => (
            <Card key={note.title} title={note.title} body={note.body} actions={note.actions} delay={i * 0.06} />
          ))}
        </CardGrid>
      </div>
    </Chapter>
  );
}

/**
 * [02] Work, Editions-style: the leaping courier pinned over the marble city,
 * with watercolour clouds (SwirlClouds) drifting through its sky, then every
 * project as a card in the cream panel sliding over them. The panel archive
 * (ProjectIndex + ArchiveAccordion) is kept but not shown.
 */
export function EditionWork() {
  return (
    <Chapter
      id="index"
      label="Work"
      title="Work"
      lede="Dashboards, marketing sites and apps, built end to end and made to last."
      panelTone="white"
      painting={WORK_SCROLL}
      pointerParallax
      // The courier mid-leap, large and right of centre, pinned with the painting and drifting on scroll;
      // it rises from the bottom centre to there over About as the intro comes up, under the cards.
      // Two of the clouds in front of the cards panel too, at its sides; the same throw and parallax.
      front={
        <PointerParallax x={36} y={22} scroll={220}>
          <SwirlClouds layer="front" rise={{ track: "index-intro", from: 1, to: 1.45 }} />
        </PointerParallax>
      }
      foreground={
        <PointerParallax x={64} y={38} rotate={2.8} className="absolute inset-y-0 right-[3%] hidden items-start pt-[5svh] md:flex">
          <PinnedCourier rise="index-intro" className="h-[78svh] w-auto [filter:drop-shadow(0_30px_50px_rgba(0,0,0,0.35))]" />
        </PointerParallax>
      }
      backdrop={
        <>
          {/* The hero's cursor parallax in depth: the painting drifts against the pointer,
              the clouds with it, the courier (foreground) with it most and tilting. On scroll alone the
              clouds slide up past the painting faster than it drifts (ScrollZoom). */}
          {/* Watercolour clouds drifting through the painting's sky, behind the courier: first of the
              entrance once the painting has torn in, each thrown up from below on its own beat. */}
          <PointerParallax x={36} y={22} scroll={220}>
            <SwirlClouds layer="back" rise={{ track: "index-intro", from: 1, to: 1.45 }} />
          </PointerParallax>
        </>
      }
    >
      <CardGrid columns={2}>
        {projects.map((project, i) => (
          <Card
            key={project.slug}
            title={project.title}
            meta={String(project.year)}
            body={project.summary}
            media={{ src: project.image, alt: `${project.title} preview` }}
            delay={i * 0.06}
            actions={[
              { label: "Case study", href: `/projects/${project.slug}` },
              ...(project.liveUrl ? [{ label: "Live", href: project.liveUrl, external: true }] : []),
              ...(project.githubUrl ? [{ label: "Code", href: project.githubUrl, external: true }] : []),
            ]}
          >
            <p className="mb-3 font-narrative text-[15px] tracking-[-0.02em] text-ink/60">{project.tags.join(" · ")}</p>
          </Card>
        ))}
      </CardGrid>
    </Chapter>
  );
}
