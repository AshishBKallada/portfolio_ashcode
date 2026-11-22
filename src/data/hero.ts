// The works hung along the hero corridor's outer wall, in walking order (components/signal/tunnel).

export type HeroWork = {
  src: string;
  /** Width / height. */
  aspect: number;
  title: string;
  /** The second line of its wall label. */
  note: string;
  /** Where "See it" goes from the caption. */
  href: string;
};

const LINKEDIN = "https://www.linkedin.com/in/ashish-b-kallada";

export const heroWorks: HeroWork[] = [
  { src: "/images/hero/hero-figure-marble.webp", aspect: 1, title: "The courier, in marble", note: "Hero study", href: "#about" },
  { src: "/images/gallery/post-01.webp", aspect: 800 / 1067, title: "Time is running out", note: "LinkedIn post", href: LINKEDIN },
  { src: "/images/gallery/hall.webp", aspect: 1100 / 614, title: "The hall", note: "Hero study", href: "#about" },
  { src: "/images/gallery/post-03.webp", aspect: 800 / 1067, title: "Discipline", note: "LinkedIn post", href: LINKEDIN },
  { src: "/images/gallery/laptop-angel.webp", aspect: 1100 / 1002, title: "Winged laptop", note: "Hero study", href: "#about" },
  { src: "/images/hero/hero-dunes.webp", aspect: 1352 / 784, title: "Dunes", note: "Hero study", href: "#about" },
  { src: "/images/gallery/post-04.webp", aspect: 800 / 1067, title: "SQL injection", note: "LinkedIn post", href: LINKEDIN },
  { src: "/images/hero/hero-courier-cape.webp", aspect: 1000 / 744, title: "The courier, caped", note: "Hero study", href: "#about" },
  { src: "/images/gallery/post-05.webp", aspect: 800 / 1001, title: "Why PWAs", note: "LinkedIn post", href: LINKEDIN },
  { src: "/images/gallery/flight-marble.webp", aspect: 1100 / 614, title: "Flight", note: "Hero study", href: "#about" },
  { src: "/images/gallery/post-02.webp", aspect: 800 / 479, title: "A jewellery app", note: "LinkedIn post", href: LINKEDIN },
  { src: "/images/gallery/courier-marble.webp", aspect: 1, title: "Courier study", note: "Hero study", href: "#about" },
  { src: "/images/gallery/post-07.webp", aspect: 800 / 450, title: "A plan builder", note: "LinkedIn post", href: LINKEDIN },
  { src: "/images/hero/hero-figure-winged-courier.webp", aspect: 1303 / 1207, title: "Winged courier", note: "Hero study", href: "#about" },
];
