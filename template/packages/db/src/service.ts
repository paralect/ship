import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  notInArray,
  or,
  SQL,
} from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// eslint-disable-next-line ts/no-explicit-any
type AnyTable = any;

// eslint-disable-next-line ts/no-explicit-any
type TableLike = { $inferSelect: any; $inferInsert: any; [key: string]: any };

type Select<T extends TableLike> = T['$inferSelect'];
type Insert<T extends TableLike> = T['$inferInsert'];

export type MutationType = 'insert' | 'update' | 'delete';

export interface MutationEvent<T extends TableLike = TableLike> {
  type: MutationType;
  docs: Select<T>[];
  prevDocs?: Select<T>[];
}

interface ColumnOps<V> {
  eq?: V;
  ne?: V;
  gt?: V;
  gte?: V;
  lt?: V;
  lte?: V;
  like?: string;
  ilike?: string;
  in?: V[];
  notIn?: V[];
  isNull?: true;
  isNotNull?: true;
}

type Filter<T extends TableLike> =
  | ({
      [K in keyof Select<T>]?: Select<T>[K] | ColumnOps<NonNullable<Select<T>[K]>>;
    } & {
      OR?: Filter<T>[];
      AND?: Filter<T>[];
    })
  | SQL;

type OrderBy<T extends TableLike> = Partial<Record<keyof Select<T>, 'asc' | 'desc'>>;

// eslint-disable-next-line ts/no-explicit-any
type WithOption = Record<string, any>;
type ColumnsOption = Record<string, boolean>;

interface RelationalReadOptions<T extends TableLike> {
  where?: Filter<T>;
  orderBy?: OrderBy<T>;
  limit?: number;
  offset?: number;
  with?: WithOption;
  columns?: ColumnsOption;
}

type WithResult<T extends TableLike> = Select<T> & Record<string, unknown>;

type CrudFindFirst<T extends TableLike> = (
  options?: { where?: Filter<T>; orderBy?: OrderBy<T> },
) => Promise<Select<T> | undefined>;

type CrudFind<T extends TableLike> = (
  options?: { where?: Filter<T>; orderBy?: OrderBy<T>; limit?: number; offset?: number },
) => Promise<Select<T>[]>;

// Relational variants delegate to the generated Drizzle query builder (`Rel`),
// so `findFirst`/`find` with `with`/`columns` keep Drizzle's precise inference.
type RelFindFirst<Rel> = Rel extends { findFirst: infer F } ? F : (options?: object) => Promise<unknown>;
type RelFind<Rel> = Rel extends { findMany: infer F } ? F : (options?: object) => Promise<unknown[]>;

function toRelationalWhere(filter: unknown): unknown {
  if (filter === null || filter === undefined) return filter;
  if (filter instanceof SQL) return filter;
  if (Array.isArray(filter)) return filter.map(toRelationalWhere);
  if (typeof filter !== 'object' || filter instanceof Date) return filter;

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(filter as Record<string, unknown>)) {
    if (value === undefined) continue;
    if (value === null) {
      out[key] = { isNull: true };
      continue;
    }
    if (key === 'OR' || key === 'AND') {
      out[key] = (value as unknown[]).map(toRelationalWhere);
      continue;
    }
    out[key] = value;
  }
  return out;
}

// eslint-disable-next-line ts/no-explicit-any
export class DbService<T extends TableLike = AnyTable, Rel = any> {
  readonly table: T;
  readonly key: string;
  private db: PostgresJsDatabase<Record<string, unknown>>;
  private onMutation?: (event: MutationEvent<T>) => void;

  // eslint-disable-next-line ts/no-explicit-any
  constructor(table: any, db: any, key: string, onMutation?: (event: MutationEvent<T>) => void) {
    this.table = table;
    this.db = db;
    this.key = key;
    this.onMutation = onMutation;
  }

  private get relational(): Rel {
    // eslint-disable-next-line ts/no-explicit-any
    return (this.db as any).query[this.key] as Rel;
  }

