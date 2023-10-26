import { Group } from 'three'
import gsap from 'gsap'

import map from 'lodash/map'
import Prefix from 'prefix'

import Showcase from './Showcase'
import Background from './Background'

export default class Home
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

    this.t_prefix = Prefix('transform')

    this.createElements()
    this.createBackground()
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
    this.background = document.querySelector('.home__logo__figure__image')

    this.menu_element = document.querySelector('.home__gallery')
    this.menu_wrapper = document.querySelector('.home__gallery__wrapper')

    this.img_el = document.querySelectorAll('img.home__gallery__image__figure__image')
    this.img_links = document.querySelectorAll('.home__gallery__image__link')

    this.img_length = this.img_el.length
  }

  createBackground()
  {
    this.background = new Background({
      element: this.background,
      bgTMap: this.bgTMap,
      geometry: this.geo,
      scene: this.group,
      screen: this.screen,
      viewport: this.viewport
    })
  }

  createMenu()
  {
    this.image_elements = map(this.img_el,
      (element, index) =>
    {
      return new Showcase({
        element,
        index,
        bgTMap: this.bgTMap,
        link: this.img_links[index],
        geometry: this.geo,
        gl: this.gl,
        length: this.img_length,
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
    this.background.show()

    map(this.image_elements, element => element.show())
  }

  hide()
  {
    this.background.hide()

    map(this.image_elements, element => element.hide())
  }

  animateText()
  {
    this.image_title_text.forEach(
      (t, i) =>
    {
      gsap.set([
        t,
        this.image_index_text[i],
        this.image_type_text[i]
      ],
      {
        opacity: 0.0
      })

      gsap.to([
        t,
        this.image_index_text[i],
        this.image_type_text[i]
      ],
      {
        opacity: 1.0,
        duration: 1.0,
        delay: 0.5
      })
    })
  }

  /*
    Events.
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
    this.full_bounds = this.menu_wrapper.getBoundingClientRect()

    this.background.onResize({
      screen: this.screen,
      viewport: this.viewport
    })

    map(this.image_elements, element => element.onResize({
      screen: this.screen,
      viewport: this.viewport,
    }))

    this.scroll.limit = this.full_bounds.height - this.image_elements[0].bounds.height
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
    this.scroll.target -= pixelX * 0.2
    this.scroll.target -= pixelY * 0.2
  }

  /*
    Update.
  */

  update()
  {
    this.scroll.target = gsap.utils.clamp(-this.scroll.limit, 0, this.scroll.target)
    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.ease)

    this.background.update()

    map(this.image_elements, (element, index) =>
    {
      element.update(this.scroll)
    })

    this.scroll.last = this.scroll.current
  }

  /*
    Destroy.
  */

  destroy()
  {
    this.img_links.forEach(
      link =>
    {
      link.onmouseover = null
    })

    this.scene.remove(this.group)
  }
}
