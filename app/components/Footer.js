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
        btm: '.footer__btm', 
        phone: '.footer__title__media',
        phone_icon: '.footer__title__media__image'
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

    if(!this.device.phone)
    {
      this.con = new Direction(this.elements.connect)
      this.exp = new Direction(this.elements.expand)
      this.cls = new Direction(this.elements.close)
    }

    this.footer = {
      isClicked: false, 
      isHovered: false, 
      isOpen: false, 
      bounds: this.element.getBoundingClientRect()
    }

    this.createMotion()
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

    if(this.device.phone)
    {
      this.onPhoneAnimation = gsap.fromTo(
        this.elements.phone_icon, 
        {
          transform: 'rotate(315deg)'
        }, 
        {
          transform: 'rotate(135deg)', 
          duration: 0.5, 
          ease: 'power2.inOut', 
          paused: true
        }
      )
    }
  }

  createEnlargeTimeline()
  {
    this.enter = gsap.timeline()
  }

  createEnlargeLabel()
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

  createEnlargeMediaLabel(media, idx)
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

  createShrinkTimeline()
  {
    this.leave = gsap.timeline({
      onComplete: () => 
      { 
        this.footer.isOpen = false 
        this.elements.top.style.display = 'none'
        this.elements.btm.style.display = 'none'
      }
    })
  }

  createShrinkLabel()
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

  createShrinkMediaLabel(media)
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

    if(!this.device.phone)
    {
      this.con.hide()
      this.exp.show()
    }
  }

  onMouseLeave()
  {
    if(this.footer.isClicked) return 

    this.footer.isHovered = false

    if(!this.device.phone)
    {
      this.exp.hide()
      this.con.show()
    }
  }

  onInteraction()
  {
    if(this.footer.isOpen || this.footer.isClicked) return 

    this.footer.isOpen = true
    this.footer.isClicked = true 

    this.elements.top.style.display = 'block'
    this.elements.btm.style.display = 'block'

    if(!this.device.phone)
    {
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
    }
    else 
    {
      this.onPhoneAnimation.play()
    }

    this.createEnlargeTimeline()
    this.createEnlargeLabel()

    this.elements.media.forEach(
      (media, idx) =>
      {
        this.createEnlargeMediaLabel(media, idx)
      }
    )

    this.footer.isHovered = false
  }

  onInteractionClose(TITLES, FB)
  {
    if(!this.footer.isClicked) return 

    if(!this.device.phone)
    {
      this.cls.hide()
      this.con.show()
    }
    else 
    {
      this.onPhoneAnimation.reverse()
    }

    this.createShrinkTimeline()

    this.elements.media.forEach(
      media => 
      {
        this.createShrinkMediaLabel(media)
      }
    )

    this.createShrinkLabel()

    this.footer.isClicked = false
  }

  /* 
    ANIMATIONS.
  */

  show()
  {
    this.footerShow.play()

    if(!this.device.phone)
    {
      this.con.show()
    }
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

    if(!this.device.phone)
    {
      this.elements.close.addEventListener('click', this.onInteractionClose.bind(this))
    }
    else 
    {
      this.elements.title.addEventListener('click', this.onInteractionClose.bind(this))
    }
  }
}
