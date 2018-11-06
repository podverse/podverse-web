import * as Router from 'koa-router'

export default (app) => {
  const router = new Router()

  router.get('/clip/:id', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/clip', query)
  })

  router.get('/clips', async ctx => {
    await app.render(ctx.req, ctx.res, '/main/clips', ctx.query)
  })

  router.get('/episode', async ctx => {
    await app.render(ctx.req, ctx.res, '/main/episode', ctx.query)
  })

  router.get('/playlist', async ctx => {
    await app.render(ctx.req, ctx.res, '/main/playlist', ctx.query)
  })

  router.get('/playlists', async ctx => {
    await app.render(ctx.req, ctx.res, '/main/playlists', ctx.query)
  })

  router.get('/podcast', async ctx => {
    await app.render(ctx.req, ctx.res, '/main/podcast', ctx.query)
  })

  router.get('/podcasts', async ctx => {
    await app.render(ctx.req, ctx.res, '/main/podcasts', ctx.query)
  })

  return router
}