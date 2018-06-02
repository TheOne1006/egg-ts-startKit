'use strict';

import * as Promise from 'bluebird';
import { Context } from 'egg';
import * as DataLoader from 'dataloader';

export default class UserConnector {
  ctx: Context;
  loader: any;
  proxy: any;
  constructor(ctx) {
    this.ctx = ctx;
    this.loader = new DataLoader(this.fetch.bind(this));
    this.proxy = ctx.model.User;
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

  async fetchAll(_, offset, limit) {
    const result = await this.proxy.findAll({ offset, limit });
    const ids = result.map(item => item.id);
    return this.loader.loadMany(ids);
  }
}


// hack 支持 es5
declare var module: any;
module.exports = UserConnector;
