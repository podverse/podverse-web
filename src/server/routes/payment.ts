import * as Router from 'koa-router'

export default (app) => {
  const router = new Router()

  router.get('/payment/bitpay-confirming', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/payment-bitpay-confirming', query)
  })

  router.get('/payment/paypal-confirming', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/payment-paypal-confirming', query)
  })

  return router
}
