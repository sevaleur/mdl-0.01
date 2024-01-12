import { Group } from 'three'
import gsap from 'gsap'

import Prefix from 'prefix'

import Element from './Element'
import Show from 'animations/Show'

export default class Gallery
{
  constructor({ scene, screen, viewport, geo, transition })
  {
    this.id = 'gallery'

    this.scene = scene
    this.screen = screen
    this.viewport = viewport
    this.geo = geo
    this.transition = transition

    this.group = new Group()

    this.t_prefix = Prefix('transform')

    this.createElements()
    this.createAnimations()
    this.createConfig()
    this.createGallery()
    this.createBackListener()
    this.onResize()

    this.scene.add(this.group)

    if(!this.transition) this.show(false)
  }

  /*
    CREATE.
  */

  createElements()
  {
    this.gallery_element = document.querySelector('.gallery__media')
    this.gallery_wrapper = document.querySelector('.gallery__wrapper')
    this.gallery_scroll_title = document.querySelector('.gallery__title__text')
    this.gallery_scroll = document.querySelector('.gallery__title')

    this.images = document.querySelectorAll('img.gallery__media__div__figure__image')
    this.links = document.querySelectorAll('.gallery__media__div')
    this.back = document.querySelector('.gallery__back')
    this.info = document.querySelector('.gallery__info')

    this.length = this.images.length
  }

  createConfig()
  {
    this.faded = false
    this.enlarged = false

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      speed: 0.1,
      ease: 0.05,
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
        link: this.links[index],
        geometry: this.geo,
        length: this.length,
        scene: this.group,
        screen: this.screen,
        viewport: this.viewport
      })
    })
  }

  createAnimations()
  {
    if(this.screen.desktop)
    {
      this.titleSwitch = gsap.fromTo(
        this.gallery_scroll, 
        {
          yPercent: -100,
          opacity: 0.0,
        }, 
        {
          yPercent: 0,
          opacity: 1.0,
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )

      this.infoFade = gsap.fromTo(
        this.info,
        {
          xPercent: -110,
          yPercent: -50,
        },
        {
          xPercent: 0,
          yPercent: -50,
          duration: 1.0, 
          ease: 'power2.inOut',
          paused: true
        }
      )

      this.onTitleSwitch = new Show(this.gallery_scroll_title)
    }
  }

  createBackListener()
  {
    this.back.addEventListener('click', () => { this.hide() } )
  }

  /*
    ANIMATIONS.
  */

  show(transition=false)
  {
    if(this.screen.desktop)
      this.infoFade.play()

    this.elements.forEach( element => { element.show(transition) })
  }

  hide()
  {
    this.elements.forEach( element => { element.hide() })

    if(this.screen.desktop)
    {
      this.infoFade.reverse()

      if(!this.enlarged)
      {
        this.titleSwitch.reverse()
        this.onTitleSwitch.hide()
      }
    }
  }

  /*
    EVENTS.
  */

  onFadeIn()
  {
    this.faded = false

    if(this.screen.desktop)
    {
      this.infoFade.play()
      this.titleSwitch.reverse()
      this.onTitleSwitch.hide()
    }
  }

  onFadeOut()
  {
    this.faded = true

    if(this.screen.desktop)
    {
      this.infoFade.reverse()
      this.titleSwitch.play()
        .eventCallback(
          'onComplete', () => { this.onTitleSwitch.show() })
    }
  }


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
    if(this.transition && !this.transition.finished) return

    const dist = y.start - y.end

    
    this.scroll.target = this.scroll.position - dist * 1.25
  }

  onTouchUp({ y })
  {
    if(this.enlarged) return
    if(this.transition && !this.transition.finished) return
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

    if(this.scroll.current > -0.01)
      this.scroll.current = 0

    this.elements.forEach( element => { element.update(this.scroll.current, this.scroll.last) })

    this.scroll.last = this.scroll.current

    if(this.scroll.current < -50)
    {
      if(!this.faded) this.onFadeOut()
    }
    else
    {
      if(this.faded) this.onFadeIn()
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

