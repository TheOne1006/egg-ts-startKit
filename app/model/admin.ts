// import * as debug from 'debug';
import { Application, Context } from 'egg';
import BaseModel from '../common/BaseModel';

const adminConfig = require('./admin.json');

// const logger = debug('app:model:admin');

export default function Admin(app: Application) {
    const { STRING } = app.Sequelize;

    // 创建模型
    const modelSchema = BaseModel(app, 'admin', {
        username: { type: STRING(32), unique: true, allowNull: false, comment: '用户名' },
        email: { type: STRING(64), unique: true, allowNull: true, comment: '邮箱地址' },
        password: {
          type: STRING(255),
          allowNull: false,
          comment: '密码',
          set(val) {
            return app.createBcrypt(val);
          },
        },
    }, {
        // 开启软删除
        paranoid: false,
      },
      adminConfig,
    );

  modelSchema.BelongOwnerById = async function BelongOwnerById(userId, id) {
      return parseInt(userId, 10) === parseInt(id, 10);
    }

    /**
     * Normalize the credentials
     * @param {Object} credentials The credential object
     * @return {Object} The normalized credential object
     */
    modelSchema.normalizeCredentials = async function normalizeCredentials(credentials: any) {

      const query: any = {};

      credentials = credentials || {};

      if (credentials.email) {
        query.email = credentials.email;
      } else if (credentials.username) {
        query.username = credentials.username;
      }

      return query;
    };

    interface Icredentials {
      password: string;
      username: string | undefined;
      email: string | undefined;
      ttl: number;
    }

    modelSchema.login = async function login(ctx, credentials: Icredentials) {
      const defaultError: any = new Error('login failed');
      defaultError.statusCode = 401;
      defaultError.code = 'LOGIN_FAILED';

      const query = await modelSchema.normalizeCredentials(credentials);
      const admin = await modelSchema.findOne({ where: query });

      if (!admin) {
        app.logger.info(`${query.username || query.email} unfound`);
        throw defaultError;
      }

      const isMatch = await app.verifyBcrypt(credentials.password, admin.password);

      if (!isMatch) {
        app.logger.info(`${query.username || query.email} password not match`);
        throw defaultError;
      }

      // let roleInstance = {};

      // try {
      //   const roleMappingInstance = await app.model.RoleMapping.findOne({
      //     where: {
      //       principalType: 'USER',
      //       principalId: admin.id,
      //     },
      //   });
      //   roleInstance = await app.model.Role.findById(roleMappingInstance.roleId);
      // } catch (e) {
      //   logger('user id: %s, not found role', admin.id);
      // }

      // token
      const tokenInstance = await admin.createAccessToken(ctx, credentials.ttl);

      const adminJSON = admin.toJSON();
      // adminJSON.role = roleInstance;
      adminJSON.token = tokenInstance;


      return adminJSON;
    };

    /**
     * 创建token
     */
    modelSchema.prototype.createAccessToken = async function createAccessToken(
      ctx: Context,
      customTTL: number | undefined = 0) {

        const instance = this;
        // const adminModel = modelSchema;
        const accessTokenModel = ctx.model.AccessToken;
        const ttl = Math.min(customTTL || adminConfig.settings.ttl, adminConfig.settings.maxTTL);
        const token = await accessTokenModel.createAccessTokenId();
        const accessToken = await accessTokenModel.create({
          ttl,
          token,
          adminId: instance.id,
          scope: accessTokenModel.ScopeAdmin,
        });
        return accessToken;
      };

  //   static async logout(ctx) {
  //   const sessionAdmin = ctx.session && ctx.session.admin;
  //   if (sessionAdmin) {
  //     ctx.session = null;
  //   }
  //   return {
  //     logout: true,
  //   };
  // }

    return modelSchema;
}
