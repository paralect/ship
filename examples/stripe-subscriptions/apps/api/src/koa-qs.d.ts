import AppKoa from 'types';

declare namespace koaQs {
  type ParseMode = 'extended' | 'strict' | 'first';
}

declare function koaQs(app: AppKoa, mode?: koaQs.ParseMode): AppKoa;

export = koaQs;
