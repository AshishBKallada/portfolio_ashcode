import Link from "next/link";

export default function NotFound() {
  return (
    <section className="kx-lost">
      <h1 className="kx-lost__title">Not here</h1>
      <p className="kx-lost__text">That page does not exist. The river is still on the home page.</p>
      <Link href="/" className="kx-button">
        Back home
      </Link>
    </section>
  );
}
