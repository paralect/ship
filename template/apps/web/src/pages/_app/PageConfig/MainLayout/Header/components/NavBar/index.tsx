import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Anchor, Flex } from '@mantine/core';

type NavBarOption = {
  label: string;
  path: string;
};

interface NavBarProps {
  options: NavBarOption[];
}

const NavBar: NextPage<NavBarProps> = ({ options }) => {
  const router = useRouter();
  const isActive = (path: string) => (router.pathname === path ? 'always' : 'never');

  return (
    <Flex gap={20} justify="flex-start">
      {options?.map((option) => (
        <Anchor key={option.path} component={Link} href={option.path} underline={isActive(option.path)}>
          {option.label}
        </Anchor>
      ))}
    </Flex>
  );
};

export default NavBar;
