import Link from "next/link";

export default function NotFound() {
  return (
    <section className="sh-lost">
      <h1>404</h1>
      <p>That page is not in the portfolio.</p>
      <Link href="/" className="sh-button">
        Back to the cover
      </Link>
    </section>
  );
}
