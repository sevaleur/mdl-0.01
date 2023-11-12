import { Group } from 'three'
import gsap from 'gsap'

import Prefix from 'prefix'

import Element from './Element'

export default class Gallery
{
  constructor({ bgTMap, scene, screen, viewport, geo, transition })
  {
    this.id = 'gallery'

    this.bgTMap = bgTMap
    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.geo = geo
    this.transition = transition

    this.group = new Group()

    this.t_prefix = Prefix('transform')

    this.createElements()
    this.createConfig()
    this.createGallery()
    this.onResize()

    this.createLinkListeners()

    this.scene.add(this.group)

    if(!this.transition) this.show()
  }

  /*
    CREATE.
  */

  createElements()
  {
    this.gallery_element = document.querySelector('.gallery__media')
    this.gallery_wrapper = document.querySelector('.gallery__wrapper')

    this.images = document.querySelectorAll('img.gallery__media__div__figure__image')
    this.links = document.querySelectorAll('.gallery__media__div')

    this.back_button = document.querySelector('.gallery__back__button')

    this.modal = document.querySelector('.gallery__modal')
    this.modal_image = document.querySelector('.gallery__modal__selected__figure__image')
    this.modal_close = document.querySelector('.gallery__modal__close__button')

    this.length = this.images.length
  }

  createConfig()
  {
    this.back_pressed = false
    this.faded = false
    this.enlarged = false

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      speed: 0.1,
      ease: 0.05
    }
  }

  createGallery()
  {
    this.elements = Array.from(this.images, 
      (element, index) =>
    {
      return new Element({
        element,
        index,
        bgTMap: this.bgTMap,
        link: this.links[index],
        geometry: this.geo,
        length: this.length,
        scene: this.group,
        screen: this.screen,
        viewport: this.viewport
      })
    })
  }

  createLinkListeners()
  {
    this.links.forEach(
      (link, index) =>
    {
      link.onclick = () =>
      {
        this.hide()
        this.enlarge(index)
      }
    })
  }

  /*
    ANIMATIONS.
  */

  show(transition=false)
  {
    this.elements.forEach( element => { element.show(transition) })
  }

  hide()
  {
    this.elements.forEach( element => { element.hide() })
  }

  enlarge(index)
  {
    this.enlarged = true

    this.modal_image.src = this.elements[index].texture.image.src
    this.modal_image.alt = this.elements[index].texture.image.alt

    this.modal.style.display = 'block'

    gsap.to(this.back_button,
    {
      opacity: 0.0
    })

    gsap.to([
      this.modal,
      this.modal_image
    ],
    {
      opacity: 1.0,
      duration: .5,
    })

    this.modal_close.onclick = () =>
    {
      gsap.to([
        this.modal,
        this.modal_image
      ],
      {
        opacity: 0.0,
        duration: .5,
        onComplete: () =>
        {
          this.modal.style.display = 'none'
          this.show()

          gsap.to(
            this.back_button,
          {
            opacity: 1.0,
            duration: 0.5
          })

          this.enlarged = false
        }
      })
    }
  }

  fadeIn()
  {
    this.faded = false

    gsap.to([
      '.gallery__info__title',
      '.gallery__info__desc'
    ],
    {
      opacity: 1.0,
      duration: 1.0,
    })
  }

  fadeOut()
  {
    this.faded = true

    gsap.to([
      '.gallery__info__title',
      '.gallery__info__desc'
    ],
    {
      opacity: 0.1,
      duration: 1.0,
    })
  }

  /*
    EVENTS.
  */

  onResize()
  {
    this.full_bounds = this.gallery_wrapper.getBoundingClientRect()

    this.elements.forEach( element => 
    {
      element.onResize(
      {
        screen: this.screen,
        viewport: this.viewport,
      })
    })

    this.scroll.limit = this.full_bounds.width - this.elements[0].bounds.width
  }

  onTouchDown({ y })
  {
    if(this.enlarged) return
    if(this.transition && !this.transition.finished) return

    this.scroll.position = this.scroll.current
  }

  onTouchMove({ y, x })
  {
    if(this.enlarged) return
    if(this.tranistion && !this.transition.finished) return

    const x_dist = x.start - x.end
    const y_dist = y.start - y.end

    const dist = x_dist + y_dist

    this.scroll.target = this.scroll.position - dist
  }

  onTouchUp({ y })
  {

  }

  onWheel({ pixelY, pixelX })
  {
    if(this.enlarged) return
    if(this.transition && !this.transition.finished) return

    this.scroll.target -= pixelX * 0.6
    this.scroll.target -= pixelY * 0.6
  }

  /*
    UPDATE.
  */

  update()
  {
    this.scroll.target = gsap.utils.clamp(-this.scroll.limit, 0, this.scroll.target)
    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.ease)

    this.gallery_element.style[this.t_prefix] = `translateX(${this.scroll.current}px)`

    this.elements.forEach( element => { element.update(this.scroll.current, this.scroll.last) })

    this.scroll.last = this.scroll.current

    if(this.scroll.current < -50)
    {
      if(!this.faded) this.fadeOut()
    }
    else
    {
      if(this.faded) this.fadeIn()
    }
  }

  /*
    DESTROY.
  */

  destroy()
  {
    this.scene.remove(this.group)
  }
}

