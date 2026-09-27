import type { Request } from 'express';

export type TypedRequest<
  Body = unknown,
  Params = Record<string, string>,
  Query = Record<string, string>,
> = Request<Params, unknown, Body, Query>;
