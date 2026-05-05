import { FC } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, CreditCard, Database, ShieldCheck, Zap } from 'lucide-react';

const Features: FC = () => {
  const features = [
    {
      title: 'Authentication & RBAC',
      description: 'Pre-configured auth including Google OAuth, email verification, and role-based access control.',
      icon: ShieldCheck,
      color: 'text-[var(--color-landing-teal)]',
      accent: 'border-[var(--color-landing-teal)]',
      bg: 'bg-[var(--color-landing-teal)]/5',
    },
    {
      title: 'Stripe Subscriptions',
      description: 'Fully integrated payment workflows with checkout sessions, webhooks, and billing portals.',
      icon: CreditCard,
      color: 'text-[var(--color-landing-orange)]',
      accent: 'border-[var(--color-landing-orange)]',
      bg: 'bg-[var(--color-landing-orange)]/5',
    },
    {
      title: 'Modern Full-Stack',
      description: 'Next.js App Router, Node.js API, MongoDB, and Redis with type-safety across the stack.',
      icon: Database,
      color: 'text-[var(--color-landing-cyan)]',
      accent: 'border-[var(--color-landing-cyan)]',
      bg: 'bg-[var(--color-landing-cyan)]/5',
    },
    {
      title: 'Analytics Dashboard',
      description: 'Built-in Mixpanel integration to track user behavior and KPIs from day one.',
      icon: BarChart3,
      color: 'text-foreground',
      accent: 'border-foreground',
      bg: 'bg-muted',
    },
  ];

  const secondaryFeatures = [
    'Turborepo for monorepo management',
    'Shadcn UI component library',
    'Mixpanel analytics integration',
    'Docker & Kubernetes ready',
    'Email templates with Resend',
    'Type-safe API with Zod',
    'GitHub Actions for CI/CD',
    'Winston logging & Sentry',
  ];

  return (
    <section
      id="features"
      className="relative border-y-4 border-foreground bg-background pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden scroll-mt-20"
    >
      <div className="absolute inset-0 z-0 opacity-[0.03] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]">
        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="absolute right-0 top-0 size-96 opacity-[0.03] pointer-events-none translate-x-1/2 -translate-y-1/2">
        <div className="size-full rounded-full border-[40px] border-foreground" />
      </div>

      <div className="container relative mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="mb-6 inline-block rounded-lg border-2 border-foreground bg-background px-4 py-1 font-mono text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              Engineered for Speed
            </motion.div>
            <h2 className="font-mono text-4xl font-black tracking-tighter text-foreground sm:text-5xl md:text-6xl uppercase">
              Everything you need
              <br />
              to launch. <span className="text-muted-foreground italic">Fast.</span>
            </h2>
          </div>
          <div className="max-w-md pb-2">
            <p className="font-mono text-lg font-medium leading-relaxed text-muted-foreground">
              Stop wasting time on boilerplate. Ship comes with all the essential infrastructure for your SaaS
              pre-configured and battle-tested.
            </p>
          </div>
        </div>

        <div className="mt-24 grid gap-8 lg:grid-cols-12">
          <motion.div
            whileHover={{ y: -8 }}
            className="lg:col-span-8 flex flex-col justify-between overflow-hidden rounded-3xl border-4 border-foreground bg-background p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div>
              <div className="flex size-16 items-center justify-center rounded-2xl border-4 border-foreground bg-[var(--color-landing-teal)]/10 text-[var(--color-landing-teal)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
                <Zap className="size-8" fill="currentColor" />
              </div>
              <h3 className="mb-6 font-mono text-3xl font-black uppercase tracking-tight text-foreground md:text-4xl">
                The Performance Engine
              </h3>
              <p className="max-w-xl font-mono text-lg font-medium text-muted-foreground">
                Built on the latest tech stack optimized for performance and scalability. Next.js 14, Turborepo, and
                Node.js working in perfect harmony.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {['NEXT.JS', 'TYPESCRIPT', 'NODE.JS', 'MONGODB'].map((tech) => (
                <div
                  key={tech}
                  className="rounded-xl border-2 border-foreground bg-muted p-3 text-center font-mono text-xs font-black tracking-widest uppercase"
                >
                  {tech}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="lg:col-span-4 flex flex-col rounded-3xl border-4 border-foreground bg-background p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <div className="mb-6 flex size-14 items-center justify-center rounded-xl border-4 border-foreground bg-[var(--color-landing-orange)]/10 text-[var(--color-landing-orange)] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <CreditCard className="size-6" />
            </div>
            <h3 className="mb-4 font-mono text-2xl font-black uppercase tracking-tight text-foreground">
              Built-in Billing
            </h3>
            <p className="font-mono text-base font-medium text-muted-foreground">
              Full Stripe integration with subscriptions, one-time payments, and customer portals.
            </p>
            <div className="mt-auto pt-8">
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden border-2 border-foreground">
                <div className="h-full w-3/4 bg-[var(--color-landing-orange)]" />
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] font-black uppercase tracking-widest">
                <span>Revenue Ready</span>
                <span>75%</span>
              </div>
            </div>
          </motion.div>

          {features.slice(2).map((feature) => (
            <motion.div
              key={feature.title}
              whileHover={{ y: -8 }}
              className="lg:col-span-4 flex flex-col rounded-3xl border-4 border-foreground bg-background p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div
                className={`mb-6 flex size-14 items-center justify-center rounded-xl border-4 border-foreground ${feature.bg} ${feature.color} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
              >
                <feature.icon className="size-6" />
              </div>
              <h3 className="mb-4 font-mono text-xl font-black uppercase tracking-tight text-foreground">
                {feature.title}
              </h3>
              <p className="font-mono text-base font-medium text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}

          <motion.div
            whileHover={{ y: -8 }}
            className="lg:col-span-4 flex flex-col rounded-3xl border-4 border-foreground bg-foreground p-8 shadow-[12px_12px_0px_0px_rgba(255,165,0,1)] transition-all text-background"
          >
            <h3 className="mb-6 font-mono text-xl font-black uppercase tracking-tight">+ PLUS MUCH MORE</h3>
            <ul className="space-y-3">
              {secondaryFeatures.slice(0, 5).map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-tight opacity-80"
                >
                  <ArrowRight className="size-4 shrink-0 text-[var(--color-landing-orange)]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8 font-mono text-xs font-black uppercase tracking-widest italic opacity-50">
              Battle-tested in real products
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
