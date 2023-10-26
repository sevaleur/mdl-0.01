import Component from "classes/Component"

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

    this.createElements()
  }

  /*
    CREATE.
  */

  createElements()
  {
    const footer = document.querySelector('.footer')
    this.title = document.querySelector('.footer__title')
    this.tt = document.querySelector('.footer__title__text')
    this.icons = document.querySelectorAll('.footer__icons')
    this.icon = document.querySelectorAll('.footer__icons__media__div__icon')
    this.media = document.querySelectorAll('.footer__icons__media')

    this.top = document.querySelector('.footer__top')
    this.btm = document.querySelector('.footer__btm')

    const fb = footer.getBoundingClientRect()

    this.onInteraction(footer, fb)
  }


  /*
    ANIMATIONS.
  */

  onInteraction(footer, fb)
  {
    footer.onmouseenter = () => { this.onMouseEnter(footer, fb) }
    footer.onmouseleave = () => { this.onMouseLeave(footer, fb) }
  }

  onMouseEnter(footer, fb)
  {
    this.title.classList.toggle('selected')
    this.title.classList.toggle('hidden')

    const enter = gsap.timeline()

    enter.to([
      footer
    ],
    {
      height: fb.height * 3.0,
      width: fb.width * 3.0,
      duration: 0.5,
      ease: 'power2.inOut'
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

  onMouseLeave(footer, fb)
  {
    this.title.classList.toggle('selected')
    this.title.classList.toggle('hidden')

    gsap.set(
      this.media,
    {
      opacity: 0.0
    })
    

    gsap.to(
      footer,
    {
      height: fb.height,
      width: fb.width,
      duration: 0.5,
      delay: 0.2,
      ease: 'power2.inOut'
    })
  }

  show()
  {
    gsap.to([
      this.tt
    ],
    {
      opacity: 1.0,
      duration: 0.5,
    })
  }

  hide()
  {

  }
}
