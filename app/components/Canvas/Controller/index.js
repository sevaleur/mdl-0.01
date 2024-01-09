import { PlaneGeometry } from 'three'
import gsap from 'gsap'

import Showcase from './Showcase'
import Menu from './Menu'
import Gallery from './Gallery'
import About from './About'
import Logo from './Logo'
import Transition from './Transition'
import Ray from './Ray'

export default class Controller 
{
  constructor({ bgTMap, sizes, scene, viewport, camera })
  {
    this.bgTMap = bgTMap
    this.sizes = sizes 
    this.scene = scene 
    this.viewport = viewport
    this.camera = camera

    this.createGeometry()
    this.createMouse()
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

  createMouse()
  {
    this.mouse = {
      x: 0, 
      y: 0,
      pX: 0, 
      pY: 0, 
      vX: 0, 
      vY: 0
    }
  }
  
  createRay()
  {
    let objs = []

    this.navigation.elements.forEach(
      el => 
      {
        objs.push(el)
      }
    )

    this.ray = new Ray({
      scene: this.scene, 
      screen: this.sizes.screen, 
      camera: this.camera.instance,
      objs
    })
  }

  createNavigation(template)
  {
    this.navigation = this.createLogo(template)
  }

  createLogo(template)
  {
    return new Logo({
      template,
      bgTMap: this.bgTMap,
      scene: this.scene,
      screen: this.sizes.screen,
      viewport: this.viewport,
      geo: this.geo,
    })
  }

  createShowcase(template, transition = false)
  {
    if(this.showcase) this.destroyShowcase()

    this.showcase = new Showcase({
      bgTMap: this.bgTMap,
      scene: this.scene,
      screen: this.sizes.screen,
      viewport: this.viewport,
      geo: this.geo,
      template,
      transition
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

  destroyRay()
  {
    if(!this.ray) return 

    this.ray.destroy()
    this.ray = null 
  }

  destroyShowcase()
  {
    if(!this.showcase) return

    this.showcase.destroy()
    this.showcase = null
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

    if(this.showcase)
      this.showcase.hide()

    if(this.bg)
      this.bg.hide()

    if(this.menu)
      this.menu.hide()

    if(this.about)
      this.about.hide()

    if(this.gallery)
      this.gallery.hide()

    this.menu_to_gallery = template === 'commercial' && url.indexOf('gallery') > -1

    if(this.menu_to_gallery)
    {
      if(this.transition) return 
      
      const scroll = { ...this.menu.scroll }

      const { index, elements } = this.menu

      this.transition = new Transition({
        index,
        elements,
        scene: this.scene,
        viewport: this.viewport,
        screen: this.sizes.screen,
        url,
        scroll
      })
    }
    else 
    {
      this.transition = null 
    }
  }

  onChange(template)
  {
    if(this.sizes.screen.desktop)
    {
      if(!this.navigation)
        this.createNavigation('navigation')

      !this.ray
        ? this.createRay()
        : this.ray.removeObjects(template)
    }

    switch(template)
    {
      case 'home':
        this.transition
          ? (this.createShowcase('home', this.transition))
          : (this.createShowcase('home'))

        if(this.ray && this.showcase)
          this.ray.addObjects(this.showcase.elements)

        this.destroyMenu()
        this.destroyGallery()
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

        this.destroyShowcase()
        this.destroyGallery()
        this.destroyAbout()

        break
      case 'portraits':
      case 'stillLife':
        this.createGallery()

        this.destroyShowcase()
        this.destroyMenu()
        this.destroyAbout()

        break
      case 'gallery':
        this.transition
          ? this.createGallery(this.transition)
          : this.createGallery()

        gsap.delayedCall(0.5, () =>
        {
          if(this.menu_to_gallery) this.transition.animateTransition(this.gallery)
        })

        this.destroyShowcase()
        this.destroyMenu()
        this.destroyAbout()

        break
      case 'about':
        this.createAbout()

        this.destroyShowcase()
        this.destroyMenu()
        this.destroyGallery()

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

    if(this.showcase)
    {
      this.showcase.onResize({
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
      this.navigation.onTouchDown({ y, x })

    if(this.menu)
      this.menu.onTouchDown({ y, x })
    

    if(this.gallery)
      this.gallery.onTouchDown({ y, x })

    if(this.about)
      this.about.onTouchUp({ y })
  }

  onTouchMove({ y, x })
  {
    if(this.navigation)
      this.navigation.onTouchMove({ y, x })

    if(this.menu)
      this.menu.onTouchMove({ y, x })

    if(this.gallery)
      this.gallery.onTouchMove({ y, x })

    if(this.about)
      this.about.onTouchMove({ y })
  }

  onTouchUp({ y, x })
  {
    if(this.navigation)
      this.navigation.onTouchUp({ y, x })

    if(this.menu)
      this.menu.onTouchUp({ y, x })

    if(this.gallery)
      this.gallery.onTouchUp({ y, x })

    if(this.about)
      this.about.onTouchUp ({ y })
  }

  onMove({ clientX, clientY })
  {
    this.mouse.x = clientX / this.sizes.screen.width * 2 - 1
    this.mouse.y = -(clientY / this.sizes.screen.height * 2 - 1)

    this.mouse.vX = this.mouse.x - this.mouse.pX 
    this.mouse.vY = this.mouse.y - this.mouse.pY 

    this.mouse.pX = this.mouse.x 
    this.mouse.pY = this.mouse.y
  }

  onWheel(e)
  {
    if(this.navigation)
      this.navigation.onWheel(e)  

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

    if(this.ray && this.ray.ray)
      this.ray.update(this.mouse)

    if(this.showcase)
      this.showcase.update()

    if(this.menu)
      this.menu.update()

    if(this.gallery)
    {
      this.gallery.update()

      if(this.transition)
        this.transition.update(this.gallery)
    }

    if(this.about)
      this.about.update(scroll)
  }
}