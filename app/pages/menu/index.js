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
        marquee: '.menu__title',
        marquee_title: '.menu__title__text', 
        right: '.menu__right', 
        menu_images: '.menu__gallery__image', 
        menu_links: '.menu__gallery__image__link', 
        menu_image_type: '.menu__gallery__image__type__text',
        menu_image_index: '.menu__gallery__image__index__text', 
        menu_image_title: '.menu__gallery__image__title__text', 
        menu_left_lines: 'span.menu__gallery__image__left', 
        menu_right_lines: 'span.menu__gallery__image__right', 
        nav: '.navigation__logo' 
      },
      background: COLOR_NIGHT, 
      color: COLOR_CULTURED, 
      device: device
    })
  }

  /*
    CREATE.
  */

  create()
  {
    super.create()

    this.menu = {
      ready: false,
      animations: {
        links: [],
        type: [],
        index: [],
        title: [],
        left_lines: [],
        right_lines: [],
      }
    }
    
    this.createBounds()
    this.createMotion()
    this.createMenuInteraction()
  }

  createBounds()
  {
    let nav_bounds = this.elements.nav.getBoundingClientRect()
    let calc = window.innerHeight - nav_bounds.height

    this.elements.marquee.style.height = `${calc}px`

    if(this.elements.right)
      this.elements.right.style.height = `${calc - nav_bounds.height}px`
  }

  createMenuInteraction()
  {
    this.elements.menu_image_title.forEach(
      (t, idx) => 
      {
        this.menu.animations.left_lines.push(
          new Line(
            this.elements.menu_left_lines[idx]
          )
        )
  
        this.menu.animations.right_lines.push(
          new Line(
            this.elements.menu_right_lines[idx]
          )
        )

        this.menu.animations.title.push(new Show(t))

        if(this.device.desktop)
        {
          this.menu.animations.type.push(new Show(this.elements.menu_image_type[idx]))
          this.menu.animations.index.push(new Show(this.elements.menu_image_index[idx]))
        }
      }
    )
  }

  createMotion()
  {
    this.showMarquee = gsap.fromTo(
      this.elements.marquee,
      {
        x: '-100%',
      },
      {
        x: '0',
        duration: 1.0,
        ease: 'power2.inOut',
        paused: true,
        onComplete: () =>
        {
          this.menu.ready = true
        }
      }
    )

    verticalLoop(
      this.elements.marquee_title, 
    {
      repeat: -1, 
      speed: 0.5,
      paused: false, 
      center: true, 
      draggable: false,
      inertia: false
    })
    
    if(this.elements.right)
    {
      this.showRightTitles = gsap.fromTo(
        this.elements.right,
        {
          x: '100%',
        },
        {
          x: '0',
          duration: 1.0,
          ease: 'power2.inOut',
          paused: true
        }
      )
    }
  }

  createMotionElement(element)
  {
    let showLink = gsap.fromTo(
      element, 
      {
        opacity: 0, 
      }, 
      {
        opacity: 1.0, 
        paused: true
      }
    )

    this.menu.animations.links.push(showLink)
  }

  /*
    EVENTS.
  */

  onMouseEnter(element, idx)
  {
    if(!this.menu.ready)
    {
      element.style.cursor = 'default'
    }
    else 
    {
      element.style.cursor = 'pointer'

      this.menu.animations.links[idx].play()
      this.menu.animations.left_lines[idx].show()
      this.menu.animations.right_lines[idx].show()
      this.menu.animations.type[idx].show()
      this.menu.animations.index[idx].show()
      this.menu.animations.title[idx].show()
    }

  }

  onMouseLeave(idx)
  {   
    this.menu.animations.left_lines[idx].hide()
    this.menu.animations.right_lines[idx].hide()
    this.menu.animations.type[idx].hide()
    this.menu.animations.index[idx].hide()
    this.menu.animations.title[idx].hide()
  }

  onLeave()
  {
    this.menu.ready = false 
    
    this.elements.menu_links.forEach(
      (link, idx) =>
      {
        link.style.cursor = 'default'

        this.menu.animations.links[idx].reverse()

        this.menu.animations.title[idx].hide()
        
        if(this.device.desktop)
        {
          this.menu.animations.left_lines[idx].hide()
          this.menu.animations.right_lines[idx].hide()
          this.menu.animations.type[idx].hide()
          this.menu.animations.index[idx].hide()
        }
      }
    )
  }

  /*
    SHOW // HIDE - ANIMATIONS.
  */

  show()
  {
    super.show()
    this.showMarquee.play()

    if(window.innerWidth<=500) 
    {
      this.showRightTitles.play()
        .eventCallback(
          'onComplete', () => 
          {
            this.menu.animations.title.forEach(
              t => 
              {
                t.show()
              }
            )
          }
        )
    }
    else if(this.device.tablet)
    {
      this.menu.animations.title.forEach(
        t => 
        {
          t.show()
        }
      )
    }
  }

  hide()
  {
    super.hide(true)

    this.onLeave()

    return new Promise(resolve =>
    {

      this.showMarquee.reverse()
        .eventCallback(
          'onReverseComplete', 
          () => 
          {
            if(window.innerWidth<=500) 
              this.showRightTitles.reverse()

            gsap.delayedCall(0.2, () => { resolve() } ) 
          } 
        )
    })
  }

  /* 
    EVENTLISTENERS. 
  */

  addEventListeners()
  {
    super.addEventListeners()

    this.elements.menu_links.forEach(
      (link, idx) =>
      {
        this.createMotionElement(link)

        if(this.device.desktop)
        {
          link.addEventListener('mouseenter', this.onMouseEnter.bind(this, link, idx))
          link.addEventListener('mouseleave', this.onMouseLeave.bind(this, idx))
        }
      }
    )
  }

  removeEventListeners()
  {
    super.removeEventListeners()

    this.elements.menu_links.forEach(
      link =>
      {
        if(this.device.desktop)
        {
          link.removeEventListener('mouseenter', this.onMouseEnter)
          link.removeEventListener('mouseleave', this.onMouseLeave)
        }
      }
    )
  }
}
