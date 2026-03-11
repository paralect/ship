import {
  SiDocker,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiRedis,
  SiStripe,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si';

const technologies = [
  { name: 'TypeScript', Icon: SiTypescript },
  { name: 'Next.js', Icon: SiNextdotjs },
  { name: 'Node.js', Icon: SiNodedotjs },
  { name: 'MongoDB', Icon: SiMongodb },
  { name: 'Stripe', Icon: SiStripe },
  { name: 'Tailwind', Icon: SiTailwindcss },
  { name: 'Redis', Icon: SiRedis },
  { name: 'Docker', Icon: SiDocker },
];

export const Logos = () => {
  return (
    <section className="bg-background @container py-12">
      <div className="mx-auto max-w-xl px-6">
        <p className="text-muted-foreground text-center text-sm mb-8">Built with modern technologies</p>
        <div className="@xl:grid-cols-4 grid grid-cols-4 gap-x-8 gap-y-8 *:flex *:flex-col *:items-center *:justify-center *:gap-2">
          {technologies.map((tech) => (
            <div key={tech.name}>
              <tech.Icon className="size-6 text-foreground/70" />
              <span className="text-xs text-muted-foreground">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
