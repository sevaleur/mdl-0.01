import { PlaneGeometry } from 'three'
import gsap from 'gsap'

import Home from './Home'
import Menu from './Menu'
import Gallery from './Gallery'
import Video from './Video'
import About from './About'
import Transition from './Transition'
import Logo from './Logo'

export default class Controller 
{
  constructor({ bgTMap, sizes, scene, viewport })
  {
    this.bgTMap = bgTMap
    this.sizes = sizes 
    this.scene = scene 
    this.viewport = viewport

    this.createGeometry()
  }

  /*
  * 
  ** CREATE.
  *
  */

  createGeometry()
  {
    this.geo = new PlaneGeometry(
      1, 
      1, 
      100, 
      100
    )
  }

  createNavigation()
  {
    this.navigation = new Logo({
      id: 'navigation',
      bgTMap: this.bgTMap,
      scene: this.scene,
      screen: this.sizes.screen,
      viewport: this.viewport,
      geo: this.geo
    })
  }

  createHome(transition = false)
  {
    if(this.home) this.destroyHome()

    this.home = new Home({
      bgTMap: this.bgTMap,
      scene: this.scene,
      screen: this.sizes.screen,
      viewport: this.viewport,
      geo: this.geo,
      transition,
    })
  }

  createMenu(transition = false)
  {
    if(this.menu) this.destroyMenu()

    this.menu = new Menu({
      bgTMap: this.bgTMap,
      scene: this.scene,
      screen: this.sizes.screen,
      viewport: this.viewport,
      geo: this.geo,
      transition,
    })
  }

  createGallery(transition = false)
  {
    if(this.gallery) this.destroyGallery()

    this.gallery = new Gallery({
      bgTMap: this.bgTMap,
      scene: this.scene,
      screen: this.sizes.screen,
      viewport: this.viewport,
      geo: this.geo,
      transition,
    })
  }

  createVideo()
  {
    if(this.video) this.destroyVideo()

    this.video = new Video({
      scene: this.scene,
      screen: this.sizes.screen,
      viewport: this.viewport,
      geo: this.geo,
      transition: this.transition
    })
  }

  createAbout()
  {
    if(this.about) this.destroyAbout()

    this.about = new About({
      scene: this.scene,
      screen: this.sizes.screen,
      viewport: this.viewport,
      geo: this.geo
    })
  }

  /*
  *
  ** DESTROY.
  * 
  */

  destroyHome()
  {
    if(!this.home) return

    this.home.destroy()
    this.home = null
  }

  destroyMenu()
  {
    if(!this.menu) return

    this.menu.destroy()
    this.menu = null
  }

  destroyGallery()
  {
    if(!this.gallery) return

    this.gallery.destroy()
    this.gallery = null
  }

  destroyVideo()
  {
    if(!this.video) return

    this.video.destroy()
    this.video = null
  }

  destroyAbout()
  {
    if(!this.about) return

    this.about.destroy()
    this.about = null
  }

/* 
*
** EVENTS.
*
*/

  onChangeStart(template, url, push)
  {
    if(!push)
      return

    if(this.home)
      this.home.hide()

    if(this.menu)
      this.menu.hide()

    if(this.about)
      this.about.hide()

    if(this.gallery)
      this.gallery.hide()

    if(this.video)
      this.video.hide()

    this.menu_to_view = template === 'commercial' && url.indexOf('still_life') > -1 || template === 'commercial' && url.indexOf('portraits') > -1
    this.menu_to_gallery = template === 'commercial' && url.indexOf('gallery') > -1
    this.gallery_to_menu = template === 'gallery' && url.indexOf('commercial') > -1

    this.menu_to_video = template === 'advertising' && url.indexOf('video') > -1 || template === 'shortFilms' && url.indexOf('video') > -1
    this.video_to_menu = template === 'video' && url.indexOf('advertising') > -1

    if(this.menu_to_gallery && !this.menu_to_view || this.menu_to_video)
    {
      const scroll = { ...this.menu.scroll }

      const { index, image_elements } = this.menu

      this.transition = new Transition({
        index,
        image_elements,
        scene: this.scene,
        viewport: this.viewport,
        screen: this.sizes.screen,
        url,
        scroll
      })
    }
  }

