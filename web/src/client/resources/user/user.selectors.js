// @flow

import type { StateType } from '../types';
import type { UserType } from './user.types';

export function getUser({ user }: StateType): UserType {
  return user;
}

export function getUsername({ user }: StateType): string {
  return `${user.firstName || ''} ${user.lastName || ''}`.trim();
}
