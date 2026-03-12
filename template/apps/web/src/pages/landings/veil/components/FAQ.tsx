'use client';

import Link from 'next/link';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const faqItems = [
  {
    id: 'item-1',
    question: 'What tech stack does Ship use?',
    answer:
      'Ship is built on Next.js 14, Node.js, MongoDB, and Redis. It uses TypeScript throughout for type safety, Turborepo for monorepo management, and includes Shadcn UI components.',
  },
  {
    id: 'item-2',
    question: 'Is there a recurring subscription?',
    answer:
      'No, Ship is a one-time purchase. You get lifetime access to all updates and can use it for unlimited projects depending on your license.',
  },
  {
    id: 'item-3',
    question: 'What payment integrations are included?',
    answer:
      'Ship includes full Stripe integration with subscriptions, one-time payments, customer portals, and webhook handling. Everything is pre-configured and ready to monetize.',
  },
  {
    id: 'item-4',
    question: 'Can I use Ship for client projects?',
    answer: 'Yes! The Pro license allows unlimited projects. You can use Ship for as many client projects as you want.',
  },
  {
    id: 'item-5',
    question: 'What kind of support is available?',
    answer:
      'Starter includes email support, Pro includes priority Slack support, and Enterprise includes dedicated 24/7 support with on-site training options.',
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="bg-background @container scroll-mt-24 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="@xl:flex-row @xl:items-start @xl:gap-12 flex flex-col gap-8">
          <div className="@xl:sticky @xl:top-24 @xl:w-64 shrink-0">
            <h2 className="font-serif text-3xl font-medium">FAQs</h2>
            <p className="text-muted-foreground mt-3 text-sm">Your questions answered</p>
            <p className="text-muted-foreground @xl:block mt-6 hidden text-sm">
              Need more help?{' '}
              <Link href="#" className="text-primary font-medium hover:underline">
                Contact us
              </Link>
            </p>
          </div>

          <div className="flex-1">
            <Accordion type="single" collapsible>
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-dashed">
                  <AccordionTrigger className="cursor-pointer py-4 text-sm font-medium hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground pb-2 text-sm">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <p className="text-muted-foreground @xl:hidden mt-6 text-sm">
              Need more help?{' '}
              <Link href="#" className="text-primary font-medium hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
