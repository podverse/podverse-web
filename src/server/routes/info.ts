import * as Router from 'koa-router'

export default (app) => {
  const router = new Router()

  router.get('/about', async ctx => {
    await app.render(ctx.req, ctx.res, '/about', ctx.query)
  })

  router.get('/contact', async ctx => {
    await app.render(ctx.req, ctx.res, '/contact', ctx.query)
  })

  // router.get('/faq', async ctx => {
  //   await app.render(ctx.req, ctx.res, '/faq', ctx.query)
  // })

  router.get('/signup', async ctx => {
    await app.render(ctx.req, ctx.res, '/signup', ctx.query)
  })

  return router
}