  private relRead(options: RelationalReadOptions<T>) {
    return {
      where: options.where ? toRelationalWhere(options.where) : undefined,
      orderBy: options.orderBy,
      with: options.with,
      columns: options.columns,
      limit: options.limit,
      offset: options.offset,
    };
  }

  private get t(): AnyTable {
    return this.table;
  }

  private col(key: string): AnyTable {
    return (this.table as Record<string, unknown>)[key];
  }

  private resolveFilter(filter: Filter<T>): SQL | undefined {
    if (filter instanceof SQL) return filter;

    const conditions: (SQL | undefined)[] = [];

    for (const [key, value] of Object.entries(filter as Record<string, unknown>)) {
      if (value === undefined) continue;

      if (key === 'OR') {
        const orConds = (value as Filter<T>[]).map((f) => this.resolveFilter(f)).filter(Boolean);
        if (orConds.length) conditions.push(or(...orConds));
        continue;
      }

      if (key === 'AND') {
        const andConds = (value as Filter<T>[]).map((f) => this.resolveFilter(f)).filter(Boolean);
        if (andConds.length) conditions.push(and(...andConds));
        continue;
      }

      const column = this.col(key);

      if (value === null) {
        conditions.push(isNull(column));
        continue;
      }

      if (typeof value !== 'object' || value instanceof Date) {
        conditions.push(eq(column, value));
        continue;
      }

      const ops = value as ColumnOps<unknown>;
      if (ops.eq !== undefined) conditions.push(eq(column, ops.eq));
      if (ops.ne !== undefined) conditions.push(ne(column, ops.ne));
      if (ops.gt !== undefined) conditions.push(gt(column, ops.gt));
      if (ops.gte !== undefined) conditions.push(gte(column, ops.gte));
      if (ops.lt !== undefined) conditions.push(lt(column, ops.lt));
      if (ops.lte !== undefined) conditions.push(lte(column, ops.lte));
      if (ops.like !== undefined) conditions.push(like(column, ops.like));
      if (ops.ilike !== undefined) conditions.push(ilike(column, ops.ilike));
      if (ops.in !== undefined) conditions.push(inArray(column, ops.in as unknown[]));
      if (ops.notIn !== undefined) conditions.push(notInArray(column, ops.notIn as unknown[]));
      if (ops.isNull === true) conditions.push(isNull(column));
      if (ops.isNotNull === true) conditions.push(isNotNull(column));
    }

    if (conditions.length === 0) return undefined;
    return conditions.length === 1 ? conditions[0] : and(...conditions);
  }

  private resolveOrderBy(orderBy: OrderBy<T>) {
    return Object.entries(orderBy)
      .filter(([, dir]) => dir)
      .map(([key, dir]) => {
        const column = this.col(key);
        return dir === 'desc' ? desc(column) : asc(column);
      });
  }

  // Overloaded: `with`/`columns` → Drizzle relational inference (via `Rel`); otherwise plain row.
  findFirst = (async (options?: RelationalReadOptions<T>): Promise<Select<T> | WithResult<T> | undefined> => {
    if (options?.with || options?.columns) {
      // eslint-disable-next-line ts/no-explicit-any
      return (this.relational as any).findFirst(this.relRead(options));
    }

    const where = options?.where ? this.resolveFilter(options.where) : undefined;
    let query: AnyTable = this.db.select().from(this.t).where(where);
    if (options?.orderBy) {
      const order = this.resolveOrderBy(options.orderBy);
      if (order.length) query = query.orderBy(...order);
    }
    const [result] = await query.limit(1);
    return result as Select<T> | undefined;
  }) as unknown as CrudFindFirst<T> & RelFindFirst<Rel>;

  // Overloaded: `with`/`columns` → Drizzle relational inference (via `Rel`); otherwise plain rows.
  find = (async (options?: RelationalReadOptions<T>): Promise<Select<T>[] | WithResult<T>[]> => {
    if (options?.with || options?.columns) {
      // eslint-disable-next-line ts/no-explicit-any
      return (this.relational as any).findMany(this.relRead(options));
    }

    let query: AnyTable = this.db.select().from(this.t);

    if (options?.where) query = query.where(this.resolveFilter(options.where));
    if (options?.orderBy) {
      const order = this.resolveOrderBy(options.orderBy);
      if (order.length) query = query.orderBy(...order);
    }
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.offset(options.offset);

    return query as Select<T>[];
  }) as unknown as CrudFind<T> & RelFind<Rel>;

