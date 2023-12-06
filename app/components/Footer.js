import Component from "classes/Component"
import Direction from 'animations/Direction'

import gsap from 'gsap'

export default class Footer extends Component
{
  constructor({ template, device })
  {
    super({
      element: '.footer',
      elements:
      {
        contact: '.footer__contact'
      }
    })

    this.template = template
    this.device = device

    this.clicked = false
    this.mouseOver = false

    this.createElements()
  }

  /*
    CREATE.
  */

  createElements()
  {
    const FOOTER = document.querySelector('.footer')
    const TITLES = document.querySelector('.footer__title')
    const CONNECT = document.querySelector('.footer__title__text')
    const EXPAND = document.querySelector('.footer__title__expand')
    const CLOSE = document.querySelector('.footer__title__close')
    const FB = FOOTER.getBoundingClientRect()
    
    this.media = document.querySelectorAll('.footer__icons__media')
    this.top = document.querySelector('.footer__top')
    this.btm = document.querySelector('.footer__btm')

    this.con = new Direction(CONNECT)
    this.exp = new Direction(EXPAND)
    this.cls = new Direction(CLOSE)

    this.createMotion(FOOTER)
    this.onInteraction(TITLES, CLOSE, FB)
  }

  createMotion(FOOTER)
  {
    this.footerShow = gsap.fromTo(
      FOOTER, 
      {
        scale: 0, 
      }, 
      {
        scale: 1.0, 
        transformOrigin: 'bottom right', 
        duration: 0.8, 
        ease: 'power2.inOut', 
        paused: true
      }
    )
  }

  /*
    ANIMATIONS.
  */

  onInteraction(TITLES, CLOSE, FB)
  {
    TITLES.parentElement.addEventListener(
      'mouseenter', () => 
    {
      if(this.clicked) return 

      this.onInitialInteraction()
    })

    TITLES.parentElement.addEventListener(
      'mouseleave', () => 
    {
      if(this.clicked) return 

      this.onInteractionLeave()
    })

    TITLES.parentElement.addEventListener(
      'click', () => 
    {
      if(this.initial || this.clicked) return 

      this.onInteractionClick(TITLES, FB)
    })

    CLOSE.addEventListener(
      'click', () => 
    {
      if(!this.clicked) return 

      this.onInteractionClose(TITLES, FB)
    })
  }

  onInitialInteraction()
  {
    this.mouseOver = true 

    this.con.hide()
    this.exp.show()
  }

  onInteractionLeave()
  {
    this.mouseOver = false

    this.exp.hide()
    this.con.show()
  }

  onInteractionClick(TITLES, FB)
  {
    this.initial = true
    this.clicked = true 

    this.top.style.display = 'block'
    this.btm.style.display = 'block'

    if(!this.mouseOver)
    {
      this.con.hide()
      this.cls.show()
    }
    else 
    {
      this.exp.hide()
      this.cls.show()
    }

    const enter = gsap.timeline()

    if(window.innerWidth<=500)
    {
      let calc = window.innerWidth - FB.width
      enter.to(
        TITLES.parentElement,
      {
        height: FB.height * 4.0,
        width: calc,
        duration: 0.8,
        ease: 'power2.inOut'
      }, 'start')
    }
    else 
    {
      enter.to(
        TITLES.parentElement,
      {
        height: FB.height * 3.0,
        width: FB.width * 3.0,
        duration: 0.5,
        ease: 'power2.inOut'
      }, 'start')
    }

    this.media.forEach(
      (m, i) =>
    {
      m.classList.contains('top')
        ? (enter.fromTo(
            m,
          {
            y: '+= 5rem',
            opacity: 0.0,
            pointerEvents: 'none',
            scale: 0.0
          },
          {
            y: '0',
            opacity: 1.0,
            pointerEvents: 'initial',
            scale: 1.0,
            duration: .2,
            delay: 0.05 * i
          }, 'mid'))
        : (enter.fromTo(
            m,
          {
            y: '-= 5rem',
            opacity: 0.0,
            pointerEvents: 'none',
            scale: 0.0
          },
          {
            y: '0',
            opacity: 1.0,
            pointerEvents: 'initial',
            scale: 1.0,
            duration: .2,
            delay: 0.05 * i
          }, 'mid'))
    })

    this.mouseOver = false
  }

  onInteractionClose(TITLES, FB)
  {
    this.cls.hide()
    this.con.show()

    const leave = gsap.timeline({
      onComplete: () => 
      { 
        this.initial = false 
        this.top.style.display = 'none'
        this.btm.style.display = 'none'
      }
    })

    this.media.forEach(
      (m, i) => 
      {
        leave.fromTo(
          m, 
          {
            opacity: 1.0, 
            scale: 1.0 
          }, 
          {
            opacity: 0.0, 
            scale: 0.0, 
            duration: 0.2,
          }, 'start'
        )
      }
    )

    leave.to(
      TITLES.parentElement,
    {
      height: FB.height,
      width: FB.width,
      duration: 1.0,
      ease: 'power2.inOut'
    }, 'end')

    this.clicked = false
  }

  show()
  {
    this.footerShow.play()
    this.con.show()
  }

  hide()
  {
  
  }
}
