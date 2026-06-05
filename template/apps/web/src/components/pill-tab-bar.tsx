import { ReactNode } from 'react';

export interface PillTab<T extends string = string> {
  id: T;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface PillTabBarProps<T extends string> {
  tabs: PillTab<T>[];
  activeTab: T;
  onChange: (id: T) => void;
}

const PillTabBar = <T extends string>({ tabs, activeTab, onChange }: PillTabBarProps<T>) => (
  <div className="flex gap-1">
    {tabs.map((tab) => {
      const active = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={
            active
              ? 'inline-flex h-8 items-center gap-2 rounded-md border border-transparent bg-grey-400 px-4 text-[14px] leading-[1.4] text-black transition-colors hover:bg-grey-500'
              : 'inline-flex h-8 items-center gap-2 rounded-md border border-border-primary bg-transparent px-4 text-[14px] leading-[1.4] text-muted-foreground transition-colors hover:border-border-secondary hover:bg-grey-300'
          }
        >
          {tab.icon}
          {tab.label}
          {tab.count != null && <span className="opacity-50">{tab.count}</span>}
        </button>
      );
    })}
  </div>
);

export default PillTabBar;
