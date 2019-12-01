const Router = require('koa-router')

export default (app) => {
  const router = new Router({ prefix: '/payment' })

  router.get('/bitpay-confirming', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/payment-bitpay-confirming', query)
  })

  router.get('/paypal-confirming', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/payment-paypal-confirming', query)
  })

  return router
}
