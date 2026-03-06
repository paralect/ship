import React, { FC } from 'react';
import { motion } from 'framer-motion';
import {
  SiDocker,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiRedis,
  SiStripe,
  SiTailwindcss,
  SiTurborepo,
  SiTypescript,
} from 'react-icons/si';

const technologies = [
  { name: 'TypeScript', Icon: SiTypescript, color: 'text-[#3178C6]', position: 'top-[8%] left-[8%]' },
  { name: 'Next.js', Icon: SiNextdotjs, color: 'text-foreground', position: 'top-[5%] right-[22%]' },
  { name: 'Node.js', Icon: SiNodedotjs, color: 'text-[#339933]', position: 'bottom-[12%] left-[12%]' },
  { name: 'MongoDB', Icon: SiMongodb, color: 'text-[#47A248]', position: 'bottom-[8%] right-[15%]' },
  { name: 'Stripe', Icon: SiStripe, color: 'text-[#008CDD]', position: 'top-[35%] left-[2%]' },
  { name: 'Tailwind', Icon: SiTailwindcss, color: 'text-[#06B6D4]', position: 'top-[55%] right-[2%]' },
  { name: 'Turborepo', Icon: SiTurborepo, color: 'text-[#EF4444]', position: 'top-[4%] left-[35%]' },
  { name: 'React', Icon: SiReact, color: 'text-[#61DAFB]', position: 'top-[22%] right-[8%]' },
  { name: 'Redis', Icon: SiRedis, color: 'text-[#FF4438]', position: 'bottom-[10%] left-[45%]' },
  { name: 'Docker', Icon: SiDocker, color: 'text-[#2496ED]', position: 'top-[65%] left-[18%]' },
];

const Logos: FC = () => {
  return (
    <section className="relative border-y-4 border-foreground bg-background py-16 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none hidden md:block"
        style={{
          backgroundImage: `
               linear-gradient(to right, currentColor 1px, transparent 1px),
               linear-gradient(to bottom, currentColor 1px, transparent 1px)
             `,
          backgroundSize: '40px 40px',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* Mobile version - simple grid */}
      <div className="container mx-auto max-w-7xl px-4 md:hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="font-mono text-2xl font-black tracking-tighter text-foreground uppercase">
            Full Stack Engine
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-2 uppercase tracking-widest">Production Ready</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {technologies.map((tech, idx) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${tech.color}`}
            >
              {(() => {
                const Icon = tech.Icon as React.ComponentType<{ className?: string }>;
                return <Icon className="size-5 shrink-0" />;
              })()}
              <span className="font-mono text-xs font-bold uppercase tracking-tight text-foreground truncate">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop version - floating layout */}
      <div className="container relative mx-auto max-w-7xl px-4 min-h-[600px] items-center justify-center hidden md:flex">
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="inline-block rounded-2xl border-4 border-foreground bg-background p-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
          >
            <p className="font-mono text-xs font-black uppercase tracking-[0.4em] text-muted-foreground mb-4">
              System_Integrity: 100%
            </p>
            <h2 className="font-mono text-4xl font-black tracking-tighter text-foreground sm:text-6xl uppercase">
              Full Stack
              <br />
              Engine
            </h2>
          </motion.div>
        </div>

        <svg className="absolute inset-0 size-full opacity-10 pointer-events-none" stroke="currentColor">
          <line x1="50%" y1="50%" x2="15%" y2="20%" strokeWidth="2" strokeDasharray="8 8" />
          <line x1="50%" y1="50%" x2="85%" y2="20%" strokeWidth="2" strokeDasharray="8 8" />
          <line x1="50%" y1="50%" x2="15%" y2="80%" strokeWidth="2" strokeDasharray="8 8" />
          <line x1="50%" y1="50%" x2="85%" y2="80%" strokeWidth="2" strokeDasharray="8 8" />
        </svg>

        {technologies.map((tech, idx) => (
          <motion.div
            key={tech.name}
            className={`absolute ${tech.position} z-20`}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05, type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.div
              whileHover={{
                scale: 1.1,
                rotate: idx % 2 === 0 ? 5 : -5,
                boxShadow: '12px 12px 0px 0px rgba(0,0,0,1)',
              }}
              className={`group relative flex items-center gap-4 px-5 py-4 rounded-xl border-4 border-foreground bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-crosshair ${tech.color}`}
            >
              {(() => {
                const Icon = tech.Icon as React.ComponentType<{ className?: string }>;
                return <Icon className="size-8 transition-transform group-hover:scale-110" />;
              })()}
              <span className="font-mono text-sm font-black uppercase tracking-tighter text-foreground">
                {tech.name}
              </span>
            </motion.div>

            <motion.div
              animate={{ rotate: idx % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 10 + idx, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-10 border-2 border-foreground/5 rounded-full pointer-events-none"
            >
              <div className="absolute top-0 left-1/2 size-2 -translate-x-1/2 rounded-full border-2 border-foreground bg-background" />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="absolute left-8 top-8 font-mono text-[10px] text-muted-foreground uppercase opacity-60 leading-relaxed hidden md:block">
        [SYS_LOG]: Booting ship_v2.0.0...
        <br />
        [SYS_LOG]: Initializing stack_modules...
        <br />
        [SYS_LOG]: Security_protocol: ENABLED
      </div>
      <div className="absolute right-8 bottom-8 font-mono text-[10px] text-right text-muted-foreground uppercase opacity-60 leading-relaxed hidden md:block">
        Scale: 1:1
        <br />
        Format: Blueprint_Standard
        <br />
        Ref: PS-2024-X1
      </div>

      <div className="absolute left-1/2 top-4 -translate-x-1/2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.5em] hidden md:block">
        Top_Architecture_Visualization
      </div>
      <div className="absolute left-1/2 bottom-4 -translate-x-1/2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.5em] hidden md:block">
        Production_Environment_Approved
      </div>
    </section>
  );
};

export default Logos;
