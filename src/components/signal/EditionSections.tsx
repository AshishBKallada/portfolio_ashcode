import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { AboutScene } from "./AboutScene";
import { Card, CardGrid, Chapter } from "./Editions";
import { PinnedCourier } from "./LeapingFigure";
import { PointerParallax } from "./PointerParallax";
import { SwirlClouds } from "./SwirlClouds";

/** Work's figure: the courier on horseback, a transparent cutout. */
const RIDER = { src: "/images/work/work-rider.webp", width: 1376, height: 768 };

const about = site.aboutEdition;

/**
 * [01] About, Editions-style: after the hero's reveal (SkyHero), its scene
 * (AboutScene: cream and the visor figure) pins over the hero and dissolves in from the
 * bottom, dissolving "Obsession beats Talent" away; then the title and lede
 * scroll over it in ink. The annotated meditating courier
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
      light
      pinned={<AboutScene track="about-reveal" />}
    />
  );
}

/**
 * [02] Work, Editions-style: the courier on horseback pinned over the page cream,
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
      painting={null}
      light
      pointerParallax
      // The courier on horseback, large and right of centre, pinned with the painting and drifting on scroll;
      // it rises from the bottom centre to there over About as the intro comes up, under the cards.
      // Two of the clouds in front of the cards panel too, at its sides; the same throw and parallax.
      front={
        <PointerParallax x={36} y={22} scroll={220}>
          <SwirlClouds layer="front" rise={{ track: "index-intro", from: 1, to: 1.45 }} />
        </PointerParallax>
      }
      foreground={
        <PointerParallax x={64} y={38} rotate={2.8} className="absolute inset-y-0 right-[3%] hidden items-start pt-[5svh] md:flex">
          <PinnedCourier
            rise="index-intro"
            figure={RIDER}
            className="h-auto w-[min(62vw,110svh)] [filter:drop-shadow(0_30px_50px_rgba(0,0,0,0.35))]"
          />
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
