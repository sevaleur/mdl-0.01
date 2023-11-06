import { Group } from 'three'

import Flag from './Flag'

export default class About
{
  constructor({ scene, screen, viewport, geo })
  {
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.geo = geo

    this.group = new Group()

    this.createElements()
    this.createFlags()

    this.onResize()

    this.scene.add(this.group)

    this.show()
  }

  createElements()
  {
    this.images = document.querySelectorAll('.about__media__figure__image')
  }

  createFlags()
  {
    this.elements = Array.from(this.images,
      (element, index) =>
    {
      return new Flag({
        element,
        index,
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
    this.elements.forEach( 
      element => 
    {
      element.onResize(
      {
        screen: this.screen,
        viewport: this.viewport,
      })
    })
  }

  onTouchDown({ y })
  {

  }

  onTouchMove({ y })
  {

  }

  onTouchUp({ y })
  {

  }

  onWheel({ pixelY })
  {

  }

  /*
    UPDATE.
  */

  update(scroll)
  {
    const current = (scroll.current / this.screen.height) * this.viewport.height

    this.group.position.y = current

    this.elements.forEach( element => { element.update() })
  }

  /*
    DESTROY.
  */

  destroy()
  {
    this.scene.remove(this.group)
  }
}
