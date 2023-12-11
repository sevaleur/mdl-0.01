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
        title: '.footer__title', 
        connect: '.footer__title__text', 
        expand: '.footer__title__expand', 
        close: '.footer__title__close', 
        contact: '.footer__contact', 
        media: '.footer__icons__media', 
        top: '.footer__top', 
        btm: '.footer__btm'
      }, 
      device: device
    })

    this.template = template
  }

  /*
    CREATE.
  */

  create()
  {
    super.create()

    this.con = new Direction(this.elements.connect)
    this.exp = new Direction(this.elements.expand)
    this.cls = new Direction(this.elements.close)

    this.footer = {
      isClicked: false, 
      isHovered: false, 
      isOpen: false, 
      bounds: this.element.getBoundingClientRect()
    }

    this.createMotion()
    this.createTimelines()
  }

  createMotion()
  {
    this.footerShow = gsap.fromTo(
      this.element, 
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

  createTimelines()
  {
    this.enter = gsap.timeline()

    this.leave = gsap.timeline({
      onComplete: () => 
      { 
        this.footer.isOpen = false 
        this.elements.top.style.display = 'none'
        this.elements.btm.style.display = 'none'
      }
    })
  }

  createOpenTimeline()
  {
    if(window.innerWidth<=500)
    {
      let calc = window.innerWidth - this.footer.bounds.width

      this.enter.to(
        this.element,
        {
          height: this.footer.bounds.height * 4.0,
          width: calc,
          duration: 0.8,
          ease: 'power2.inOut'
        }, 'start'
      )
    }
    else 
    {
      this.enter.to(
        this.element,
        {
          height: this.footer.bounds.height * 3.0,
          width: this.footer.bounds.width * 3.0,
          duration: 0.5,
          ease: 'power2.inOut'
        }, 'start'
      )
    }
  }

  createOpenMediaTimeline(media, idx)
  {
    if(media.classList.contains('top'))
    {
      this.enter.fromTo(
        media,
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
          delay: 0.05 * idx
        }, 'mid'
      )
    }
    else 
    {
      this.enter.fromTo(
        media,
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
          delay: 0.05 * idx
        }, 'mid'
      )
    }
  }

  createCloseTimeline()
  {
    this.leave.to(
      this.element,
      {
        height: this.footer.bounds.height,
        width: this.footer.bounds.width,
        duration: 1.0,
        ease: 'power2.inOut'
      }, 'end'
    )
  }

  createCloseMediaTimeline(media)
  {
    this.leave.fromTo(
      media, 
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

  /*
    EVENTS.
  */

  onMouseEnter()
  {
    if(this.footer.isClicked) return 

    this.footer.isHovered = true 

    this.con.hide()
    this.exp.show()
  }

  onMouseLeave()
  {
    if(this.footer.isClicked) return 

    this.footer.isHovered = false

    this.exp.hide()
    this.con.show()
  }

  onInteraction()
  {
    if(this.footer.isOpen || this.footer.isClicked) return 

    this.footer.isOpen = true
    this.footer.isClicked = true 

    this.elements.top.style.display = 'block'
    this.elements.btm.style.display = 'block'

    if(!this.footer.isHovered)
    {
      this.con.hide()
      this.cls.show()
    }
    else 
    {
      this.exp.hide()
      this.cls.show()
    }

    this.createOpenTimeline()

    this.elements.media.forEach(
      (media, idx) =>
      {
        this.createOpenMediaTimeline(media, idx)
      }
    )

    this.footer.isHovered = false
  }

  onInteractionClose(TITLES, FB)
  {
    if(!this.footer.isClicked) return 

    this.cls.hide()
    this.con.show()

    this.elements.media.forEach(
      media => 
      {
        this.createCloseMediaTimeline(media)
      }
    )

    this.createCloseTimeline()

    this.footer.isClicked = false
  }

  /* 
    ANIMATIONS.
  */

  show()
  {
    this.footerShow.play()
    this.con.show()
  }

  hide()
  {
  
  }

  /* 
    EVENTLISTENERS.
  */

  addEventListeners()
  {
    super.addEventListeners()

    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    this.element.addEventListener('click', this.onInteraction.bind(this))
    this.elements.close.addEventListener('click', this.onInteractionClose.bind(this))
  }
}
