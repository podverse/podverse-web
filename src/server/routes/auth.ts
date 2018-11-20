import * as Router from 'koa-router'

export default (app) => {
  const router = new Router()

  router.get('/reset-password', async ctx => {
    await app.render(ctx.req, ctx.res, '/auth/resetPassword', ctx.query)
  })
  
  return router
}


