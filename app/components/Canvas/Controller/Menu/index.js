import { Group } from 'three'
import gsap from 'gsap'

import Prefix from 'prefix'

import Element from './Element'

export default class Menu
{
  constructor({ bgTMap, scene, screen, viewport, geo, transition })
  {
    this.bgTMap = bgTMap
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.geo = geo
    this.transition = transition

    this.group = new Group()

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      speed: 0.1,
      ease: 0.05,
    }

    this.index = null
    this.select = false

    this.t_prefix = Prefix('transform')

    this.createElements()
    this.createMenu()

    this.onResize()
    this.onSelect()

    this.scene.add(this.group)

    this.show()
  }

  /*
    CREATE.
  */

  createElements()
  {
    this.menu_wrapper = document.querySelector('.menu__wrapper')
    this.menu_gallery = document.querySelector('.menu__gallery')

    if(this.screen.phone)
      this.menu_phone_outer = document.querySelector('.menu__right__outer')

    this.images = document.querySelectorAll('img.menu__gallery__image__figure__image')
    this.img_links = document.querySelectorAll('.menu__gallery__image__link')

    this.img_length = this.images.length
  }

  createMenu()
  {
    this.elements = Array.from(this.images,
      (element, index) =>
    {
      return new Element({
        element,
        index,
        bgTMap: this.bgTMap,
        link: this.img_links[index],
        geometry: this.geo,
        length: this.img_length,
        scene: this.group,
        screen: this.screen,
        viewport: this.viewport
      })
    })
  }

  /*
  *
  **  ANIMATIONS.
  *
  */

  show()
  {
    this.elements.forEach(element => { element.show() })
  }

  hide()
  {
    this.elements.forEach(element => { element.hide() })
  }

  /*
  *
  ** EVENTS.
  *
  */

  onResize()
  {
    this.full_bounds = this.menu_gallery.getBoundingClientRect()

    this.elements.forEach(
      element => 
    { 
      element.onResize(
      {
        screen: this.screen,
        viewport: this.viewport,
      })
    })

    this.scroll.limit = this.full_bounds.height - this.elements[0].bounds.height
  }

  onTouchDown({ y, x })
  {
    this.scroll.position = this.scroll.current
  }

  onTouchMove({ y, x })
  {
    const x_dist = x.start - x.end
    const y_dist = y.start - y.end

    const dist = x_dist + y_dist

    this.scroll.target = this.scroll.position - dist * 0.6
  }

  onTouchUp({ y, x })
  {

  }

  onWheel({ pixelY, pixelX })
  {
    this.scroll.target -= pixelX * 0.5
    this.scroll.target -= pixelY * 0.5
  }

  onSelect()
  {
    this.img_links.forEach(
      (link, index) =>
    {
      link.addEventListener('mouseover', () =>
      {
        this.index = index
      })
    })
  }

  /*
    UPDATE.
  */

  update()
  {
    if(this.select)
      return

    this.scroll.target = gsap.utils.clamp(-this.scroll.limit, 0, this.scroll.target)
    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.ease)

    this.menu_wrapper.style[this.t_prefix] = `translateY(${this.scroll.current}px)`

    if(this.screen.phone)
      this.menu_phone_outer.style[this.t_prefix] = `translateY(${this.scroll.current}px)`

    if(this.scroll.current > -0.01)
      this.scroll.current = 0

    this.elements.forEach(element => { element.update(this.scroll) })

    this.scroll.last = this.scroll.current
  }

  /*
    DESTROY.
  */

  destroy()
  {
    this.scene.remove(this.group)
  }
}
