import { Group } from 'three'
import gsap from 'gsap'

import Prefix from 'prefix'

import Element from './Element'
import Show from 'animations/Show'

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
    this.createAnimations()
    this.createConfig()
    this.createGallery()
    this.onResize()

    this.createLinkListeners()
    this.onBack()

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
    this.gallery_scroll_title = document.querySelector('.gallery__title__text')
    this.gallery_scroll = document.querySelector('.gallery__title')

    this.images = document.querySelectorAll('img.gallery__media__div__figure__image')
    this.links = document.querySelectorAll('.gallery__media__div')
    this.title = document.querySelector('.gallery__info__title')
    this.desc = document.querySelector('.gallery__info__desc')

    this.back_button = document.querySelector('.gallery__back')

    this.modal = document.querySelector('.gallery__modal')
    this.modal_image = document.querySelector('.gallery__modal__selected__figure__image')
    this.modal_selected = document.querySelector('.gallery__modal__selected')
    this.modal_images = document.querySelector('.gallery__modal__images')
    this.modal_close_mobile = document.querySelector('.gallery__modal__text')
    this.close = document.querySelector('.gallery__modal__selected__text__close')


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
        this.enlarge(index)
        this.onModalHide()
      }
    })
  }

  createAnimations()
  {
    if(this.screen.desktop)
    {
      this.show_close = gsap.fromTo(
        this.close, 
        {
          scale: 0,
        }, 
        {
          scale: 1.0,
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )

      this.text = gsap.to([
        this.title,
        this.desc
      ],
      {
        opacity: 0.0,
        paused: true
      })

      this.titleSwitch = gsap.fromTo(
        this.gallery_scroll, 
        {
          scaleX: 0.0
        }, 
        {
          scaleX: 1.0, 
          transformOrigin: 'left',
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )

      this.onTitleSwitch = new Show(this.gallery_scroll_title)
    }
    else 
    {
      this.text = gsap.to([
        this.title,
        this.desc
      ],
      {
        opacity: 0.1,
        duration: 0.5,
        paused: true
      })

      this.onModalMobile = gsap.fromTo(
        this.modal_close_mobile, 
        {
          xPercent: 100
        }, 
        {
          xPercent: 0, 
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )
    }

    this.onModal = gsap.to(
      this.modal,
    {
      opacity: 1.0,
      duration: .5,
      paused: true,
    })

    this.onModalSelect = gsap.fromTo(
      this.modal_image, 
      {
        scale: 0.0,
        opacity: 0.0
      },
      {
        scale: 1.0, 
        opacity: 1.0,
        duration: 0.8, 
        ease: 'power2.inOut', 
        paused: true
      }
    )

    this.onModalShow = gsap.fromTo(
      this.modal_images, 
      {
        yPercent: 100
      },
      {
        yPercent: 0, 
        duration: 0.8, 
        ease: 'power2.inOut', 
        paused: true
      }
    )
  }

  /*
    ANIMATIONS.
  */

  onBack()
  {
    this.back_button.addEventListener('click', () => { this.hide() })
  }

  onModalHide()
  {
    this.elements.forEach( element => { element.hide() })
  }

  show(transition=false)
  {
    this.elements.forEach( element => { element.show(transition) })
  }

  hide()
  {
    this.elements.forEach( element => { element.hide() })

    if(this.screen.desktop && !this.enlarged)
    {
      this.titleSwitch.reverse()
      this.onTitleSwitch.hide()
    }

    if(this.enlarged)
    {
      this.onModalSelect.reverse()

      if(this.screen.desktop)
      {
        this.show_close.reverse()
        this.titleSwitch.reverse()
      }

      if(this.screen.tablet || this.screen.mobile)
        this.onModalMobile.reverse()

      this.onModalShow.reverse().eventCallback('onReverseComplete', () => 
      {
        this.onModal.reverse().eventCallback('onReverseComplete', () => 
        {
          this.modal.style.display = 'none'
          this.enlarged = false
        })
      })
    }
  }

  enlarge(index)
  {
    this.enlarged = true

    this.modal_image.src = this.elements[index].texture.image.src
    this.modal_image.alt = this.elements[index].texture.image.alt

    this.modal.style.display = 'grid'

    this.onModal.play()
    this.onModalSelect.play()

    if(this.screen.desktop)
      this.show_close.play()
    
    if(this.screen.tablet || this.screen.mobile)
      this.onModalMobile.play()

    this.onModalShow.play()

    this.modal_selected.onclick = () =>
    {
      this.onModalSelect.reverse()

      if(this.screen.desktop)
        this.show_close.reverse()

      if(this.screen.tablet || this.screen.mobile)
        this.onModalMobile.reverse()

      this.onModalShow.reverse().eventCallback('onReverseComplete', () => 
      {
        this.onModal.reverse().eventCallback('onReverseComplete', () => 
        {
          this.modal.style.display = 'none'
          this.show()
          this.enlarged = false
        })
      })

    }

    if(this.screen.tablet || this.screen.mobile)
    {
      this.modal_close_mobile.onclick = () =>
      {
        this.onModalSelect.reverse()
  
        if(this.screen.tablet || this.screen.mobile)
          this.onModalMobile.reverse()
  
        this.onModalShow.reverse().eventCallback('onReverseComplete', () => 
        {
          this.onModal.reverse().eventCallback('onReverseComplete', () => 
          {
            this.modal.style.display = 'none'
            this.show()
            this.enlarged = false
          })
        })
  
      }
    }
  }

  fadeIn()
  {
    this.faded = false
    this.text.reverse()

    if(this.screen.desktop)
    {
      this.titleSwitch.reverse()
      this.onTitleSwitch.hide()
    }
  }

  fadeOut()
  {
    this.faded = true
    this.text.play()

    if(this.screen.desktop)
    {
      this.titleSwitch.play()
        .eventCallback(
          'onComplete', () => { this.onTitleSwitch.show() })
    }
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

