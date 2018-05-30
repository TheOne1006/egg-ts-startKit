// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import Admin from '../../../app/model/admin';

declare module 'sequelize' {
  interface Sequelize {
    Admin: ReturnType<typeof Admin>;
  }
}
