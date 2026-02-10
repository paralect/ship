import Link from 'next/link';

const Home = () => (
  <div className="flex min-h-screen flex-col items-center justify-center p-8">
    <h1 className="mb-4 text-4xl font-bold">Ship + shadcn/ui</h1>

    <p className="mb-8 text-muted-foreground">
      Migration in progress. This is a fresh start with Tailwind CSS and shadcn/ui components.
    </p>

    <div className="flex gap-4">
      <Link
        href="/demo"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
      >
        View Demo
      </Link>
    </div>
  </div>
);

export default Home;
