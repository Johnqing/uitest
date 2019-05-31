const Koa = require('koa')
const app = new Koa()
const views = require('koa-views');
const Router = require('koa-router')
const static = require('koa-static')
const koaBody = require('koa-body');


const home = require('./home');
const page = require('./page');

const path = require('path');

process.on('unhandledRejection', (reason, p) => {
  console.log('未处理的 rejection：', p, '原因：', reason);
});

app.use(koaBody({
  multipart: true,
  formidable: {
      maxFileSize: 50 * 100 * 1024 * 1024	// 设置上传文件大小最大限制，默认2M
  }
}));

app.use(views(path.join(__dirname, '../client/dist'), {
    extension: 'ejs'
}))

const staticPath = '../client/dist'

app.use(static(
  path.join( __dirname,  staticPath)
))

// 装载所有子路由
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/api', page.routes(), page.allowedMethods())

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())


app.listen(3000)
console.log('starting at port 3000')