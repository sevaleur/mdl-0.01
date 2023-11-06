import { Group } from 'three'
import gsap from 'gsap'

import Media from './Media'

export default class Logo
{
  constructor({ id, zIndex, bgTMap, scene, screen, viewport, geo })
  {
    this.id = id
    this.zIndex = zIndex || 0.0
    this.bgTMap = bgTMap
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.geo = geo

    this.group = new Group()

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      speed: 0.1,
      ease: 0.05,
    }

    this.createElements()
    this.createLogo()

    this.onResize()

    this.scene.add(this.group)

    this.show()
  }

  /* 
  *
  ** CREATE.  
  *
  */

  createElements()
  {
    this.images = document.querySelectorAll(`.${this.id}__logo__figure__image`)
  }

  createLogo()
  {
    this.elements = Array.from(this.images,
      (element, index) =>
    {
      return new Media({
        element,
        index,
        zIndex: this.zIndex,
        bgTMap: this.bgTMap,
        geometry: this.geo,
        scene: this.group,
        screen: this.screen,
        viewport: this.viewport
      })
    })
  }

  /*
    ANIMATIONS.
  */

  show()
  {
    this.elements.forEach( element => { element.show() })
  }

  hide()
  {
    this.elements.forEach( element => { element.hide() })
  }

  /*
    EVENTS.
  */

  onResize()
  {
    this.elements.forEach( element => 
    {
      element.onResize(
      {
        screen: this.screen,
        viewport: this.viewport,
      })
    })
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

  /*
    UPDATE.
  */

  update()
  {
    this.scroll.target = gsap.utils.clamp(-this.scroll.limit, 0, this.scroll.target)
    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.ease)

    this.elements.forEach( element => { element.update(this.scroll) })

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