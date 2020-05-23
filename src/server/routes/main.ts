const Router = require('koa-router')
const fs = require('fs')
const path = require('path')

export default (app) => {
  const router = new Router()

  router.get('/', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/index', query)
  })

  // router.get('/apple-app-site-association', async ctx => {
  //   const aasa = fs.readFileSync(path.resolve(__dirname, '../../config/apple-app-site-association'))
  //   ctx.set('Content-Type', 'application/json')
  //   ctx.body = aasa
  // })

  router.get('/.well-known/assetlinks.json', async ctx => {
    const assetLinks = fs.readFileSync(path.resolve(__dirname, '../../config/assetlinks.json'))
    ctx.set('Content-Type', 'application/json')
    ctx.body = assetLinks
  })

  router.get('/clip/:id', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/clip', query)
  })

  router.get('/clips', async ctx => {
    await app.render(ctx.req, ctx.res, '/clips', ctx.query)
  })

  router.get('/episode/:id', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/episode', query)
  })

  router.get('/episodes', async ctx => {
    await app.render(ctx.req, ctx.res, '/episodes', ctx.query)
  })

  router.get('/my-profile', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/my-profile', query)
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

  router.get('/profile/:id', async ctx => {
    const query = { ...ctx.params, ...ctx.query }
    await app.render(ctx.req, ctx.res, '/profile', query)
  })

  router.get('/profiles', async ctx => {
    await app.render(ctx.req, ctx.res, '/profiles', ctx.query)
  })

  router.get('/search', async ctx => {
    await app.render(ctx.req, ctx.res, '/search', ctx.query)
  })

  router.get('/settings', async ctx => {
    await app.render(ctx.req, ctx.res, '/settings', ctx.query)
  })

  return router
}