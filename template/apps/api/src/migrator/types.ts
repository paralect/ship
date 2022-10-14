export class Migration {
  description?: string;

  version: number;

  constructor(version: number, description?: string) {
    this.version = version;
    this.description = description;
  }

  migrate?: () => Promise<void>;
}

export default Migration;
