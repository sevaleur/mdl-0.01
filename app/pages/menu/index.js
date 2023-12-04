import gsap from 'gsap'

import Page from 'classes/Page'
import Show from 'animations/Show'
import Line from 'animations/Line'

import { COLOR_CULTURED, COLOR_NIGHT } from 'utils/color_variables'
import { verticalLoop } from 'utils/HelperFunctions'

export default class Menu extends Page
{
  constructor({ device })
  {
    super({
      id: 'menu',
      element: '.menu',
      elements: {
        title: '.menu__title__text'
      },
      background: COLOR_NIGHT, 
      color: COLOR_CULTURED
    })

    this.device = device 
    this.ready = false
  }

  /*
    CREATE.
  */

  create()
  {
    super.create()
    this.createElements()
  }

  createElements()
  {
    this.marquee = document.querySelector('.menu__title')
    this.marqueeContent = document.querySelectorAll('.menu__title__text')

    this.images = document.querySelectorAll('.menu__gallery__image')
    this.image_link_elements = document.querySelectorAll('.menu__gallery__image__link')

    const TYPE = document.querySelectorAll('.menu__gallery__image__type__text')
    const INDEX = document.querySelectorAll('.menu__gallery__image__index__text')
    const TITLE = document.querySelectorAll('.menu__gallery__image__title__text')

    let nav = document.querySelector('.navigation__logo')
    let nav_bounds = nav.getBoundingClientRect()

    this.createMarquee(nav_bounds)
    this.createMotion()
    this.createText(TYPE, INDEX, TITLE)
    this.onLoadedLoop()
    this.onHover()
  }

  createMarquee(bounds)
  {
    let calc = window.innerHeight - bounds.height
    this.marquee.style.height = `${calc}px`
  }

  createMotion()
  {
    this.showMarquee = gsap.fromTo(
      this.marquee,
      {
        x: '-100%',
      },
      {
        x: '0',
        duration: 1.0,
        ease: 'power2.inOut',
        onComplete: () =>
        {
          this.ready = true
        }
      }
    )
  }

  createText(TYPE, INDEX, TITLE)
  {
    this.type = []
    this.index = []
    this.title = []
    this.leftLines = []
    this.rightLines = []

    TITLE.forEach(
      (t, i) => 
      {
        this.title.push(new Show(t))
        this.type.push(new Show(TYPE[i]))
        this.index.push(new Show(INDEX[i]))
      }
    )
  }

  /*
    EVENTS.
  */

  onLoadedLoop()
  {
    verticalLoop(
      this.marqueeContent, 
    {
      repeat: -1, 
      duration: 5.0,
      paused: false, 
      center: true, 
      draggable: false,
      inertia: false
    })
  }

  onHover()
  {
    this.image_link_elements.forEach(
      (link, index) =>
    {
      gsap.set(
        link,
        {
          opacity: 0.0
        }
      )

      this.leftLines.push(new Line(
        this.images[index].querySelector('span.menu__gallery__image__left'))
      )

      this.rightLines.push(new Line(
        this.images[index].querySelector('span.menu__gallery__image__right'))
      )

      link.onmouseenter = () =>
      {
        if(!this.ready)
          link.style.cursor = 'default'

        if(this.ready)
        {
          link.style.cursor = 'pointer'

          gsap.to(
            link,
            {
              opacity: 1.0
            }
          )
          
          this.leftLines[index].show()
          this.rightLines[index].show()
          this.type[index].show()
          this.index[index].show()
          this.title[index].show()
        }
      }

      link.onmouseleave = () =>
      {
        this.leftLines[index].hide()
        this.rightLines[index].hide()
        this.type[index].hide()
        this.index[index].hide()
        this.title[index].hide()
      }
    })
  }

  onLeave()
  {
    this.ready = false
    
    this.image_link_elements.forEach(
      (link, index) =>
    {
      link.style.cursor = 'default'

      gsap.to(
        link,
        {
          opacity: 0.0
        }
      )

      link.onmouseover = null
      link.onmouseleave = null

      this.leftLines[index].hide()
      this.rightLines[index].hide()
      this.type[index].hide()
      this.index[index].hide()
      this.title[index].hide()
    })

    this.leftLines = null 
    this.rightLines = null
    this.type = null
    this.index = null
    this.title = null
  }

  /*
    SHOW // HIDE - ANIMATIONS.
  */

  show()
  {
    super.show()
    this.showMarquee.play()

    if(this.device.tablet || this.device.mobile)
    {
      this.title.forEach(
        (t, index) => 
        {
          this.leftLines[index].show()
          this.rightLines[index].show()
          this.type[index].show()
          this.index[index].show()
          this.title[index].show()
        }
      )
    }
  }

  hide()
  {
    super.hide(true)

    return new Promise(resolve =>
    {
      this.onLeave()
      this.showMarquee.reverse()
        .eventCallback(
          'onReverseComplete', 
          () => 
          { 
            gsap.delayedCall(0.2, () => { resolve() } ) 
          } 
        )
    })
  }
}
