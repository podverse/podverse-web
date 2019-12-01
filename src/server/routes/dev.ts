const Router = require('koa-router')

export default (app) => {
  const router = new Router({ prefix: '/dev' })

  router.get('/', async ctx => {
    await app.render(ctx.req, ctx.res, '/dev', ctx.query)
  })

  return router
}
