import { FC, ReactNode } from 'react';
import Image from 'next/image';

interface UnauthorizedLayoutProps {
  children: ReactNode;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => (
  <div className="grid min-h-screen grid-cols-1 sm:grid-cols-2">
    <div className="relative hidden h-screen sm:block">
      <Image src="/images/ship.svg" alt="App Info" fill className="object-cover object-left" priority />
    </div>

    <main className="flex h-screen w-full items-center justify-center px-8">{children}</main>
  </div>
);

export default UnauthorizedLayout;
