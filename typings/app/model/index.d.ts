// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import AccessToken from '../../../app/model/access-token';
import Admin from '../../../app/model/admin';
import RoleMapping from '../../../app/model/role-mapping';
import Role from '../../../app/model/role';

declare module 'sequelize' {
  interface Sequelize {
    AccessToken: ReturnType<typeof AccessToken>;
    Admin: ReturnType<typeof Admin>;
    RoleMapping: ReturnType<typeof RoleMapping>;
    Role: ReturnType<typeof Role>;
  }
}