  onChange(template)
  {
    if(!this.navigation)
      this.createNavigation()

    switch(template)
    {
      case 'home':
        this.transition
          ? this.createHome(this.transition)
          : this.createHome()

        this.destroyMenu()
        this.destroyGallery()
        this.destroyVideo()
        this.destroyAbout()

        break
      case 'commercial':
      case 'advertising':
      case 'shortFilms':
        this.transition
          ? this.createMenu(this.transition)
          : this.createMenu()

        gsap.delayedCall(0.5, () =>
        {
          if(this.gallery_to_menu)
          {
            if(this.transition) this.transition.animateMenu(this.menu)
          }
        })

        this.destroyHome()
        this.destroyGallery()
        this.destroyVideo()
        this.destroyAbout()

        break
      case 'portraits':
      case 'stillLife':
        this.createGallery()

        this.destroyHome()
        this.destroyMenu()
        this.destroyVideo()
        this.destroyAbout()
        break
      case 'gallery':
        this.transition
          ? this.createGallery(this.transition)
          : this.createGallery()

        gsap.delayedCall(0.5, () =>
        {
          if(this.menu_to_gallery) this.transition.animateGallery(this.gallery)
        })

        this.destroyHome()
        this.destroyMenu()
        this.destroyVideo()
        this.destroyAbout()

        break
      case 'video':
        this.createVideo()

        gsap.delayedCall(0.5, () =>
        {
          if(this.menu_to_video) this.transition.animateVideo(this.video)
        })

        this.destroyHome()
        this.destroyMenu()
        this.destroyGallery()
        this.destroyAbout()

        break
      case 'about':
        this.createAbout()

        this.destroyHome()
        this.destroyMenu()
        this.destroyGallery()
        this.destroyVideo()

        break
      default:
      break
    }
  }

  onResize({ screen, viewport })
  {
    if(this.navigation)
    {
      this.navigation.onResize({
        screen,
        viewport
      })
    }

    if(this.home)
    {
      this.home.onResize({
        screen,
        viewport
      })
    }

    if(this.menu)
    {
      this.menu.onResize({
        screen,
        viewport
      })
    }

    if(this.gallery)
    {
      this.gallery.onResize({
        screen,
        viewport
      })
    }

    if(this.video)
    {
      this.video.onResize({
        screen,
        viewport
      })
    }

    if(this.about)
    {
      this.about.onResize({
        screen,
        viewport
      })
    }
  }

  onTouchDown({ y, x })
  {
    if(this.navigation)
    {
      this.navigation.onTouchDown({
        y,
        x
      })
    }

    if(this.home)
    {
      this.home.onTouchDown({
        y,
        x
      })
    }

    if(this.menu)
    {
      this.menu.onTouchDown({
        y,
        x
      })
    }

    if(this.gallery)
    {
      this.gallery.onTouchDown({
        y,
        x
      })
    }

    if(this.about)
    {
      this.about.onTouchDown({
        y
      })
    }
  }

  onTouchMove({ y, x })
  {
    if(this.navigation)
    {
      this.navigation.onTouchMove({
        y,
        x
      })
    }

    if(this.home)
    {
      this.home.onTouchMove({
        y,
        x
      })
    }

    if(this.menu)
    {
      this.menu.onTouchMove({
        y,
        x
      })
    }

    if(this.gallery)
    {
      this.gallery.onTouchMove({
        y,
        x
      })
    }

    if(this.about)
    {
      this.about.onTouchMove({
        y
      })
    }
  }

  onTouchUp({ y, x })
  {
    if(this.navigation)
    {
      this.navigation.onTouchUp({
        y,
        x
      })
    }

    if(this.home)
    {
      this.home.onTouchUp({
        y,
        x
      })
    }

    if(this.menu)
    {
      this.menu.onTouchUp({
        y,
        x
      })
    }

    if(this.gallery)
    {
      this.gallery.onTouchUp({
        y,
        x
      })
    }

    if(this.about)
    {
      this.about.onTouchUp({
        y
      })
    }
  }

  onWheel(e)
  {
    if(this.navigation)
      this.navigation.onWheel(e)

    if(this.home)
      this.home.onWheel(e)

    if(this.menu)
      this.menu.onWheel(e)

    if(this.gallery)
      this.gallery.onWheel(e)

    if(this.about)
      this.about.onWheel(e)
  }

  /* 
  *
  ** UPDATE.
  *
  */

  update(scroll)
  {
    if(this.navigation)
      this.navigation.update()

    if(this.home)
      this.home.update()

    if(this.menu)
      this.menu.update()

    if(this.gallery)
    {
      this.gallery.update()

      if(this.transition)
        this.transition.update(this.gallery)
    }

    if(this.video)
    {
      this.video.update()

      if(this.transition)
        this.transition.update(this.video)
    }

    if(this.about)
      this.about.update(scroll)
  }
}