// import * as debug from 'debug';
import { Application, Context } from 'egg';
import BaseModel from '../common/BaseModel';

const userConfig = require('./user.json');

// const logger = debug('app:model:user');

export default function User(app: Application) {
  const { STRING, DATE } = app.Sequelize;

  // 创建模型
  const modelSchema = BaseModel(app, 'user', {
    phone: { type: STRING(32), allowNull: false, comment: '手机号码' },
    username: { type: STRING(32), unique: true, allowNull: true, comment: '用户名' },
    email: { type: STRING(64), unique: true, allowNull: true, comment: '邮箱地址' },
    lastSignInAt: DATE,
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
    userConfig,
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
    } else if (credentials.phone) {
      query.phone = credentials.phone;
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
    const user = await modelSchema.findOne({ where: query });

    if (!user) {
      app.logger.info(`${query.username || query.email} unfound`);
      throw defaultError;
    }

    const isMatch = await app.verifyBcrypt(credentials.password, user.password);

    if (!isMatch) {
      app.logger.info(`${query.username || query.email} password not match`);
      throw defaultError;
    }


    // token
    const tokenInstance = await user.createAccessToken(ctx, credentials.ttl);

    const userJSON = user.toJSON();
    userJSON.token = tokenInstance;


    return userJSON;
  };

  /**
   * 创建token
   */
  modelSchema.prototype.createAccessToken = async function createAccessToken(
    ctx: Context,
    customTTL: number | undefined = 0) {

    const instance = this;
    // const userModel = modelSchema;
    const accessTokenModel = ctx.model.AccessToken;
    const ttl = Math.min(customTTL || userConfig.settings.ttl, userConfig.settings.maxTTL);
    const token = await accessTokenModel.createAccessTokenId();
    const accessToken = await accessTokenModel.create({
      ttl,
      token,
      userId: instance.id,
      scope: accessTokenModel.ScopeUser,
    });
    return accessToken;
  };

  modelSchema.onlyUserAccess = async function onlyUserAccess() {
    return { 'onlyUser' : true };
  };

  //   static async logout(ctx) {
  //   const sessionUser = ctx.session && ctx.session.user;
  //   if (sessionUser) {
  //     ctx.session = null;
  //   }
  //   return {
  //     logout: true,
  //   };
  // }

  return modelSchema;
}
