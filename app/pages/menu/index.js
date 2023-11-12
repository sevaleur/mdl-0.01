import gsap from 'gsap'

import Page from 'classes/Page'
import Show from 'animations/Show'

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
    this.titlediv = document.querySelector('.menu__title')
    this.infdiv = document.querySelector('.menu__title__wrapper')
    this.inftext = document.querySelectorAll('.menu__title__text')
    this.image_link_elements = document.querySelectorAll('.menu__gallery__image__link')

    const TYPE = document.querySelectorAll('.menu__gallery__image__type__text')
    const INDEX = document.querySelectorAll('.menu__gallery__image__index__text')
    const TITLE = document.querySelectorAll('.menu__gallery__image__title__text')

    this.createText(TYPE, INDEX, TITLE)
    this.onLoadedLoop()
    this.onHover()
  }

  createText(TYPE, INDEX, TITLE)
  {
    this.type = []
    this.index = []
    this.title = []

    TITLE.forEach(
      (t, i) => 
      {
        this.title.push(new Show(t))
        this.type.push(new Show(TYPE[i]))
        this.index.push(new Show(INDEX[i]))
      }
    )
  }

  /*
    EVENTS.
  */

  onLoadedLoop()
  {
    const NODES = this.infdiv.childNodes.length
    const TXTHEIGHT = this.infdiv.children[0].getBoundingClientRect().height
    const VAL = TXTHEIGHT * NODES 

    this.inftext.forEach(
      (child, idx) =>
    {
      gsap.set(
        child, 
        {
          y: idx * TXTHEIGHT + 'px'
        }
      )

      gsap.to(
        child,
        {
          y: -TXTHEIGHT * (idx + 1) + 'px',
          duration: NODES * (idx + 1),
          ease: 'none',
          modifiers: {
            y: y => parseFloat(y) % VAL + 'px' 
          },
          repeat: -1
        }
      )
    })
  }

  onHover()
  {
    this.image_link_elements.forEach(
      (link, index) =>
    {
      gsap.set(
        link,
        {
          opacity: 0.0
        }
      )

      link.onmouseenter = () =>
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

          this.type[index].show()
          this.index[index].show()
          this.title[index].show()
        }
      }

      link.onmouseleave = () =>
      {
        this.type[index].hide()
        this.index[index].hide()
        this.title[index].hide()
      }
    })
  }

  onLeave()
  {
    this.image_link_elements.forEach(
      (link, index) =>
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

      this.type[index].hide()
      this.index[index].hide()
      this.title[index].hide()
    })

    this.type = null
    this.index = null
    this.title = null
  }

  /*
    SHOW // HIDE - ANIMATIONS.
  */

  show()
  {
    super.show()

    gsap.fromTo(
      this.titlediv,
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
        this.titlediv,
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
