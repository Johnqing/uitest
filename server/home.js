const Router = require('koa-router')

let page = new Router()
page.get('/', async ( ctx )=>{
    await ctx.render('index', {
        title: 'UITEST平台',
    })
})
module.exports = page;

