import gsap from 'gsap'

import Page from 'classes/Page'

import Hover from 'animations/Hover'
import { COLOR_CULTURED, COLOR_NIGHT } from '../../utils/color_variables'

export default class Menu extends Page
{
  constructor()
  {
    super({
      id: 'menu',
      element: '.menu',
      elements: {
        title: '.menu__title__text'
      },
      background: COLOR_NIGHT, 
      color: COLOR_CULTURED
    })

    this.screen_size = window.innerWidth
    this.ready = false
  }

  /*
    CREATE.
  */

  create()
  {
    super.create()
    this.createElements()
  }

  createElements()
  {
    this.td = document.querySelector('.menu__title')
    this.tdb = this.td.getBoundingClientRect()

    this.tt = document.querySelectorAll('.menu__title__text')

    this.image_link_elements = document.querySelectorAll('.menu__gallery__image__link')
    const image_type_text = document.querySelectorAll('.menu__gallery__image__type__text')
    const image_index_text = document.querySelectorAll('.menu__gallery__image__index__text')
    const image_title_text = document.querySelectorAll('.menu__gallery__image__title__text')

    this.onLoadedLoop()
    this.onHover(image_type_text, image_index_text, image_title_text)
  }

  /*
    EVENTS.
  */

  onLoadedLoop()
  {
    const total = this.tt.length

    this.tt.forEach(
      t =>
    {
      const length = t.innerHTML.length

      gsap.to(
        t,
        {
          y: `-100%`,
          duration: total * length,
          ease: 'linear',
          repeat: -1
        }
      )
    })
  }

  onHover(i_type, i_index, i_title)
  {
    this.hover_image_type = new Hover(i_type)
    this.hover_image_index = new Hover(i_index)
    this.hover_image_title = new Hover(i_title)

    this.image_link_elements.forEach((link, index) =>
    {
      gsap.set(
        link,
        {
          opacity: 0.0
        }
      )

      link.onmouseover = () =>
      {
        if(!this.ready)
          link.style.cursor = 'default'

        if(this.ready)
        {
          link.style.cursor = 'pointer'

          gsap.to(
            link,
            {
              opacity: 1.0
            }
          )

          this.hover_image_type.init(index)
          this.hover_image_index.init(index)
          this.hover_image_title.init(index)
        }
      }

      link.onmouseleave = () =>
      {
        this.hover_image_type.reset()
        this.hover_image_index.reset()
        this.hover_image_title.reset()
      }
    })
  }

  onLeave()
  {
    this.hover_image_type.reset()
    this.hover_image_index.reset()
    this.hover_image_title.reset()

    this.image_link_elements.forEach(
      link =>
    {
      link.style.cursor = 'default'

      gsap.to(
        link,
        {
          opacity: 0.0
        }
      )

      link.onmouseover = null
      link.onmouseleave = null
    })

    this.hover_image_type = null
    this.hover_image_index = null
    this.hover_image_title = null
  }

  /*
    SHOW // HIDE - ANIMATIONS.
  */

  show()
  {
    super.show()

    if(this.screen_size < 1080)
    {
      gsap.set([
        this.image_index_text,
        this.image_title_text,
        this.image_type_text
      ],
      {
        opacity: 0,
        visibility: 'hidden',
      })
    }

    gsap.fromTo(
      this.td,
      {
        x: '-100%',
      },
      {
        x: '0',
        duration: 1.0,
        ease: 'power2.inOut',
        onComplete: () =>
        {
          this.ready = true
        }
      }
    )
  }

  hide()
  {
    super.hide(true)
    this.onLeave()

    return new Promise(resolve =>
    {
      gsap.fromTo(
        this.td,
        {
          x: '0'
        },
        {
          x: '-100%',
          duration: 1.0,
          ease: 'power2.inOut',
          onComplete: resolve
        }
      )
    })
  }
}
