import { contact } from "@/data/home";

/** What, where and when, in three columns: the label soft, the value in full ink. */
export function ContactDetails() {
  return (
    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
      {contact.details.map((row) => (
        <div key={row.label}>
          <dt className="text-[14px] text-ink/60">{row.label}</dt>
          <dd className="mt-1 text-[18px] leading-snug text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
