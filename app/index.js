import each from 'lodash/each'
import normalizeWheel from 'normalize-wheel'

import Canvas from 'components/Canvas'
import Preloader from 'components/Preloader'
import Navigation from 'components/Navigation'
import Footer from 'components/Footer'

import Home from 'pages/home'
import Menu from 'pages/menu'
import About from 'pages/about'
import Gallery from 'pages/gallery'
import Video from 'pages/video'

export default class App
{
  constructor()
  {
    this.createDevice()
    this.createContent()
    this.createPages()
    this.createCanvas()
    this.createPreloader()
    this.createNavigation()
    this.createFooter()

    this.addEventListeners()
    this.addLinkListeners()

    this.onResize()

    this.update()
  }

  /*
  *
  ** CREATE.
  *
  */

  createDevice()
  {
    this.device = {
      desktop: false, 
      tablet: false, 
      phone: false
    }

    this.device.desktop = window.innerWidth > 1024 ? true : false
    this.device.tablet = window.innerWidth <= 1024 && window.innerWidth > 768 ? true : false
    this.device.phone = window.innerWidth <= 768 ? true : false

    if(this.device.desktop)
    {
      this.device.tablet = false
      this.device.phone = false
    }
    else if(this.device.tablet)
    {
      this.device.desktop = false 
      this.device.phone = false 
    }
    else 
    {
      this.device.desktop = false 
      this.device.tablet = false
    }
  }

  createContent()
  {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages()
  {
    this.pages = {
      home: new Home({ device: this.device }),
      advertising: new Menu({ device: this.device }),
      shortFilms: new Menu({ device: this.device }),
      commercial: new Menu({ device: this.device }),
      portraits: new Gallery({ device: this.device }),
      stillLife: new Gallery({ device: this.device }),
      gallery: new Gallery({ device: this.device }),
      advert: new Video({ device: this.device }),
      film: new Video({ device: this.device }),
      about: new About({ device: this.device }),
    }

    this.page = this.pages[this.template]
    this.page.create()
  }

  createCanvas()
  {
    this._canvas = document.createElement('canvas')
    document.body.appendChild(this._canvas)

    this.canvas = new Canvas({
      template: this.template,
      canvas: this._canvas,
    })
  }

  createPreloader()
  {
    this.preloader = new Preloader({ canvas: this.canvas })
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createNavigation()
  {
    this.navigation = new Navigation({
      template: this.template, 
      device: this.device
    })
  }

  createFooter()
  {
    this.footer = new Footer({
      template: this.template, 
      device: this.device
    })
  }

  /*
  *
  ** EVENTS.
  *
  */

  onPreloaded()
  {
    this.onResize()

    this.canvas.onPreloaded()

    this.preloader.destroy()

    this.navigation.show()
    this.footer.show()
    this.page.show()
  }

  async onChange({ url, push = true })
  {
    this.canvas.onChangeStart(this.template, url, push)

    await this.page.hide()
    const req = await window.fetch(url)

    if(req.status === 200)
    {
      const html = await req.text()
      const div = document.createElement('div')

      if(push)
        window.history.pushState({}, '', url)

      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.canvas.onChange(this.template)
      this.navigation.onChange(this.template)

      this.page = this.pages[this.template]
      this.page.create()

      this.onResize()
      this.page.show()

      this.addLinkListeners()
    }
    else
    {
      console.log('error')
    }
  }

  onResize()
  {
    this.device.desktop = window.innerWidth > 1024 ? true : false
    this.device.tablet = window.innerWidth <= 1024 && window.innerWidth > 768 ? true : false
    this.device.phone = window.innerWidth <= 768 ? true : false

    if(this.device.desktop)
    {
      this.device.tablet = false
      this.device.phone = false
    }
    else if(this.device.tablet)
    {
      this.device.desktop = false 
      this.device.phone = false 
    }
    else 
    {
      this.device.desktop = false 
      this.device.tablet = false
    }

    if(this.page && this.page.onResize)
      this.page.onResize()

    window.requestAnimationFrame(() =>
    {
      if(this.canvas && this.canvas.onResize)
        this.canvas.onResize()
    })
  }

  onTouchDown(e)
  {
    if(this.canvas && this.canvas.onTouchDown)
      this.canvas.onTouchDown(e)

    if(this.page && this.page.onTouchDown)
      this.page.onTouchDown(e)
  }

  onTouchMove(e)
  {
    if(this.canvas && this.canvas.onTouchMove)
      this.canvas.onTouchMove(e)

    if(this.page && this.page.onTouchMove)
      this.page.onTouchMove(e)
  }

  onTouchUp(e)
  {
    if(this.canvas && this.canvas.onTouchUp)
      this.canvas.onTouchUp(e)

    if(this.page && this.page.onTouchUp)
      this.page.onTouchUp(e)
  }

  onMove(e)
  {
    if(this.canvas && this.canvas.onMove)
      this.canvas.onMove(e)

    if(this.page && this.page.onMove)
      this.page.onMove(e)
  }

  onWheel(e)
  {
    const norm_wheel = normalizeWheel(e)

    if(this.canvas && this.canvas.onWheel)
      this.canvas.onWheel(norm_wheel)

    if(this.page && this.page.onWheel)
      this.page.onWheel(norm_wheel)
  }

  onPopState()
  {
    this.onChange({
      url: window.location.pathname,
      push: false
    })
  }

  /*
  *
  ** LOOP.
  *
  */

  update()
  {
    if(this.page && this.page.update)
      this.page.update()

    if(this.canvas && this.canvas.update)
      this.canvas.update(this.page.scroll)

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  /*
  *
  ** LISTENERS.
  *
  */

  addEventListeners()
  {
    window.addEventListener('popstate', this.onPopState.bind(this))
    window.addEventListener('mousewheel', this.onWheel.bind(this))
    window.addEventListener('mousemove', this.onMove.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinkListeners()
  {
    const links = document.querySelectorAll('a')

    each(links, link =>
    {
      link.onclick = event =>
      {
        event.preventDefault()

        const { href } = link
        this.onChange({ url: href })
      }
    })

    const outside_links = document.querySelectorAll('.outside__link')

    each(outside_links, link =>
    {
      link.onclick = event =>
      {
        const target = link.querySelector('a')
        window.open(target.href, '_blank')
      }
    })
  }
}

new App()
