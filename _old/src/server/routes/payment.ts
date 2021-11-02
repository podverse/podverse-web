const Router = require('koa-router')

export default (app) => {
  const router = new Router({ prefix: '/payment' })

  router.get('/bitpay-confirming', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    try {
      await app.render(ctx.req, ctx.res, '/payment-bitpay-confirming', query)
    } catch (error) {
      console.log(error)
    }
  })

  router.get('/paypal-confirming', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    try {
      await app.render(ctx.req, ctx.res, '/payment-paypal-confirming', query)
    } catch (error) {
      console.log(error)
    }
  })

  router.get('/about', async ctx => {
    await app.render(ctx.req, ctx.res, '/about', ctx.query)
  })

  return router
}
