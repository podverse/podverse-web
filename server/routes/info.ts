import * as Router from 'koa-router'

export default (app) => {
  const router = new Router()

  router.get('/about', async ctx => {
    await app.render(ctx.req, ctx.res, '/info/about', ctx.query)
  })

  router.get('/contact', async ctx => {
    await app.render(ctx.req, ctx.res, '/info/contact', ctx.query)
  })

  router.get('/faq', async ctx => {
    await app.render(ctx.req, ctx.res, '/info/faq', ctx.query)
  })

  router.get('/signup', async ctx => {
    await app.render(ctx.req, ctx.res, '/signup', ctx.query)
  })

  return router
}
