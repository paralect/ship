import { User } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO at TechStart',
    quote: 'Ship saved us weeks of development time. We launched our SaaS in just 2 weeks instead of 2 months.',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Senior Developer at DevCorp',
    quote: 'The code quality is exceptional. Clean architecture, proper TypeScript usage, and great documentation.',
  },
  {
    name: 'Emily Johnson',
    role: 'Founder at LaunchPad',
    quote:
      'Finally, a boilerplate that actually works out of the box. No more spending hours fixing configuration issues.',
  },
  {
    name: 'David Park',
    role: 'CTO at GrowthLabs',
    quote: "Best investment we've made. The authentication and payment integrations alone are worth it.",
  },
];

export const Testimonials = () => {
  return (
    <section className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="space-y-4 text-center">
          <h2 className="text-balance font-serif text-4xl font-medium">Trusted by Developers</h2>
          <p className="text-muted-foreground text-balance">
            Join hundreds of developers who have already transformed their development workflow.
          </p>
        </div>

        <div className="@xl:grid-cols-2 mt-12 grid gap-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-card ring-border text-foreground space-y-3 rounded-2xl p-4 text-sm ring-1"
            >
              <div className="flex gap-3">
                <div className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-full ring-1 ring-border">
                  <User className="size-5" />
                </div>
                <p className="text-sm font-medium">
                  {testimonial.name} <span className="text-muted-foreground ml-2 font-normal">{testimonial.role}</span>
                </p>
              </div>
              <p className="text-muted-foreground text-sm">{testimonial.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
