import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { Card, CardGrid, Chapter } from "./Editions";
import { PinnedCourier } from "./LeapingFigure";

const about = site.aboutEdition;

/** Who, then the principles, as text cards in the panel's own style. */
const notes = [
  { title: about.kicker, body: site.bio, actions: [about.cta] },
  ...about.cards.map((card, i) => ({ title: `Principle ${String(i + 1).padStart(2, "0")}`, body: card.text, actions: [] })),
];

/**
 * [01] About, Editions-style: the intro plays inside the hero after the camera
 * push (SkyHero), then this cream panel stacking over it beside the rail, as
 * Work's does over its painting: the heading, then who I am and
 * the principles as text cards. The annotated meditating courier
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
      heading={`${about.dropCap}${about.headline}`}
      seed={11}
      intro={false}
      besideRail
    >
      <CardGrid>
        {notes.map((note, i) => (
          <Card key={note.title} title={note.title} body={note.body} actions={note.actions} delay={i * 0.06} />
        ))}
      </CardGrid>
    </Chapter>
  );
}

/**
 * [02] Work, Editions-style: the leaping courier pinned with the painting, then every
 * project as a card. The panel archive
 * (ProjectIndex + ArchiveAccordion) is kept but not shown.
 */
export function EditionWork() {
  return (
    <Chapter
      id="index"
      label="Work"
      title="Work"
      lede="Dashboards, marketing sites and apps, built end to end and made to last."
      seed={23}
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
