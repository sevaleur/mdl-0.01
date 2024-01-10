import gsap from 'gsap'

import Page from 'classes/Page'
import Show from 'animations/Show'
import Hover from 'animations/Hover'
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
        desktop_right: '.menu__right__desktop', 
        phone_right: '.menu__right__phone', 
        menu_images: '.menu__gallery__image', 
        menu_links: '.menu__gallery__image__link', 
        menu_image_type: '.menu__right__desktop__type__text',
        menu_desktop_images: '.menu__right__desktop__images',
        menu_image_objects: '.menu__right__desktop__object',
        menu_image_index: '.menu__right__desktop__index__text', 
        menu_image_zero: '.menu__right__desktop__index__zero', 
        menu_image_title: '.menu__right__desktop__title__text', 
        menu_image_length: '.menu__right__desktop__length__text',
        menu_image_photos: '.menu__right__desktop__length__photos',
        menu_top_lines: 'span.menu__gallery__image__top', 
        menu_bottom_lines: 'span.menu__gallery__image__bottom', 
        menu_right_lines: 'span.menu__gallery__image__right', 
        menu_left_lines: 'span.menu__gallery__image__left', 
        menu_phone_titles: '.menu__right__phone__title',
        menu_phone_title_text: '.menu__right__phone__title__text',
        nav_logo: '.navigation__logo',
        nav_menu: '.navigation__menu' 
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
      aIdx: 0,
      fIdx: null, 
      animations: {
        links: [],
        length: [],
        index: [],
        title: [],
        top_lines: [],
        bottom_lines: [],
        right_lines: [], 
        left_lines: []
      }
    }
    
    this.createBounds()
    this.createAnimations()
    this.createMenuInteraction()
  }

  createBounds()
  {
    let logo_bounds = this.elements.nav_logo.getBoundingClientRect()
    let menu_bounds = this.elements.nav_menu.getBoundingClientRect()

    let calcDesktop = window.innerHeight - logo_bounds.height
    let calcPhone = window.innerHeight - menu_bounds.height
    
    this.elements.marquee.style.height = `${calcDesktop}px`

    if(this.device.desktop)
    {
      this.elements.right.style.width = `${menu_bounds.width}px`
    }
    else
    {
      this.elements.right.style.height = `${calcPhone - menu_bounds.height}px`
    }
  }

  createMenuInteraction()
  {
    if(this.device.desktop || this.device.tablet)
    {
      this.elements.menu_image_title.forEach(
        (t, idx) => 
        {
          this.elements.menu_image_zero[idx].style.visibility = 'hidden'

          if(this.elements.menu_image_photos)
            this.elements.menu_image_photos[idx].style.visibility = 'hidden'

          this.menu.animations.top_lines.push(
            new Line(
              this.elements.menu_top_lines[idx],
              false
            )
          )

          this.menu.animations.right_lines.push(
            new Line(
              this.elements.menu_right_lines[idx],
              true, 
              0.06
            )
          )

          this.menu.animations.left_lines.push(
            new Line(
              this.elements.menu_left_lines[idx],
              true, 
              0.06
            )
          )
    
          this.menu.animations.bottom_lines.push(
            new Line(
              this.elements.menu_bottom_lines[idx],
              false
            )
          )
  
          this.menu.animations.title.push(
            new Hover(t)
          )
  
          this.menu.animations.length.push(
            new Hover(
              this.elements.menu_image_length[idx]
            )
          )
  
          this.menu.animations.index.push(
            new Hover(
              this.elements.menu_image_index[idx]
            )
          )
        }
      )
    }
    else 
    {
      this.elements.menu_phone_titles.forEach(
        t => 
        {
          this.menu.animations.title.push(
            new Show(
              t
            )
          )
        }
      )
    }
  }

  createAnimations()
  {
    super.createAnimations(false)

    document.fonts.ready.then(
      (fontFaceSet) => 
      {
        verticalLoop(
          this.elements.marquee_title, 
        {
          repeat: -1, 
          paddingBottom: 20,
          speed: 0.25,
        })
      }
    )
    
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
      }
    )
  
    this.showRightTitles = gsap.fromTo(
      this.elements.right,
      {
        x: '110%',
      },
      {
        x: '0',
        duration: 1.0,
        ease: 'power2.inOut',
        paused: true
      }
    )
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

      if(idx !== this.menu.aIdx)
      {
        this.menu.fIdx = this.menu.aIdx

        if(this.menu.fIdx !== null)
        {
          this.menu.animations.top_lines[this.menu.fIdx].hide(false)
          this.menu.animations.bottom_lines[this.menu.fIdx].hide(false)
          this.menu.animations.left_lines[this.menu.fIdx].hide(true)
          this.menu.animations.right_lines[this.menu.fIdx].hide(true)
          this.menu.animations.index[this.menu.fIdx].hide()
          this.menu.animations.length[this.menu.fIdx].hide()
          this.menu.animations.title[this.menu.fIdx].hide()

          if(this.elements.menu_desktop_images)
          {
            this.elements.menu_desktop_images[this.menu.fIdx].childNodes.forEach(
              (child, idx) => 
              {
                gsap.to(
                  child,
                  {
                    opacity: 0.0, 
                    xPercent: 50 * 5,
                    yPercent: 10 * -idx,
                    zIndex: -idx,
                    duration: 1.0, 
                    ease: 'power2.inOut', 
                    onComplete: () => 
                    {
                      this.elements.menu_desktop_images[this.menu.fIdx].style.display = 'none'
                    }
                  }
                )
              }
            )
          }
        }

        if(this.elements.menu_desktop_images)
        {
          this.elements.menu_desktop_images[idx].style.display = 'flex'
          this.elements.menu_desktop_images[idx].childNodes.forEach(
            (child, idx) => 
            {
              gsap.set(
                child, 
                {
                  xPercent: 0,
                  opacity: 0.0,
                  zIndex: -idx
                }
              )

              gsap.to(
                child,
                {
                  opacity: 1.0, 
                  xPercent: 50 * idx,
                  yPercent: 10 * -idx,
                  duration: 1.0, 
                  ease: 'power2.inOut', 
                }
              )
            }
          )
        }

        this.menu.animations.links[idx].play()
        this.menu.animations.top_lines[idx].show(false)
        this.menu.animations.left_lines[idx].show(true)
        this.menu.animations.right_lines[idx].show(true)
        this.menu.animations.bottom_lines[idx].show(false)
        this.menu.animations.index[idx].show()
        this.menu.animations.length[idx].show()
        this.menu.animations.title[idx].show()


        this.menu.aIdx = idx
      }
    }
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
          this.menu.animations.top_lines[idx].hide(false)
          this.menu.animations.bottom_lines[idx].hide(false)
          this.menu.animations.left_lines[idx].hide(true)
          this.menu.animations.right_lines[idx].hide(true)
          this.menu.animations.index[idx].hide()
          this.menu.animations.length[idx].hide()

          if(this.elements.menu_desktop_images)
          {
            this.elements.menu_desktop_images[idx].childNodes.forEach(
              (child, idx) => 
              {
                gsap.to(
                  child,
                  {
                    opacity: 0.0, 
                    xPercent: 50 * 5,
                    yPercent: 10 * -idx,
                    duration: 1.0, 
                    ease: 'power2.inOut', 
                    onComplete: () => 
                    {
                      this.elements.menu_desktop_images[idx].style.display = 'none'
                    }
                  }
                )
              }
            )
          }
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

    if(!this.device.desktop) 
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
    else 
    {
      this.showRightTitles.play()
        .eventCallback('onComplete', () => 
        {
          this.menu.ready = true
          this.elements.menu_image_zero[0].style.visibility = 'visible'

          if(this.elements.menu_image_photos)
            this.elements.menu_image_photos[0].style.visibility = 'visible'

          if(this.elements.menu_desktop_images)
          {
            this.elements.menu_desktop_images[this.menu.aIdx].style.display = 'flex'
            this.elements.menu_desktop_images[this.menu.aIdx].childNodes.forEach(
              (child, idx) => 
              {
                gsap.set(
                  child, 
                  {
                    xPercent: 0,
                    opacity: 0.0,
                    zIndex: -idx
                  }
                )
  
                gsap.to(
                  child,
                  {
                    opacity: 1.0, 
                    xPercent: 50 * idx,
                    yPercent: 10 * -idx,
                    duration: 1.0, 
                    ease: 'power2.inOut', 
                  }
                )
              }
            )
          }
          
          this.menu.animations.links[this.menu.aIdx].play()
          this.menu.animations.top_lines[this.menu.aIdx].show(false)
          this.menu.animations.bottom_lines[this.menu.aIdx].show(false)
          this.menu.animations.left_lines[this.menu.aIdx].show(true)
          this.menu.animations.right_lines[this.menu.aIdx].show(true)
          this.menu.animations.index[this.menu.aIdx].show()
          this.menu.animations.length[this.menu.aIdx].show()
          this.menu.animations.title[this.menu.aIdx].show()
        })
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
        }
      }
    )
  }
}