  async findPage(
    options: { where?: Filter<T>; orderBy?: OrderBy<T>; page: number; perPage: number; columns?: ColumnsOption; with: WithOption },
  ): Promise<{ results: WithResult<T>[]; count: number; pagesCount: number }>;
  async findPage(
    options: { where?: Filter<T>; orderBy?: OrderBy<T>; page: number; perPage: number },
  ): Promise<{ results: Select<T>[]; count: number; pagesCount: number }>;
  async findPage(
    options: RelationalReadOptions<T> & { page: number; perPage: number },
  ): Promise<{ results: Select<T>[] | WithResult<T>[]; count: number; pagesCount: number }> {
    const { page, perPage } = options;
    const offset = (page - 1) * perPage;

    const [results, total] = await Promise.all([
      options.with
        // eslint-disable-next-line ts/no-explicit-any
        ? (this.relational as any).findMany(this.relRead({ ...options, limit: perPage, offset })) as Promise<WithResult<T>[]>
        : this.find({ where: options.where, orderBy: options.orderBy, limit: perPage, offset }),
      this.count({ where: options.where }),
    ]);

    return { results, count: total, pagesCount: Math.ceil(total / perPage) };
  }

  async count(options?: { where?: Filter<T> }): Promise<number> {
    const where = options?.where ? this.resolveFilter(options.where) : undefined;
    const [result] = await this.db.select({ total: count() }).from(this.t).where(where);
    return Number(result.total);
  }

  async insertOne(data: Insert<T>): Promise<Select<T>> {
    const [result] = await this.db
      .insert(this.t)
      .values(data as AnyTable)
      .returning();
    this.onMutation?.({ type: 'insert', docs: [result as Select<T>] });
    return result as Select<T>;
  }

  async insertMany(data: Insert<T>[]): Promise<Select<T>[]> {
    const results = await this.db
      .insert(this.t)
      .values(data as Insert<T>[])
      .returning();
    this.onMutation?.({ type: 'insert', docs: results as Select<T>[] });
    return results as Select<T>[];
  }

  async updateOne(filter: Filter<T>, data: Partial<Insert<T>>): Promise<Select<T> | undefined> {
    let prevDoc: Select<T> | undefined;
    if (this.onMutation) {
      prevDoc = await this.findFirst({ where: filter });
    }
    const [result] = await this.db
      .update(this.t)
      .set(data as AnyTable)
      .where(this.resolveFilter(filter))
      .returning();
    if (result) {
      this.onMutation?.({ type: 'update', docs: [result as Select<T>], prevDocs: prevDoc ? [prevDoc] : undefined });
    }
    return result as Select<T> | undefined;
  }

  async updateMany(filter: Filter<T>, data: Partial<Insert<T>>): Promise<Select<T>[]> {
    let prevDocs: Select<T>[] | undefined;
    if (this.onMutation) {
      prevDocs = await this.find({ where: filter });
    }
    const results = await this.db
      .update(this.t)
      .set(data as AnyTable)
      .where(this.resolveFilter(filter))
      .returning();
    if (results.length) {
      this.onMutation?.({ type: 'update', docs: results as Select<T>[], prevDocs });
    }
    return results as Select<T>[];
  }

  async deleteOne(filter: Filter<T>): Promise<Select<T> | undefined> {
    const [result] = await this.db.delete(this.t).where(this.resolveFilter(filter)).returning();
    if (result) {
      this.onMutation?.({ type: 'delete', docs: [result as Select<T>] });
    }
    return result as Select<T> | undefined;
  }

  async deleteMany(filter: Filter<T>): Promise<Select<T>[]> {
    const results = await this.db.delete(this.t).where(this.resolveFilter(filter)).returning();
    if (results.length) {
      this.onMutation?.({ type: 'delete', docs: results as Select<T>[] });
    }
    return results as Select<T>[];
  }
}
