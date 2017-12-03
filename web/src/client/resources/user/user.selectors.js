export function getUser({ user }) {
  return user;
}

export function getUsername({ user }) {
  return `${user.firstName || ''} ${user.lastName || ''}`.trim();
}
