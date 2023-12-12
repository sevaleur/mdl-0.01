import Component from "classes/Component"

import Show from 'animations/Show'

import gsap from 'gsap'

export default class Navigation extends Component
{
  constructor({ template, device })
  {
    super({
      element: '.navigation',
      elements:
      {
        menu: '.navigation__menu',
        menu_icon: '.navigation__menu__icon', 
        menu_list: '.navigation__list',
        menu_items: '.navigation__list__item',
        menu_links: '.navigation__list__item__link',
        logo: '.navigation__logo',
        logo_image: '.navigation__logo__image'
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

    this.menuClick = false
    this.nav_links = []

    this.elements.menu_links.forEach(
      link =>
      {
        this.nav_links.push(
          new Show(link)
        )
      }
    )

    this.createMotion()
  }

  createMotion()
  {
    this.showLogo = gsap.fromTo(
      this.elements.logo, 
      {
        scale: 0.0, 
      }, 
      {
        scale: 1.0, 
        transformOrigin: 'top left', 
        duration: 0.8, 
        ease: 'power2.inOut', 
        paused: true
      }
    )

    if(!this.device.desktop)
    {
      this.onMenuShow = gsap.fromTo(
        this.elements.menu, 
        {
          scale: 0.0, 
        }, 
        {
          scale: 1.0, 
          transformOrigin: 'top right', 
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true 
        }
      )

      this.onMenuEnlarge = gsap.fromTo(
        this.elements.menu, 
        {
          width: '15rem', 
          height: '13rem'
        }, 
        {
          width: '100%', 
          height: '100vh',
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      ) 
  
      this.onMenuClick = gsap.fromTo(
        this.elements.menu_icon,
        {
          rotation: '0deg',
          top: '50%', 
          right: '50%'
        },
        {
          rotation: '-135deg', 
          top: '5rem', 
          right: '6rem',
          transformOrigin: 'center',
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      ) 
    }
    else 
    {
      this.onMenuShow = gsap.fromTo(
        this.elements.menu, 
        {
          yPercent: -150
        }, 
        {
          yPercent: 0, 
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )
    }
  }

  /*
    EVENTS. 
  */

  onLogoClick()
  {
    this.elements.menu_links.forEach(
      link =>
      {
        link.classList.remove('selected')
        link.classList.add('hidden')
      }
    )
  }

  onLinkInteraction(link)
  {
    this.onNavLocationCheck(link)

    if(this.former != link)
    {
      if(this.former)
      {
        this.former.classList.remove('selected')
        this.former.classList.add('hidden')
      }

      link.classList.add('selected')
      link.classList.remove('hidden')
      
      this.former = link

      if(!this.device.desktop)
        this.onMenuShrink()
    }
  }

  onNavLocationCheck(link)
  {
    if(link === this.former)
      return

    if(link.classList.contains('selected'))
      this.former = link

    link.dataset.path === this.template
    ? (link.classList.add('selected'), link.classList.remove('hidden'), this.former = link)
    : (link.classList.add('hidden'), link.classList.remove('selected'))
  }

  onMenuInteraction()
  {
    if(!this.menuClick)
    {
      this.onMenuExpand()
    }
    else 
    {
      this.onMenuShrink()
    }
  }

  onMenuShrink()
  {
    this.nav_links.forEach(
      link =>
      {
        link.hide()

        gsap.to(
          link, 
          {
            opacity: 0.0,
          }
        )
      }
    )

    this.onMenuClick.reverse()
      .eventCallback(
        'onReverseComplete', () => 
        { 
          this.menuClick = false 
        }
      )

    this.onMenuEnlarge.reverse()
    this.elements.menu_list.style.display = 'none'
  }

  onMenuExpand()
  {
    this.onMenuClick.play()
      .eventCallback(
        'onComplete', () => 
        { 
          this.menuClick = true 
        }
      )

    this.onMenuEnlarge.play()
      .eventCallback(
        'onComplete', () => 
      { 
        this.elements.menu_list.style.display = 'flex' 

        this.nav_links.forEach(
          link =>
          {
            gsap.to(
              link, 
              {
                opacity: 1.0, 
                duration: 0.5, 
              }
            )
            
            link.show()
          }
        )
      }
    )
  }

  /* 
    ANIMATIONS.
  */

  show()
  {
    this.showLogo.play()

    if(!this.device.desktop)
    {
      this.onMenuShow.play()
    }
    else 
    {
      this.onMenuShow.play()
        .eventCallback(
          'onComplete', () => 
          {
            this.nav_links.forEach(
              link =>
              {
                link.show()
              }
            )
          }
        )
    }
    
    gsap.to(
      this.elements.menu_list,
      {
        opacity: 1.0,
        duration: 0.5,
      }
    )
    
    gsap.to(
      this.elements.logo_image,
      {
        opacity: 1.0,
        duration: 0.5,
      }
    )
  }

  hide()
  {
    if(this.device.desktop)
    {
      this.nav_links.forEach(link =>
      {
        link.hide()
      })
    }
  }

  /* 
    EVENTLISTENERS.
  */

  addEventListeners()
  {
    super.addEventListeners()

    this.elements.logo.addEventListener('click', this.onLogoClick.bind(this))

    this.elements.menu_links.forEach(
      link =>
      {
        this.onNavLocationCheck(link)
        
        link.addEventListener('click', this.onLinkInteraction.bind(this, link))
      }
    )

    if(!this.device.desktop)
    {
      this.elements.menu.addEventListener('click', this.onMenuInteraction.bind(this))
    }
  }
}
