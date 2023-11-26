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

    this.modal = {
      active: '', 
      former: '', 
      fIdx: '', 
      top_lines: [], 
      btm_lines: []
    }

    this.createElements()
    this.createMotion()
  }

  createElements()
  {
    this.modal_image = document.querySelector('img.gallery__modal__selected__figure__image')
    this.modal_divs = document.querySelectorAll('.gallery__modal__images__div')
    this.modal_images = document.querySelectorAll('img.gallery__modal__images__div__media__figure__image')
    this.modal_figures = document.querySelectorAll('.gallery__modal__images__div__media__figure')
    this.modal_covers = document.querySelectorAll('img.gallery__modal__images__div__media__cover')
    this.modal_close = document.querySelector('p.gallery__modal__selected__figure__close')
    
    this.top_lines = document.querySelectorAll('span.gallery__modal__images__div__top') 
    this.btm_lines = document.querySelectorAll('span.gallery__modal__images__div__bottom')

    this.top_lines.forEach(
      (line, idx) => 
      {
        this.modal.top_lines.push(
          new Line(
            line, 
            true
          )
        )

        this.modal.btm_lines.push(
          new Line(
            this.btm_lines[idx], 
            true
          )
        )
      }
    )

    this.onModalSelect()
    this.onModalInteraction()
  }

  createMotion()
  {
    this.onClose = gsap.to(
      this.modal_close, 
      {
        scale: 1.0, 
        duration: 0.5, 
        ease: 'power2.inOut', 
        paused: true
      }
    )
  }

  /* 
    EVENTS.
  */

  onModalSelect()
  {
    let observer = new MutationObserver((changes) => {
      changes.forEach(change => 
      {
        if(change.attributeName.includes('src'))
        {
          this.modal.active = change.target.src

          this.modal_images.forEach(
            (img, idx) => 
            {
              if(img.src === this.modal.active)
              {
                this.modal.top_lines[idx].show(true)
                this.modal.btm_lines[idx].show(true)
              }
              else 
              {
                this.modal.top_lines[idx].hide(true)
                this.modal.btm_lines[idx].hide(true)
              }
            }
          )
        }
      })
    })
    observer.observe(this.modal_image, { attributes : true })
  }

  onModalInteraction()
  {
    this.modal_image.addEventListener('mouseenter', () => 
    {
      this.onClose.play()
    })

    this.modal_image.addEventListener('mouseleave', () => 
    {
      this.onClose.reversed()
    })

    this.modal_divs.forEach(
      (div, idx) => 
      {
        div.addEventListener('mouseenter', () => 
        {
          gsap.to(
            this.modal_figures[idx], 
            {
              scale: 1.2, 
              duration: 0.5, 
              ease: 'power2.inOut'
            }
          )
        })

        div.addEventListener('mouseleave', () => 
        {
          gsap.to(
            this.modal_figures[idx], 
            {
              scale: 1.0, 
              duration: 0.5, 
              ease: 'power2.inOut'
            }
          )
        })

        div.addEventListener('click', () => 
        {
          this.modal_image.src = this.modal_images[idx].src
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
