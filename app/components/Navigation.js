import Component from "classes/Component"

import Show from 'animations/Show'

import gsap from 'gsap'

export default class Navigation extends Component
{
  constructor({ template })
  {
    super({
      element: '.navigation',
      elements:
      {
        items: '.navigation__list__item',
        links: '.navigation__list__item__link',
        logo: '.navigation__logo'
      }
    })

    this.createNavElements()
    this.createNavLocation(template)
  }

  /*
    CREATE.
  */

  createNavElements()
  {
    this.nav_links = []
    this.elements.links.forEach(link =>
    {
      this.nav_links.push(new Show(link))
    })
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
        }
      })
    })
  }

  /*
    ANIMATIONS.
  */

  show()
  {
    gsap.to([
      '.navigation__logo__image',
      '.navigation__list'
    ],
    {
      opacity: 1.0,
      duration: 0.5,
    })

    this.nav_links.forEach(link =>
    {
      link.show()
    })
  }

  hide()
  {
    this.nav_links.forEach(link =>
    {
      link.hide()
    })
  }
}
