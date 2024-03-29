/*
*
** CONFIG.
*
*/

require('dotenv').config()

const fetch = require('node-fetch')

const { createClient } = require('@sanity/client')
const urlBuilder = require('@sanity/image-url')

const express = require('express')
const app = express()
this.assets = []

const path = require('path')
const device = require('express-device')

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(device.capture())

const endpoint = process.env.ENDPOINT
const projectId = process.env.PROJECT_ID 
const dataset = process.env.DATASET 
const apiVersion = process.env.API_VERSION

const client = createClient({
  projectId, 
  dataset, 
  apiVersion,
  useCdn: true
})

const build = urlBuilder(client)

/*
*
** FUNCTIONS.
*
*/

process.on('uncaughtException', function(err) 
{ 
  console.log(err) 
  process.exit()
}) 

const url = query => 
{
  return fetch(
    `${endpoint}${query}`
  )
    .then(
      (res) => 
        res.json()
    )
}

const linkResolver = doc =>
{
  switch(doc._type)
  {
    case 'advertising': 
      return '/advertising'
      break
    case 'shortFilms': 
      return '/shortFilms'
      break
    case 'commercial': 
      return '/commercial'
      break 
    case 'gallery': 
      return `/gallery/${doc.slug}`
      break 
    case 'video': 
      return `/video/${doc.slug}`
      break
    case 'portraits': 
      return '/portraits'
      break 
    case 'stillLife': 
      return '/stillLife'
      break 
    case 'about': 
      return '/about'
      break 
    default: 
      return '/'
      break
  }
}

app.use((req, res, next) => {
  res.locals.Link = linkResolver
  res.locals.Build = build

  next()
})

const handleAssets = async() => 
{
  const all_galleries = await url(
    encodeURIComponent(
      `*[_type == "gallery"]{
        "images": images
      }`
    )
  )
  all_galleries.result.forEach(
    gallery => 
    {
      gallery.images.forEach(
        image => 
        {
          let src = build.image(image.asset._ref).url()
      
          if(!this.assets.includes(src))
            this.assets.push(src)
        }
      )
    }
  )

  const all_adverts = await url(
    encodeURIComponent(
      `*[_type == "advert"]{
        preview,
        "photo": inDepth.photo, 
        "photo2": inDepth.photoTwo
      }`
    )
  )
  all_adverts.result.forEach(
    ad => 
    {
      let src = build.image(ad.preview.asset._ref).url()
      let src_two, src_three

      if(!this.assets.includes(src))
        this.assets.push(src)
      
      if(ad.photo)
      {
        src_two = build.image(ad.photo.asset._ref).url()

        if(!this.assets.includes(src_two))
          this.assets.push(src_two) 
      }

      if(ad.photo2)
      {
        src_three = build.image(ad.photo2.asset._ref).url()

        if(!this.assets.includes(src_three))
          this.assets.push(src_three)
      }
    }
  )

  const all_films = await url(
    encodeURIComponent(
      `*[_type == "film"]{
        preview,
        "photo": inDepth.photo, 
        "photo2": inDepth.photoTwo
      }`
    )
  )
  all_films.result.forEach(
    ad => 
    {
      let src = build.image(ad.preview.asset._ref).url()
      let src_two, src_three

      if(!this.assets.includes(src))
        this.assets.push(src)
      
      if(ad.photo)
      {
        src_two = build.image(ad.photo.asset._ref).url()

        if(!this.assets.includes(src_two))
          this.assets.push(src_two) 
      }

      if(ad.photo2)
      {
        src_three = build.image(ad.photo2.asset._ref).url()

        if(!this.assets.includes(src_three))
          this.assets.push(src_three)
      }
    }
  )
  
  const portraits = await url(
    encodeURIComponent(
      `*[_type == "portraits"]{
        images
      }`
    )
  )
  portraits.result[0].images.forEach(
    image => 
    {
      let src = build.image(image.asset._ref).url()

      if(!this.assets.includes(src))
        this.assets.push(src)
    }
  )

  const sl = await url(
    encodeURIComponent(
      `*[_type == "stillLife"]{
        images
      }`
    )
  )
  sl.result[0].images.forEach(
    image => 
    {
      let src = build.image(image.asset._ref).url()

      if(!this.assets.includes(src))
        this.assets.push(src)
    }
  )

  const about = await url(
    encodeURIComponent(
      `*[_type == "about"]{
        "head": header.image, 
        "foot": footer.image
      }`
    )
  )

  let flagTop = build.image(about.result[0].head.asset._ref).url()
  let flagBtm = build.image(about.result[0].foot.asset._ref).url()

  if(!this.assets.includes(flagTop))
    this.assets.push(flagTop)

  if(!this.assets.includes(flagBtm))
    this.assets.push(flagBtm)

  const navigation = await url(
    encodeURIComponent(
      `*[_type == "navigation"]{
        "image": logo.asset
      }`
    )
  )

  let nav = build.image(navigation.result[0].image._ref).url()

  if(!this.assets.includes(nav))
    this.assets.push(nav)
}

