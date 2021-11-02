const Router = require('koa-router')

export default (app) => {
  const router = new Router()

  router.get('/about', async ctx => {
    await app.render(ctx.req, ctx.res, '/about', ctx.query)
  })

  router.get('/contact', async ctx => {
    await app.render(ctx.req, ctx.res, '/contact', ctx.query)
  })

  router.get('/faq', async ctx => {
    await app.render(ctx.req, ctx.res, '/faq', ctx.query)
  })

  router.get('/membership', async ctx => {
    await app.render(ctx.req, ctx.res, '/membership', ctx.query)
  })

  router.get('/signup', async ctx => {
    await app.render(ctx.req, ctx.res, '/signup', ctx.query)
  })

  router.get('/terms', async ctx => {
    await app.render(ctx.req, ctx.res, '/terms', ctx.query)
  })

  return router
}
