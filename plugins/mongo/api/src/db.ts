export { default } from '@ship/db';

// Re-export User type from the users schema when available
// The actual User type is defined in the users schema, imported by consumers directly
// This re-export satisfies template imports like `import type { User } from '@/db'`
export type { User } from '@ship/db';
