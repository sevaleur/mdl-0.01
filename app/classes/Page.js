import gsap from 'gsap'

import each from 'lodash/each'
import map from 'lodash/map'

import Prefix from 'prefix'

import Title from 'animations/Observer/Title'
import Paragraph from 'animations/Observer/Paragraph'
import Label from 'animations/Observer/Label'
import Vertical from 'animations/Observer/Vertical'

import AsyncLoad from 'classes/AsyncLoad'
import ColorManager from 'classes/Colors'

export default class Page
{
  constructor({ element, elements, id, background, color, device })
  {
    this.selector = element
    this.selectorChildren = {
      ...elements,
      animationTitles: `[data-animation="title"]`,
      animationParagraphs: `[data-animation="paragraph"]`,
      animationLabel: `[data-animation="label"]`,
      animationVertical: `[data-animation="vertical"]`,
      images: `[data-src]`
    }

    this.background = background
    this.color = color
    this.device = device
    this.id = id
    
    this.colorManager = new ColorManager({ device: this.device })
    this.transform_prefix = Prefix('transform')
  }

  /*
    Create.
  */

  create()
  {
    this.element = document.querySelector(this.selector)
    this.elements = {}

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0
    }

    this.touch = {
      y: {
        start: 0,
        distance: 0,
        end: 0
      }
    }

    this.coord = {
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2,
      vX: 0, 
      vY: 0,
      pX: 0, 
      pY: 0,
    }

    each(this.selectorChildren, (entry, key) =>
    {
      if(entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry))
      {
        this.elements[key] = entry
      }
      else
      {
        this.elements[key] = document.querySelectorAll(entry)

        if(this.elements[key].length === 0)
        {
          this.elements[key] = null
        }
        else if(this.elements[key].length === 1)
        {
          this.elements[key] = document.querySelector(entry)
        }
      }
    })

    this.createAnimations()
    this.preloadImages()
  }

  /*
    ANIMATIONS.
  */

  createAnimations()
  {
    this.animations = []

    /*
      TITLES.
    */

    this.animationTitles = map(this.elements.animationTitles, element =>
    {
      return new Title({
        element
      })
    })

    this.animations.push(...this.animationTitles)

    /*
      PARAGRAPHS.
    */

    this.animationParagraphs = map(this.elements.animationParagraphs, element =>
    {
      return new Paragraph({
        element
      })
    })

    this.animations.push(...this.animationParagraphs)

    /*
      LABELS.
    */

    this.animationLabel = map(this.elements.animationLabel, element =>
    {
      return new Label({
        element
      })
    })

    this.animations.push(...this.animationLabel)

    /*
      VERT TEXT.
    */

    this.animationVertical = map(this.elements.animationVertical, element =>
    {
      return new Vertical({
        element
      })
    })

    this.animations.push(...this.animationVertical)

  }

  /*
    PAGE ANIMATION.
  */

  preloadImages()
  {
    this.images = map(this.elements.images, element =>
    {
      return new AsyncLoad({ element })
    })
  }

  show()
  {
    return new Promise(
      resolve =>
    {
      this.colorManager.change({
        backgroundColor: this.background,
        color: this.color
      })

      this.animateIn = gsap.timeline()

      this.animateIn.fromTo(
        this.element,
      {
        autoAlpha: 0
      },
      {
        autoAlpha: 1,
        onComplete: resolve
      })

      this.animateIn.call(
        () =>
      {
        this.addEventListeners()

        resolve()
      })
    })
  }

  hide(animation = false)
  {
    if(!animation)
    {
      return new Promise(
        resolve =>
      {
        this.removeEventListeners()

        this.animateOut = gsap.timeline()

        this.animateOut.to(this.element,
        {
          autoAlpha: 0,
          onComplete: resolve
        })
      })
    }
  }

  /*
    EVENTS.
  */

  onTouchDown(e)
  {
    this.isDown = true

    this.touch.y.start = e.touches ? e.touches[0].clientY : e.clientY

    this.scroll.position = this.scroll.current
  }

  onTouchMove(e)
  {
    if(!this.isDown) return

    const y = e.touches ? e.touches[0].clientY : e.clientY

    this.touch.y.end = y

    const y_dist = this.touch.y.start - this.touch.y.end
    this.scroll.target = this.scroll.position + y_dist
  }

  onTouchUp(e)
  {
    this.isDown = false
  }

  onWheel({ pixelY })
  {
    this.scroll.target += pixelY
  }

  onMove({ clientX, clientY })
  {
    this.coord.x = clientX
    this.coord.y = clientY

    this.coord.vX = this.coord.x - this.coord.pX
    this.coord.vY = this.coord.y - this.coord.pY

    this.coord.pX = this.coord.x 
    this.coord.pY = this.coord.y 
  }

  onResize()
  {
    if(this.elements.wrapper)
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight

    each(this.animations, animation => animation.onResize())
  }

  /*
    UPDATE.
  */

  update()
  {
    this.scroll.target = gsap.utils.clamp(0, this.scroll.limit, this.scroll.target)
    this.scroll.current = gsap.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    if(this.scroll.current < 0.01)
      this.scroll.current = 0
    
    if(this.elements.wrapper)
      this.elements.wrapper.style[this.transform_prefix] = `translateY(-${this.scroll.current}px)`
  }

  /*
    LISTENERS.
  */

  addEventListeners()
  {

  }

  removeEventListeners()
  {

  }

}
