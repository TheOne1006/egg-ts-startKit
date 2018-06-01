import { omit } from 'lodash';
/**
 * 创建 Model 的 remote
 * @param typeName model的名称
 * @param extendRemotes 自定义Model 扩展的remote
 */
export function createModelRemote(typeName: string = '', extendRemotes: object = {}, disabledRemotes: string[] = []) {
  const defaultRemotes = {
    queryAll: {
      summary: '从数据源中找到与筛选器匹配的所有实例.',
      isStatic: true,
      accepts: [
        {
          arg: 'filter',
          type: 'object',
          description: '过滤定义 fields, where, order, offset, 以及 limit',
        },
      ],
      returns: { arg: 'data', type: 'array', model: typeName, root: true },
      http: { verb: 'get', path: '/' },
      security: [{ api_key: [] }],
    },
    createInstance: {
      summary: '创建模型的一个新实例并将其持久化到数据库中.',
      isStatic: true,
      accessType: 'WRITE',
      accepts: {
        arg: 'data', type: 'object', model: typeName,
        description: 'Model 实例数据', required: true, root: true,
        http: { source: 'body' },
      },
      returns: { arg: 'data', model: typeName, root: true },
      http: { verb: 'post', path: '/' },
      security: [{ api_key: [] }],
    },
    countAll: {
      summary: '统计 Model 实例数量可以使用, 可以使用 where 参数.',
      isStatic: true,
      accepts: {
        arg: 'where',
        type: 'object',
        description: 'where 条件',
      },
      returns: { arg: 'count', type: 'number' },
      http: { verb: 'get', path: '/count' },
      security: [{ api_key: [] }],
    },
    exists: {
      summary: '通过 {{id}} 获取 Model 实例 是否存在.',
      isStatic: true,
      accepts: {
        arg: 'id', type: 'integer', description: 'Model id', required: true,
        http: { source: 'path' }
      },
      http: { verb: 'get', path: '/exists/:id' },
      returns: { arg: 'exists', type: 'object', root: true },
      security: [{ api_key: [] }],
    },
    updateAll: {
      summary: '批量更新Model 所有实例',
      isStatic: true,
      accepts: [{
        arg: 'data',
        type: 'object',
        description: 'Model 需要更新的数据',
        root: true,
        required: true,
        http: { source: 'body' },
      }, {
        arg: 'where',
        type: 'object',
        description: 'where 条件',
        http: { source: 'query' },
      }],
      http: { verb: 'put', path: '/' },
      returns: { arg: 'affectedRows', type: 'object' },
      security: [{ api_key: [] }],
    },
    show: {
      summary: '从数据源中通过 {{id}} 查找 Model 的实例 .',
      isStatic: false,
      accepts: [
        {
          arg: 'id', type: 'integer', description: 'Model id', required: true,
          http: { source: 'path' }
        },
        {
          arg: 'filter', type: 'object',
          description: '定义 fields(字段) 和 include'
        },
      ],
      returns: { arg: 'data', model: typeName, root: true },
      http: { verb: 'get', path: '/:id' },
      security: [{ api_key: [] }],
    },
    updateById: {
      summary: '更新模型实例的属性并将其持久化到数据源中.',
      isStatic: false,
      accessType: 'WRITE',
      accepts: [
        {
          arg: 'data', type: 'object', model: typeName, required: true, root: true,
          http: { source: 'body' },
          description: '模型属性名称/值对的对象',
        },
        {
          arg: 'id', type: 'integer', description: 'Model id', required: true,
          http: { source: 'path' },
        },
      ],
      returns: { arg: 'data', model: typeName, root: true },
      http: { verb: 'put', path: '/:id' },
      security: [{ api_key: [] }],
    },
    destroyById: {
      aliases: ['destroyById', 'removeById'],
      isStatic: true,
      summary: '通过 {{id}} 获取 Model 实例 并将其从数据源中删除.',
      accepts: {
        arg: 'id', type: 'integer', description: 'Model id', required: true,
        http: { source: 'path' }
      },
      http: { verb: 'del', path: '/:id' },
      returns: { arg: 'count', type: 'object', root: true },
      security: [{ api_key: [] }],
    },
  };

  const allRemotes = {
    ...defaultRemotes,
    ...extendRemotes,
  };

  return omit(allRemotes, disabledRemotes);
}
