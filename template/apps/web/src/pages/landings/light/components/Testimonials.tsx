import { FC } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials: FC = () => {
  const testimonials = [
    {
      content:
        'Ship saved us at least two months of development time. The integration between Next.js and Node.js is seamless, and the Stripe pieces are solid.',
      author: 'Alex Rivera',
      role: 'Founder, Trendly',
      metrics: '$10k MRR in 3 months',
      rating: 5,
    },
    {
      content:
        'As a senior developer, I appreciate the clean code and the choice of technology. No bloat, just the essentials you need to build a real business.',
      author: 'Sarah Chen',
      role: 'Indie Hacker & Freelancer',
      metrics: 'Launched 5 products',
      rating: 5,
    },
    {
      content:
        "The best part about Ship is the architecture. It's built for scale, but it's simple enough to understand. The documentation is top-notch.",
      author: 'David Miller',
      role: 'CTO, SaaS-it-up',
      metrics: 'Scaled to 100k users',
      rating: 5,
    },
  ];

  return (
    <section className="relative border-y-4 border-foreground bg-background pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-4 inline-block rounded-lg border-2 border-foreground bg-[var(--color-landing-orange)]/10 px-4 py-1 font-mono text-xs font-black uppercase tracking-widest text-[var(--color-landing-orange)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Proof of Speed
          </motion.div>
          <h2 className="font-mono text-4xl font-black tracking-tighter text-foreground sm:text-5xl md:text-6xl uppercase">
            Trusted by World-Class
            <br />
            <span className="text-muted-foreground italic">Developers.</span>
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, idx) => {
            const starKeys = [`${idx}-0`, `${idx}-1`, `${idx}-2`, `${idx}-3`, `${idx}-4`];
            return (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ rotate: idx % 2 === 0 ? 1 : -1, y: -5 }}
                className="flex flex-col rounded-3xl border-4 border-foreground bg-background p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="mb-6 flex gap-1 text-[var(--color-landing-orange)]">
                  {starKeys.slice(0, testimonial.rating).map((key) => (
                    <Star key={key} className="size-5 fill-current" />
                  ))}
                </div>

                <blockquote className="mb-8 flex-1 font-mono text-lg font-bold leading-relaxed text-foreground whitespace-normal italic">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                <div className="mt-auto flex flex-col gap-4">
                  <div className="inline-block self-start rounded-md border-2 border-foreground bg-muted px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest">
                    Result: {testimonial.metrics}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full border-2 border-foreground bg-muted" />
                    <div className="flex-1">
                      <p className="font-mono text-sm font-black uppercase tracking-tight text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
