import * as Router from 'koa-router'

export default (app) => {
  const router = new Router()

  router.get('/clip/:id', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/clip', query)
  })

  router.get('/episode/:id', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/episode', query)
  })

  router.get('/playlist/:id', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/playlist', query)
  })

  router.get('/playlists', async ctx => {
    await app.render(ctx.req, ctx.res, '/playlists', ctx.query)
  })

  router.get('/podcast/:id', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/podcast', query)
  })

  router.get('/podcasts', async ctx => {
    await app.render(ctx.req, ctx.res, '/podcasts', ctx.query)
  })

  router.get('/search', async ctx => {
    await app.render(ctx.req, ctx.res, '/search', ctx.query)
  })

  return router
}