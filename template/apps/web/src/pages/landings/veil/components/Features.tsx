import { Activity, CreditCard, Database, Gauge, Lock, Shield, Zap } from 'lucide-react';

import { Card } from './ui/card';

export const Features = () => {
  return (
    <section id="features" className="bg-background @container scroll-mt-24 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance font-serif text-4xl font-medium">Everything You Need to Launch</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-balance">
            Stop wasting time on boilerplate. Ship comes with all the essential infrastructure pre-configured.
          </p>
        </div>

        <div className="@xl:grid-cols-2 @3xl:grid-cols-3 mt-12 grid gap-3 *:p-6">
          <Card variant="mixed" className="row-span-2 grid grid-rows-subgrid">
            <div className="space-y-2">
              <h3 className="text-foreground font-medium">Authentication & RBAC</h3>
              <p className="text-muted-foreground text-sm">
                Pre-configured auth with Google OAuth, email verification, and role-based access control.
              </p>
            </div>

            <div aria-hidden className="flex h-44 flex-col justify-between pt-8">
              <div className="relative flex h-10 items-center gap-12 px-6">
                <div className="bg-border absolute inset-0 my-auto h-px"></div>
                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center gap-2 rounded-full px-3 shadow-sm ring">
                  <Lock className="size-3.5" />
                  <span className="text-xs">OAuth</span>
                </div>

                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center gap-2 rounded-full px-3 shadow-sm ring">
                  <Shield className="size-3.5" />
                  <span className="text-xs">RBAC</span>
                </div>
              </div>

              <div className="pl-17 relative flex h-10 items-center justify-between gap-12 pr-6">
                <div className="bg-border absolute inset-0 my-auto h-px"></div>
                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center gap-2 rounded-full px-3 shadow-sm ring">
                  <span className="text-xs">JWT</span>
                </div>

                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center gap-2 rounded-full px-3 shadow-sm ring">
                  <span className="text-xs">Sessions</span>
                </div>
              </div>

              <div className="relative flex h-10 items-center gap-20 px-8">
                <div className="bg-border absolute inset-0 my-auto h-px"></div>
                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center gap-2 rounded-full px-3 shadow-sm ring">
                  <span className="text-xs">Email</span>
                </div>

                <div className="bg-card shadow-black/6.5 ring-border relative flex h-8 items-center gap-2 rounded-full px-3 shadow-sm ring">
                  <span className="text-xs">2FA</span>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="mixed" className="row-span-2 grid grid-rows-subgrid overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-foreground font-medium">Stripe Payments</h3>
              <p className="text-muted-foreground text-sm">
                Subscriptions, one-time payments, customer portals, and webhooks ready to go.
              </p>
            </div>

            <div aria-hidden className="relative h-44 translate-y-6">
              <div className="bg-foreground/15 absolute inset-0 mx-auto w-px"></div>
              <div className="absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
              <div className="border-primary mask-l-from-50% mask-l-to-90% mask-r-from-50% mask-r-to-50% absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
              <div className="absolute -inset-x-8 top-24 aspect-square rounded-full border"></div>
              <div className="mask-r-from-50% mask-r-to-90% mask-l-from-50% mask-l-to-50% absolute -inset-x-8 top-24 aspect-square rounded-full border border-emerald-500"></div>
              <CreditCard className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-primary" />
            </div>
          </Card>

          <Card variant="mixed" className="row-span-2 grid grid-rows-subgrid overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-foreground font-medium">Modern Full-Stack</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Next.js 14, Node.js, MongoDB, Redis with TypeScript and Turborepo.
              </p>
            </div>

            <div aria-hidden className="*:bg-foreground/15 flex h-44 justify-between pb-6 pt-12 *:h-full *:w-px">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div className="bg-primary!"></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div className="bg-primary!"></div>
              <div></div>
              <div></div>
              <div></div>
              <div className="bg-primary!"></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div className="bg-primary!"></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div className="bg-primary!"></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div className="bg-primary!"></div>
            </div>
          </Card>

          <Card variant="mixed" className="row-span-2 grid grid-rows-subgrid">
            <div className="space-y-2">
              <h3 className="font-medium">MongoDB & Redis</h3>
              <p className="text-muted-foreground text-sm">
                Optimized database layer with MongoDB for data and Redis for caching.
              </p>
            </div>

            <div className="pointer-events-none relative -ml-7 flex size-44 items-center justify-center pt-5">
              <Database className="absolute inset-0 top-2.5 size-full stroke-[0.1px] opacity-15" />
              <Database className="size-32 stroke-[0.1px]" />
            </div>
          </Card>

          <Card variant="mixed" className="row-span-2 grid grid-rows-subgrid overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-foreground font-medium">Docker & CI/CD</h3>
              <p className="text-muted-foreground text-sm">
                Production-ready Docker setup with GitHub Actions for deployment.
              </p>
            </div>

            <div aria-hidden className="relative flex h-44 items-center justify-center pt-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="size-24 stroke-[0.5px] opacity-10" />
              </div>
              <div className="relative flex items-center gap-4">
                <Gauge className="size-16 stroke-1 text-primary" />
                <div className="space-y-1">
                  <div className="text-2xl font-medium">Deploy</div>
                  <div className="text-muted-foreground text-xs">Anywhere</div>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="mixed" className="row-span-2 grid grid-rows-subgrid overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-foreground font-medium">Mixpanel Analytics</h3>
              <p className="text-muted-foreground text-sm">
                Built-in analytics integration for tracking user behavior and KPIs.
              </p>
            </div>

            <div aria-hidden className="relative flex h-44 flex-col justify-end pb-4">
              <div className="flex items-end justify-center gap-2">
                <div className="bg-primary/20 h-12 w-6 rounded-t"></div>
                <div className="bg-primary/30 h-20 w-6 rounded-t"></div>
                <div className="bg-primary/50 h-16 w-6 rounded-t"></div>
                <div className="bg-primary h-28 w-6 rounded-t"></div>
                <div className="bg-primary/60 h-24 w-6 rounded-t"></div>
                <div className="bg-primary/40 h-18 w-6 rounded-t"></div>
                <div className="bg-primary/25 h-14 w-6 rounded-t"></div>
              </div>
              <Activity className="absolute right-4 top-4 size-8 text-primary opacity-50" />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
