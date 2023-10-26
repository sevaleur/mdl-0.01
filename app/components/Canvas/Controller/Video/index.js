import { Group } from 'three'

import Placeholder from './Placeholder'

export default class Video
{
  constructor({ scene, screen, viewport, transition })
  {
    this.id = 'video'

    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.transition = transition

    this.group = new Group()

    this.getElements()

    this.createPlaceholder()
    this.onResize()

    this.scene.add(this.group)

    if(!this.transition) this.show()
  }

  getElements()
  {
    this.element = document.querySelector('.video__preview__image')
  }

  createPlaceholder()
  {
    this.placeholder = new Placeholder({
      element: this.element,
      geometry: this.geo,
      scene: this.group,
      screen: this.screen,
      viewport: this.viewport
    })
  }

  /*
    ANIMATIONS.
  */

  show()
  {
    this.placeholder.show()
  }

  hide()
  {
    this.placeholder.hide()
  }

  /*
    Events.
  */

  onResize()
  {
    this.placeholder.onResize({
      screen: this.screen,
      viewport: this.viewport,
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

  update()
  {
    this.placeholder.update()
  }

  /*
    DESTROY.
  */

  destroy()
  {
    this.scene.remove(this.group)
  }
}
