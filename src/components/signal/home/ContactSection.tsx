import { contact } from "@/data/home";
import { site } from "@/data/site";
import { ContactDetails } from "./ContactDetails";
import { ContactDoorway } from "./ContactDoorway";
import { CopyEmail } from "./CopyEmail";
import { Reveal } from "./Reveal";

/**
 * Contact, on the white ground: the invitation set large on the left, the email under it
 * with a copy button, then the details and the one action. The stair stands on the right
 * as a tall narrow doorway, its foot level with the action.
 */
export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      data-nav-theme="light"
      className="grid gap-12 px-4 pt-[20svh] md:grid-cols-12 md:items-end md:gap-8 md:px-8"
    >
      <div className="flex flex-col gap-10 md:col-span-8 md:gap-14">
        <Reveal>
          <h2
            id="contact-title"
            className="font-sans text-[40px] leading-[0.98] font-medium tracking-[-0.035em] text-ink md:text-[clamp(56px,6.2vw,104px)]"
          >
            {contact.title[0]}
            <br />
            {contact.title[1]}
          </h2>
          <p className="mt-6 max-w-[44ch] text-[18px] leading-[1.5] text-ink">{contact.lede}</p>
        </Reveal>
        <Reveal order={1}>
          <CopyEmail email={site.email} />
        </Reveal>
        <Reveal order={2}>
          <ContactDetails />
        </Reveal>
        <Reveal order={3} className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={contact.action.href}
            className="inline-flex h-14 items-center bg-ink px-8 text-[16px] font-medium text-white transition-[background-color,transform] duration-300 hover:bg-brand active:scale-[0.98]"
          >
            {contact.action.label}
          </a>
          <ul className="flex gap-6">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[16px] text-ink underline-offset-4 hover:underline"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <Reveal order={1} className="mx-auto w-[48vw] md:col-span-3 md:col-start-10 md:mx-0 md:w-full">
        <ContactDoorway />
      </Reveal>
    </section>
  );
}
