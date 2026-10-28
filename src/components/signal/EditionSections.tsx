import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { AboutScene } from "./AboutScene";
import { Card, CardGrid, Chapter, DropCap } from "./Editions";
import { PinnedCourier } from "./LeapingFigure";

const about = site.aboutEdition;

/** Who, then the principles, as text cards in the panel's own style. */
const notes = [
  { title: about.kicker, body: site.bio, actions: [about.cta] },
  ...about.cards.map((card, i) => ({ title: `Principle ${String(i + 1).padStart(2, "0")}`, body: card.text, actions: [] })),
];

/**
 * [01] About, Editions-style: after the hero's reveal (SkyHero), its scene
 * (AboutScene: the nebula and figure) pins over the hero and erodes in from the
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
 * [02] Work, Editions-style: the leaping courier pinned over About's nebula,
 * then every project as a card in the cream panel sliding over them. The panel archive
 * (ProjectIndex + ArchiveAccordion) is kept but not shown.
 */
export function EditionWork() {
  return (
    <Chapter
      id="index"
      label="Work"
      title="Work"
      lede="Dashboards, marketing sites and apps, built end to end and made to last."
      painting={{ src: "/images/about/about-nebula.webp", width: 1586, height: 992 }}
      backdrop={
        // The courier mid-leap, large and right of centre, pinned with the painting and drifting on scroll.
        <div className="absolute inset-y-0 right-[3%] hidden items-center md:flex">
          <PinnedCourier className="h-[82svh] w-auto [filter:drop-shadow(0_30px_50px_rgba(0,0,0,0.35))]" />
        </div>
      }
    >
      <CardGrid>
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
