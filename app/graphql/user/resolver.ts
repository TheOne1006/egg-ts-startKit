
'use strict';
import resolverFactory from '../base/resolverFactory';

const userResolver = resolverFactory('user');
export default userResolver;

declare var module: any;
// hack 支持 es5
module.exports = userResolver;
