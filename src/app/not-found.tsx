import { Container } from "@/components/layout/Container";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Container className="bg-background py-24 text-center">
        <p className="text-sm text-muted">404</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          That route doesn&rsquo;t exist. Head back home to see selected work.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="/">Back home</Button>
        </div>
      </Container>
      <Footer />
    </>
  );
}
