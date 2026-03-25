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
import type { PgTable } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import config from '@/config';
import * as schema from '@/schema';

const client = postgres(config.DATABASE_URL);

export const rawDb = drizzle(client, { schema });

type Select<T extends PgTable> = T['$inferSelect'];
type Insert<T extends PgTable> = T['$inferInsert'];

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

type Filter<T extends PgTable> =
  | ({
      [K in keyof Select<T>]?: Select<T>[K] | ColumnOps<NonNullable<Select<T>[K]>>;
    } & {
      OR?: Filter<T>[];
      AND?: Filter<T>[];
    })
  | SQL;

type OrderBy<T extends PgTable> = Partial<Record<keyof Select<T>, 'asc' | 'desc'>>;

// eslint-disable-next-line ts/no-explicit-any
type AnyTable = any;

class Collection<T extends PgTable> {
  readonly table: T;

  constructor(table: T) {
    this.table = table;
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

  async findFirst(options?: { where?: Filter<T> }): Promise<Select<T> | undefined> {
    const where = options?.where ? this.resolveFilter(options.where) : undefined;
    const [result] = await rawDb.select().from(this.t).where(where).limit(1);
    return result as Select<T> | undefined;
  }

  async find(options?: {
    where?: Filter<T>;
    orderBy?: OrderBy<T>;
    limit?: number;
    offset?: number;
  }): Promise<Select<T>[]> {
    let query: AnyTable = rawDb.select().from(this.t);

    if (options?.where) query = query.where(this.resolveFilter(options.where));
    if (options?.orderBy) {
      const order = this.resolveOrderBy(options.orderBy);
      if (order.length) query = query.orderBy(...order);
    }
    if (options?.limit) query = query.limit(options.limit);
    if (options?.offset) query = query.offset(options.offset);

    return query as Select<T>[];
  }

  async findPage(options: {
    where?: Filter<T>;
    orderBy?: OrderBy<T>;
    page: number;
    perPage: number;
  }): Promise<{ results: Select<T>[]; count: number; pagesCount: number }> {
    const { page, perPage } = options;
    const offset = (page - 1) * perPage;

    const [results, total] = await Promise.all([
      this.find({ where: options.where, orderBy: options.orderBy, limit: perPage, offset }),
      this.count({ where: options.where }),
    ]);

    return { results, count: total, pagesCount: Math.ceil(total / perPage) };
  }

  async count(options?: { where?: Filter<T> }): Promise<number> {
    const where = options?.where ? this.resolveFilter(options.where) : undefined;
    const [result] = await rawDb.select({ total: count() }).from(this.t).where(where);
    return Number(result.total);
  }

  async insertOne(data: Insert<T>): Promise<Select<T>> {
    const [result] = await rawDb
      .insert(this.t)
      .values(data as Insert<T>)
      .returning();
    return result as Select<T>;
  }

  async insertMany(data: Insert<T>[]): Promise<Select<T>[]> {
    const results = await rawDb
      .insert(this.t)
      .values(data as Insert<T>[])
      .returning();
    return results as Select<T>[];
  }

  async updateOne(filter: Filter<T>, data: Partial<Insert<T>>): Promise<Select<T> | undefined> {
    const [result] = await rawDb
      .update(this.t)
      .set(data as Partial<Insert<T>>)
      .where(this.resolveFilter(filter))
      .returning();
    return result as Select<T> | undefined;
  }

  async updateMany(filter: Filter<T>, data: Partial<Insert<T>>): Promise<Select<T>[]> {
    const results = await rawDb
      .update(this.t)
      .set(data as Partial<Insert<T>>)
      .where(this.resolveFilter(filter))
      .returning();
    return results as Select<T>[];
  }

  async deleteOne(filter: Filter<T>): Promise<Select<T> | undefined> {
    const [result] = await rawDb.delete(this.t).where(this.resolveFilter(filter)).returning();
    return result as Select<T> | undefined;
  }

  async deleteMany(filter: Filter<T>): Promise<Select<T>[]> {
    const results = await rawDb.delete(this.t).where(this.resolveFilter(filter)).returning();
    return results as Select<T>[];
  }
}

const db = {
  users: new Collection(schema.users),
  tokens: new Collection(schema.tokens),
};

export default db;
