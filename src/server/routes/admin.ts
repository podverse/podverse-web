const Router = require('koa-router')

export default (app) => {
  const router = new Router({ prefix: '/admin' })
  
  router.get('/', async ctx => {    
    await app.render(ctx.req, ctx.res, '/admin', ctx.query)
  })

  return router
}
