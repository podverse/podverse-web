const Router = require('koa-router')

export default (app) => {
  const router = new Router()

  router.get('/offer-code/:id', async ctx => {
    const query = { ...ctx.params }
    await app.render(ctx.req, ctx.res, '/offer-code', query)
  })

  return router
}
