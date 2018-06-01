import { Application } from 'egg';
import { extend, snakeCase } from 'lodash';
import * as moment from 'moment';
import { DefineAttributes, SequelizeStatic } from 'sequelize';
import { createModelRemote } from './createModelRemote';
/**
 * 模型基类，可以在这里定义全局使用的作用域、hook、必要的字段定义
 *
 * @param {object} app 传入的 egg 的 Application 对象
 * @param {string} table 表名
 * @param {object | string} attributes 定义表的字段数据
 * @param {object} options 模型的相关配置
 */
export default function BaseModel(
  app: Application,
  table: string,
  attributes: DefineAttributes,
  options: object = {},
  modelConfig: {
    settings: {
      protectedProperties: string[] | undefined,
      protected: string[] | undefined,
      hiddenProperties: string[] | undefined,
      hidden: string[] | undefined,
    },
    remotes: object,
    disabledRemotes: string[] | undefined,
  },
) {
  const { Op, INTEGER } = app.Sequelize;

  // 设置默认数据
  const modelSchema = app.model.define(table, {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    ...attributes,
    ...getDefaultAttributes(options, app.Sequelize),
  }, {
      // 自动维护时间戳 [ created_at、updated_at ]
      timestamps: true,
      // 使用驼峰样式自动添加属性
      underscored: false,
      // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
      // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
      freezeTableName: false,
      ...options,
      scopes: {
        // 定义全局作用域，使用方法如: .scope('onlyTrashed') or .scope('onlyTrashed1', 'onlyTrashed12') [ 多个作用域 ]
        onlyTrashed: {
          // 只查询软删除数据
          where: {
            deleted_at: {
              [Op.not]: null,
            },
          },
        },
      },
    });

  /**
   * 公共对外 暴露代码
   * 对 model 进行绑定 egg-connector-remote 需的信息
   */
  const typeName = modelSchema.name;
  const remotes = createModelRemote(typeName, modelConfig.remotes, modelConfig.disabledRemotes);

  modelSchema.settings = modelConfig.settings;
  modelSchema.remotes = remotes;

  modelSchema.exists = async function exists (_: any, id: any) {
    // const Model = this;
    const instance = await modelSchema.findById(id);
    return { exists: !!instance };
  };

  modelSchema.queryAll = async function queryAll(_: any, filter: object | undefined) {
    const filterExt = extend({},
      filter,
    );
    const results = await modelSchema.findAll(filterExt);

    return results;
  };

  modelSchema.countAll = async function countAll(_: any, where: object | undefined) {
    const count = await modelSchema.count({ where });
    return { count };
  }


  /**
   * 公共自定义 实例方法
   */
  modelSchema.prototype.show = function show() {
    const instance = this;
    return instance;
  };

  /**
   * 公共私有方法
   */

  modelSchema.errorModelNotFound = function errorModelNotFound(msg = 'Not found Model') {
    const error: any = new Error(msg);
    error.statusCode = 404;
    error.code = 'MODEL_NOT_FOUND';
    return error;
  };

  modelSchema.isProtectedProperty = function isProtectedProperty (propertyName: string) {
    const settings = modelConfig.settings;
    const protectedProperties = settings && (settings.protectedProperties || settings.protected);

    return protectedProperties && protectedProperties.length > 1 && protectedProperties.indexOf(propertyName) > -1;
  };

  modelSchema.isHiddenProperty = function isHiddenProperty(propertyName) {
    const settings = modelConfig.settings;
    const hiddenProperties = settings && (settings.hiddenProperties || settings.hidden);

    return hiddenProperties && hiddenProperties.length > 0 && hiddenProperties.indexOf(propertyName) > -1;
  };

  modelSchema.prototype.toJSON = function toJSON() {
    return this.toObject(false, true, false);
  };

  modelSchema.prototype.toObject = function toObject(onlySchema: boolean = true,
    removeHidden: boolean = true,
    removeProtected: boolean  = true) {

    const data = {};
    const self = this;
    const modelClass = this.constructor;

    // if it is already an Object
    if (modelClass === Object) {
      return self;
    }

    let props = [];
    let keys: any = [];

    if (onlySchema) {
      props = modelClass.attributes;
      keys = Object.keys(props);
    } else {
      const dataValues = self.dataValues;
      keys = Object.keys(dataValues);
    }

    for (let i = 0; i < keys.length; i++) {
      const propertyName = keys[i];
      let val = self[propertyName];

      // Exclude functions
      if (typeof val === 'function') {
        continue;
      }
      // Exclude hidden properties
      if (removeHidden && modelClass.isHiddenProperty(propertyName)) {
        continue;
      }

      if (removeProtected && modelClass.isProtectedProperty(propertyName)) {
        continue;
      }

      if (val instanceof app.Sequelize.Model) {
        val = val.toObject(onlySchema, removeHidden, removeProtected);
      }

      // XXX: List
      // coding

      if (val === undefined) {
        val = null;
      }

      data[propertyName] = val;
    }

    return data;
  };


  /**
   * @returns {string[]} 获取定义的所有字段属性
   */
  modelSchema.getAttributes = (): string[] => {
    return Object.keys(attributes);
  };

  /**
   * @returns {string} 获取定义的指定字段属性的值
   */
  modelSchema.findAttribute = (attribute: string): object | undefined => {
    return (attributes as any)[attribute];
  };

  /**
   * @returns {array} 可批量赋值的数组,当为空时，会自动遍历 model 定义的字段属性来进行过滤
   */
  modelSchema.fillable = (): string[] => {
    return [];
  };

  /**
   * @returns {array} 输出数据时，隐藏字段数组 [ 黑名单 ]
   */
  modelSchema.hidden = (): string[] => {
    return [];
  };

  /**
   * @returns {array} 输出数据时显示的属性 [ 白名单 ]
   */
  modelSchema.visible = (): string[] => {
    return [];
  };

  return modelSchema;
}


/**
 * 获取经过过滤的预设共用的字段属性
 *
 * @param options sequelize 的 define 的 options 参数
 * @param sequelize sequelize 的 SequelizeStatic 对象
 * @returns {object}
 */
function getDefaultAttributes(options: object, sequelize: SequelizeStatic): object {
  const { DATE } = sequelize;

  // 预设共用的默认字段属性
  const defaultAttributes = {
    createdAt: {
      type: DATE,
      get() {
        return moment((this as any).getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updatedAt: {
      type: DATE,
      get() {
        return moment((this as any).getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  };

  // 需要从 options 读取的配置信息，用于下方做过滤的条件
  const attributes = ['createdAt', 'updatedAt', 'deletedAt'];

  // 遍历传入的属性是否符合过滤条件
  Object.keys(options).forEach((value: string) => {
    // 判断是否存在过滤条件、设置的属性是否为关闭 [false]
    // 比如关闭了 updatedAt 的自动维护更新，那么就应该把预设 updated_at 给过滤掉，不然在查询的时候，依然会带上该条件
    if (attributes.includes(value) && (options as any)[value] === false) {
      // 删除该预设字段
      delete (defaultAttributes as any)[snakeCase(value)];
    }
  });

  return defaultAttributes || {};
}
