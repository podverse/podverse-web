import * as Router from 'koa-router'

export default (app) => {
  const router = new Router()

  router.get('/forgot-password', async ctx => {
    await app.render(ctx.req, ctx.res, '/auth/forgotPassword', ctx.query)
  })

  router.get('/login', async ctx => {
    await app.render(ctx.req, ctx.res, '/auth/login', ctx.query)
  })

  router.get('/reset-password', async ctx => {
    await app.render(ctx.req, ctx.res, '/auth/resetPassword', ctx.query)
  })

  router.get('/signup', async ctx => {
    await app.render(ctx.req, ctx.res, '/auth/signup', ctx.query)
  })

  return router
}


