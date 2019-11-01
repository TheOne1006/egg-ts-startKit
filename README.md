# egg ts 版本初始


## QuickStart

### Development

> 启动项目
```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

Don't tsc compile at development mode, if you had run `tsc` then you need to `npm run clean` before `npm run dev`.

> 创建model
```bash
# 创建构造文件
npm run migrate:new -- --name user # 创建文件 databases/migrations/xxx-user.js
```

### Deploy

```bash
// 转义 *.ts 文件
$ npm run tsc
$ npm start
```

### Npm Scripts

- Use `npm run lint` 检测语法
- Use `npm test` 执行单元测试
- Use `npm run clean` 开发模式下，清除转义文件
- Use `npm run autod` 更新依赖包
- Use `npm run migrate:*` 具体参考 sequelize-cli 文档

### Requirement

- Node.js 10.x
- Typescript 2.8+


### 内置项目

> 按需加载，不用请移除

- egg-sequelize 数据库 orm
  - 包含库 [ `sequelize-cli`, `egg-sequelize`, `mysql2` ]
  - 目录文件 [`databases/`, `.sequelizerc`]
