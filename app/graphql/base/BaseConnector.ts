import * as DataLoader from 'dataloader';
import * as Promise from 'bluebird';
import { Context } from 'egg';

// Connector 每次请求 都会重构, 那么 DataLoader 的意义是什么

export default class BaseConnector {
  ctx: Context;
  loader: any;
  proxy: any;
  constructor(ctx: Context) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
    // this.proxy = this.ctx.model.xxx;
  }
  async create(payload) {
    const instance = await this.proxy.create(payload);
    return instance.toJSON();
  }
  async findOne(where) {
    const instance = await this.proxy.findOne({ where });
    if (!instance) {
      throw new Error('not found');
    }
    return instance.toJSON();
  }

  async remove(id) {
    const item = await this.proxy.findOne({ where: { id } });
    if (!item) {
      throw new Error('instance is empty');
    }
    const ret = item.toJSON();
    await item.destroy();
    return ret;
  }

  fetch(ids) {
    return Promise.map(ids, id => this.proxy.findById(id));
  }

  fetchByIds(ids) {
    return this.loader.loadMany(ids);
  }

  fetchById(id) {
    return this.loader.load(id);
  }

  async fetchAll(offset, limit) {
    const result = await this.proxy.findAll({ offset, limit });
    const ids = result.map(item => item.id);
    return this.loader.loadMany(ids);
  }

}
