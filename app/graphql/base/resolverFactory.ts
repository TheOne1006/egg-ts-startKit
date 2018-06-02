
'use strict';

const MAX_LIMIT = 100;
const MIN_LIMIT = 1;
const DEFAULT_LIMIT = 100;

export default function resolverFactory(conName: string, comResolver = { Query: {} }) {
  const defaultRes = {
    Query: {
      [conName](_, { id }, ctx) {
        return ctx.connector[conName].fetchById(id);
      },
      [`${conName}s`](_, params, ctx) {
        const { limit = DEFAULT_LIMIT, offset } = params;
        const safeLimit = Math.max(MIN_LIMIT, Math.min(limit, MAX_LIMIT));
        const safeOffset = offset || 0;
        return ctx.connector[conName].fetchAll({}, safeOffset, safeLimit);
      },
    },
  };

  return {
    ...comResolver,
    Query: {
      ...defaultRes.Query,
      ...comResolver.Query,
    }
  }
}
