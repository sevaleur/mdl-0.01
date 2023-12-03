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
        items: '.navigation__list__item',
        links: '.navigation__list__item__link',
        logo: '.navigation__logo',
      }
    })

    this.device = device
    this.menuClick = false

    this.createNavElements()
    this.createMotion()
    this.createNavLocation(template)

    if(this.device.tablet || this.device.mobile)
      this.onMenuInteraction()
  }

  /*
    CREATE.
  */

  createNavElements()
  {
    this.nav_menu = document.querySelector('.navigation__menu')
    this.nav_menu_icon = document.querySelector('.navigation__menu__icon')
    this.nav_menu_items = document.querySelector('.navigation__list')

    this.nav_links = []
    this.elements.links.forEach(link =>
    {
      this.nav_links.push(new Show(link))
    })
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

    if(this.device.tablet || this.device.mobile)
    {
      this.onMenuShow = gsap.fromTo(
        this.nav_menu, 
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
  
      this.onMenuClick = gsap.fromTo(
        this.nav_menu_icon,
        {
          rotation: '0deg',
          top: '50%', 
          right: '50%'
        },
        {
          rotation: '135deg', 
          top: '5rem', 
          right: '6rem',
          transformOrigin: 'center',
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )
  
      this.onMenuEnlarge = gsap.fromTo(
        this.nav_menu, 
        {
          width: '12rem', 
          height: '10rem'
        }, 
        {
          width: '100%', 
          height: '100vh',
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )
    }
  }

  createNavLocation(template)
  {
    this.elements.logo.addEventListener('click', () =>
    {
      this.elements.links.forEach(
        link =>
      {
        link.classList.remove('selected')
        link.classList.add('hidden')
      }
      )
    })

    this.elements.links.forEach(
      link =>
    {
      if(link.classList.contains('selected'))
        this.former = link

      link.dataset.path === template
      ? (link.classList.add('selected'), link.classList.remove('hidden'), this.former = link)
      : (link.classList.add('hidden'), link.classList.remove('selected'))

      link.addEventListener('click', () =>
      {
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

          if(this.device.tablet || this.device.mobile)
            this.onMenuShrink()
        }
      })
    })
  }

  /*
    ANIMATIONS.
  */

  onMenuInteraction()
  {
    this.nav_menu_icon.onclick = () => 
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

    this.onMenuClick.reverse().eventCallback('onReverseComplete', () => { this.menuClick = false })
    this.onMenuEnlarge.reverse()
    this.nav_menu_items.style.display = 'none'
  }

  onMenuExpand()
  {
    this.onMenuClick.play().eventCallback('onComplete', () => { this.menuClick = true })

    this.onMenuEnlarge.play()
      .eventCallback(
        'onComplete', () => 
      { 
        this.nav_menu_items.style.display = 'flex' 

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

  show()
  {
    this.showLogo.play()

    if(this.device.tablet || this.device.mobile)
    {
      this.onMenuShow.play()
    }
    else 
    {
      this.nav_links.forEach(
        link =>
        {
          link.show()
        }
      )
    }
    
    gsap.to([
      '.navigation__logo__image',
      '.navigation__list'
    ],
    {
      opacity: 1.0,
      duration: 0.5,
    })
  }

  hide()
  {
    if(!this.device.tablet || !this.device.mobile)
    {
      this.nav_links.forEach(link =>
      {
        link.hide()
      })
    }
  }
}
