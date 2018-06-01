// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import AccessToken from '../../../app/model/access-token';
import Admin from '../../../app/model/admin';

declare module 'sequelize' {
  interface Sequelize {
    AccessToken: ReturnType<typeof AccessToken>;
    Admin: ReturnType<typeof Admin>;
  }
}
