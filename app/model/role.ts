import * as debug from 'debug';
import { Application } from 'egg';

import BaseModel from '../common/BaseModel';

const roleConfig = require('./role.json');

const logger = debug('app:model:role');

export default function Role(app: Application) {
  const { STRING } = app.Sequelize;

  // 创建模型
  const modelSchema = BaseModel(app, 'role', {
    name: { type: STRING, allowNull: false }, // 角色名称
    description: { type: STRING, allowNull: true }, // 角色描述
  }, {
      // 关闭软删除
      paranoid: false,
    },
    roleConfig,
  );

  modelSchema.registerResolver = function registerResolver(role, resolver) {
    if (!modelSchema.resolvers) {
      modelSchema.resolvers = {};
    }
    modelSchema.resolvers[role] = resolver;
  }

  // Special roles
  modelSchema.OWNER = '$owner'; // owner of the object
  modelSchema.RELATED = '$related'; // any User with a relationship to the object
  modelSchema.AUTHENTICATED = '$authenticated'; // authenticated user
  modelSchema.UNAUTHENTICATED = '$unauthenticated'; // authenticated user
  modelSchema.EVERYONE = '$everyone'; // everyone


  modelSchema.registerResolver(modelSchema.OWNER, async (_: any, userId, modelName, modelId) => {
    logger('in registerResolver');
    if (!modelName || !modelId || !userId) {
      return false;
    }
    const Model = app.model.models[modelName];

    if (Model.BelongOwnerById && typeof Model.BelongOwnerById === 'function') {
      logger('userId %s, model %s', userId, modelId);

      const isMatch = await Model.BelongOwnerById(userId, modelId);
      logger('isMatch %s', isMatch);

      return isMatch;
    }
    return false;
  });

  modelSchema.registerResolver(modelSchema.AUTHENTICATED, async (_: any, userId) => {
    return !!userId;
  });

  modelSchema.registerResolver(modelSchema.UNAUTHENTICATED, async (_: any, userId) => {
    return !userId;
  });

  modelSchema.registerResolver(modelSchema.EVERYONE, async () => {
    return true;
  });


  /**
   * 判断是否存在该角色中
   */
  modelSchema.isInRole = async function isInRole(ctx, acl, rule, _: any, model, modelId) {
    const AccessToken = app.model.AccessToken;
    const token = AccessToken.tokenIdForRequest(ctx);

    let matchUserIdOrAdminId = 0;
    // let roleScope = AccessToken.ScopeUser;

    if (token) {
      const tokenInstance = await AccessToken.findOne({
        where: { token },
      });
      if (tokenInstance && tokenInstance.userId && tokenInstance.scope === AccessToken.ScopeUser) {
        matchUserIdOrAdminId = tokenInstance.userId;
      }

      if (tokenInstance && tokenInstance.adminId && tokenInstance.scope === AccessToken.ScopeAdmin) {
        matchUserIdOrAdminId = tokenInstance.adminId;
        // roleScope = AccessToken.ScopeAdmin;
      }
    }

    const inSystem = [modelSchema.OWNER, modelSchema.AUTHENTICATED, modelSchema.UNAUTHENTICATED, modelSchema.EVERYONE].some(item => item === rule.principalId);

    logger('inSystem %s', inSystem);
    logger('current acl %o', acl);
    logger('current rule %o', rule);

    if (inSystem) {
      const resolver = modelSchema.resolvers[rule.principalId];
      const result = await resolver(ctx, matchUserIdOrAdminId, model, modelId);
      logger('inSystem %s ,matchUserIdOrAdminId %s, result %s', rule.principalId, matchUserIdOrAdminId, result);
      return result && acl;
    }
    // 自定义 role
    let isMatch = false;

    try {
      const roleInstance = await modelSchema.findOne({ where: {
        name: rule.principalId,
      } });
      const roleMapping = await app.model.RoleMapping.findOne({ where: {
        roleId: roleInstance.id,
        principalId: matchUserIdOrAdminId,
      } });
      isMatch = roleInstance && roleMapping;
    } catch (e) {
      isMatch = false;
    }

    logger('custom role isMatch: %s', isMatch);

    return isMatch && acl;
  }

  return modelSchema;
}
