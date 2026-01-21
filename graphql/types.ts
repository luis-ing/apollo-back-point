import type { Context } from './context.js'

export type ResolverFn<Args = any, Result = any> = (
  parent: unknown,
  args: Args,
  context: Context
) => Promise<Result> | Result
