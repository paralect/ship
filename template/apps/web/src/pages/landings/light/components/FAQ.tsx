import { FC } from 'react';
import { motion } from 'framer-motion';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'components/ui/accordion';

const FAQ: FC = () => {
  const faqs = [
    {
      question: 'What exactly is included in Ship?',
      answer:
        "Ship is a modern SaaS boilerplate including a Next.js web application, a multi-tenant Node.js API, MongoDB database setup, Stripe integration for billing, user authentication, profile management, and more. It's essentially every piece of plumbing you need to start building your product.",
    },
    {
      question: 'Which technologies are used?',
      answer:
        'We use a rock-solid, production-ready stack: TypeScript, Next.js (App Router), Node.js (Express-based), MongoDB (with Atlas integration support), Redis, Stripe, Tailwind CSS, and Shadcn UI. All components are built with modern patterns.',
    },
    {
      question: 'Can I use it for multiple projects?',
      answer:
        'Yes! If you purchase a license, you can use it for as many projects as you like. We believe in empowering developers, not in vendor lock-in.',
    },
    {
      question: 'Do you offer support?',
      answer:
        'Absolutely. We pride ourselves on fast and efficient support. Pro licenses include dedicated Slack support, and for everyone else, we have a growing community and email support.',
    },
    {
      question: 'Is there a money-back guarantee?',
      answer:
        "Yes, we offer a 14-day 100% money-back guarantee. If you are not satisfied with the boilerplate, just let us know and we'll refund your purchase.",
    },
    {
      question: 'How do I get updates?',
      answer:
        'Once you purchase Ship, you gain lifetime access to all future updates for the version you bought. We regularly update the codebase with the latest technology and feature requests.',
    },
  ];

  return (
    <section
      id="faq"
      className="relative border-y-4 border-foreground bg-background pt-12 pb-16 md:pt-16 md:pb-24 scroll-mt-20"
    >
      <div className="container relative mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block rounded-lg border-2 border-foreground bg-[var(--color-landing-teal)]/10 px-4 py-1 font-mono text-xs font-black uppercase tracking-widest text-[var(--color-landing-teal)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Resolution Center
          </motion.div>
          <h2 className="font-mono text-4xl font-black tracking-tighter text-foreground sm:text-5xl uppercase">
            Frequently Asked <span className="text-muted-foreground italic">Questions.</span>
          </h2>
        </div>

        <div className="rounded-3xl border-4 border-foreground bg-background p-6 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] md:p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className={`border-b-2 border-foreground py-2 last:border-0 ${idx === faqs.length - 1 ? 'border-transparent' : ''}`}
              >
                <AccordionTrigger className="font-mono text-base font-black uppercase tracking-tight text-foreground transition-all hover:no-underline hover:text-[var(--color-landing-orange)] sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="mt-2 font-mono text-sm font-medium leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
