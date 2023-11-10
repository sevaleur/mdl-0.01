import Component from "classes/Component"
import Show from 'animations/Show'

import gsap from 'gsap'

export default class Footer extends Component
{
  constructor({ template })
  {
    super({
      element: '.footer',
      elements:
      {
        contact: '.footer__contact'
      }
    })

    this.template = template
    this.clicked = false

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

    this.con = new Show(CONNECT)
    this.exp = new Show(EXPAND)
    this.cls = new Show(CLOSE)

    this.onInteraction(TITLES, CLOSE, FB)
  }

  /*
    ANIMATIONS.
  */

  onInteraction(TITLES, CLOSE, FB)
  {
    TITLES.parentElement.addEventListener('mouseenter', () => 
    {
      if(this.clicked) return 

      this.onInitialInteraction()
    })

    TITLES.parentElement.addEventListener('mouseleave', () => 
    {
      if(this.clicked) return 

      this.onInteractionLeave()
    })

    TITLES.parentElement.addEventListener('click', () => 
    {
      if(this.initial) return 

      this.onInteractionClick(TITLES, FB)
    })

    CLOSE.addEventListener('click', () => 
    {
      if(!this.clicked) return 

      this.onInteractionClose(TITLES, FB)
    })
  }

  onInitialInteraction()
  {
    this.con.hide(true)
    this.exp.show()
  }

  onInteractionLeave()
  {
    this.exp.hide(true)
    this.con.show()
  }

  onInteractionClick(TITLES, FB)
  {
    if(this.clicked)
      return 

    this.initial = true
    this.clicked = true 

    this.exp.hide(true)
    this.cls.show()

    const enter = gsap.timeline()

    enter.to(
      TITLES.parentElement,
    {
      height: FB.height * 3.0,
      width: FB.width * 3.0,
      duration: 0.5,
      ease: 'back.inOut'
    }, 'start')

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
  }

  onInteractionClose(TITLES, FB)
  {
    if(!this.clicked)
      return 

    this.cls.hide(true)
    this.con.show()

    const leave = gsap.timeline({
      onComplete: () => { this.initial = false }
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
      ease: 'back.inOut'
    }, 'end')

    this.clicked = false
  }

  show()
  {
    this.con.show()
  }

  hide()
  {

  }
}
