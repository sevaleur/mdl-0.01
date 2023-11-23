import Page from 'classes/Page'
import Show from 'animations/Show'
import Line from 'animations/Line'

import gsap from 'gsap'

import { COLOR_CULTURED, COLOR_NIGHT } from 'utils/color_variables'

export default class Gallery extends Page
{
  constructor()
  {
    super({
      id: 'gallery',
      element: '.gallery',
      elements: {
        title: '.gallery__info__title',
        desc: '.gallery__info__desc'
      }, 
      background: COLOR_NIGHT, 
      color: COLOR_CULTURED
    })
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
    this.modalImage = document.querySelector('img.gallery__modal__selected__figure__image')
    this.modalDivs = document.querySelectorAll('.gallery__modal__images__div')
    this.modalImages = document.querySelectorAll('img.gallery__modal__images__div__media__figure__image')
    this.modalFigures = document.querySelectorAll('.gallery__modal__images__div__media__figure')
    this.modalCovers = document.querySelectorAll('img.gallery__modal__images__div__media__cover')

    this.top_lines = []
    this.bottom_lines = []

    this.onModalInteraction()
  }

  /* 
    EVENTS.
  */

  onModalInteraction()
  {
    this.modalDivs.forEach(
      (div, idx) => 
      {
        this.top_lines.push(
          new Line(
            div.querySelector('span.gallery__modal__images__div__top'), 
            true
          )
        )

        this.bottom_lines.push(
          new Line(
            div.querySelector('span.gallery__modal__images__div__bottom'), 
            true
          )
        )

        div.addEventListener('mouseenter', () => 
        {
          this.top_lines[idx].show(true)
          this.bottom_lines[idx].show(true)

          gsap.to(
            this.modalFigures[idx], 
            {
              scale: 1.2, 
              duration: 0.5, 
              ease: 'power2.inOut'
            }
          )
        })

        div.addEventListener('mouseleave', () => 
        {
          this.top_lines[idx].hide(true)
          this.bottom_lines[idx].hide(true)

          gsap.to(
            this.modalFigures[idx], 
            {
              scale: 1.0, 
              duration: 0.5, 
              ease: 'power2.inOut'
            }
          )
        })

        div.addEventListener('click', () => 
        {
          let src = this.modalImages[idx].getAttribute('data-src')
          this.modalImage.src = src
        })
      }
    )
  }

  show()
  {
    super.show()

    gsap.to(
    ['.gallery__info', 
    '.gallery__back__button'],
      {
        opacity: 1.0
      }
    )

    this.title = new Show(this.elements.title)
    this.desc = new Show(this.elements.desc)
    this.title.show()
    this.desc.show()
  }

  hide()
  {
    super.hide()

    this.title.hide()
    this.desc.hide()
  }
}
