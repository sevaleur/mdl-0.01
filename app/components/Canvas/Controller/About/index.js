import { Group } from 'three'
import map from 'lodash/map'

import Media from './Media'

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

    this.onResize()

    this.createMedias()

    this.scene.add(this.group)

    this.show()
  }

  createElements()
  {
    this.elements = document.querySelectorAll('.about__media__figure__image')
  }

  createMedias()
  {
    this.media_elements = map(this.elements,
      (element, index) =>
    {
      return new Media({
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
    Animations.
  */

  show()
  {
    map(this.media_elements, media => media.show())
  }

  hide()
  {
    map(this.media_elements, media => media.hide())
  }

  /*
    Events.
  */

  onResize()
  {
    map(this.media_elements, media => media.onResize({
      screen: this.screen,
      viewport: this.viewport,
    }))
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
    Update.
  */

  update(scroll)
  {
    const current = (scroll.current / this.screen.height) * this.viewport.height

    this.group.position.y = current

    map(this.media_elements, media => media.update())
  }

  /*
    Destroy.
  */

  destroy()
  {
    this.scene.remove(this.group)
  }
}