const handleReq = async(req) =>
{
  await handleAssets()

  const meta = await url(
    encodeURIComponent(
      '*[_type == "metadata"]'
    )
  )

  const navigation = await url(
    encodeURIComponent(
      `*[_type == "navigation"]{
        ..., 
        nav_items[] ->
      }`
    )
  )

  const footer = await url(
    encodeURIComponent(
      '*[_type == "footer"]'
    )
  )

  return {
    meta: meta.result[0],
    navigation: navigation.result[0],
    footer: footer.result[0],
    device: req.device.type,
    assets: this.assets
  }
}

/*
*
** ROUTES.
*
*/

app.get('/', async(req, res) =>
{
  const partials = await handleReq(req)
  const home = await url(
    encodeURIComponent(
      `*[_type == "home"]{
        ..., 
        showcase[]->{
          _type, 
          title, 
          preview, 
          "image": images[0], 
          "slug": slug.current
        }
      }`
    )
  )

  res.render('pages/home',
  {
    ...partials,
    home: home.result[0],
  })
})

app.get('/advertising', async(req, res) =>
{
  const partials = await handleReq(req)
  const adverts = await url(
    encodeURIComponent(
      `*[_type == "advertising"]{
        ..., 
        showcase[]-> {
          _type, 
          title, 
          duration,
          preview, 
          "slug": slug.current
        }
      }`
    )
  )

  res.render('pages/advertising',
  {
    ...partials,
    advertising: adverts.result[0]
  })
})

app.get('/advert/:uid', async(req, res) =>
{
  const partials = await handleReq(req)
  const advert = await url(
    encodeURIComponent(
      `*[_type == "advert"
        && slug.current == "${req.params.uid}"
      ]`
    )
  )

  res.render('pages/advert', {
    ...partials,
    advert: advert.result[0]
  })
})

app.get('/shortFilms', async(req, res) =>
{
  const partials = await handleReq(req)
  const films = await url(
    encodeURIComponent(
      `*[_type == "shortFilms"]{
        ...,
        showcase[]-> {
          _type, 
          title, 
          duration,
          preview, 
          "slug": slug.current
        }
      }`
    )
  )

  res.render('pages/shortFilms',
  {
    ...partials,
    shortFilms: films.result[0]
  })
})

app.get('/film/:uid', async(req, res) =>
{
  const partials = await handleReq(req)
  const film = await url(
    encodeURIComponent(
      `*[_type == "film"
        && slug.current == "${req.params.uid}"
      ]`
    )
  )

  res.render('pages/film', {
    ...partials,
    film: film.result[0]
  })
})

app.get('/commercial', async(req, res) =>
{
  const partials = await handleReq(req)
  const commercial = await url(
    encodeURIComponent(
      `*[_type == "commercial"]{
        ..., 
        showcase[]-> {
          ..., 
          _type, 
          title, 
          "image": images[0], 
          "slug": slug.current
        }
      }`
    )
  )

  res.render('pages/commercial',
  {
    ...partials,
    commercial: commercial.result[0]
  })
})

app.get('/gallery/:uid', async(req, res) =>
{
  const partials = await handleReq(req)
  const gallery = await url(
    encodeURIComponent(
      `*[_type == "gallery" 
        && slug.current == "${req.params.uid}"
      ]`
    )
  )

  res.render('pages/gallery', {
    ...partials,
    gallery: gallery.result[0]
  })
})

app.get('/portraits', async(req, res) =>
{
    const partials = await handleReq(req)
    const portraits = await url(
      encodeURIComponent(
        `*[_type == "portraits"]`
      )
    )

    res.render('pages/portraits', {
      ...partials,
      portraits: portraits.result[0]
    })
})

app.get('/stillLife', async(req, res) =>
{
    const partials = await handleReq(req)
    const stillLife = await url(
      encodeURIComponent(
        `*[_type == "stillLife"]`
      )
    )

    res.render('pages/stillLife', {
      ...partials,
      sl: stillLife.result[0]
    })
})

app.get('/about', async(req, res) =>
{
    const partials = await handleReq(req)
    const about = await url(
      encodeURIComponent(
        '*[_type == "about"]'
      )
    )

    res.render('pages/about', {
      ...partials,
      about: about.result[0]
    })
})

app.get('*', (req, res) => 
{
  res.render('pages/404')
})

/*
*
** LISTEN.
*
*/

app.listen(process.env.PORT, () =>
{
  console.log(`Listening at http://localhost:${process.env.PORT}`)
})
