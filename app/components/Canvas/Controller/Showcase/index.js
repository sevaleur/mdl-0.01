import { Group } from 'three'

import Element from './Element'

export default class Showcase
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

    this.index = null

    this.createElements()
    this.createMenu()

    this.onResize()
    this.onGalleryClick()

    this.scene.add(this.group)

    this.show()
  }

  /*
    CREATE.
  */

  createElements()
  { 
    this.menu_element = document.querySelector('.home__gallery')
    this.menu_wrapper = document.querySelector('.home__gallery__wrapper')

    this.images = document.querySelectorAll('img.home__gallery__image__figure__image')
    this.img_links = document.querySelectorAll('.home__gallery__image__link')
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
        viewport: this.viewport,
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

  onGalleryClick()
  {
    this.img_links.forEach((link, index) =>
    {
      link.onmouseover = () =>
      {
        this.index = index
      }
    })
  }

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

  /*
    UPDATE.
  */

  update()
  {
    this.elements.forEach(
      element => 
      { 
        element.update() 
      }
    )
  }

  /*
    DESTROY.
  */

  destroy()
  {
    this.img_links.forEach(
      link =>
    { link.onmouseover = null })

    this.scene.remove(this.group)
  }
}
