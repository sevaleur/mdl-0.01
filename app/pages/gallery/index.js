import Page from 'classes/Page'

import Show from 'animations/Show'
import Line from 'animations/Line'

import gsap from 'gsap'

import { COLOR_CULTURED, COLOR_NIGHT } from 'utils/color_variables'

export default class Gallery extends Page
{
  constructor({ device })
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

    this.device = device
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
    this.onBack()
  }

  createElements()
  {
    this.modal_image = document.querySelector('img.gallery__modal__selected__figure__image')
    this.modal_selected = document.querySelector('.gallery__modal__selected')

    this.modal_div = document.querySelector('.gallery__modal__images')
    this.modal_divs = document.querySelectorAll('.gallery__modal__images__div')
    this.modal_images = document.querySelectorAll('img.gallery__modal__images__div__media__figure__image')
    this.modal_figures = document.querySelectorAll('.gallery__modal__images__div__media__figure')

    this.modal_close = document.querySelector('.gallery__modal__selected__text')
    this.close = document.querySelector('.gallery__modal__selected__text__close')

    this.back = document.querySelector('.gallery__back')
    
    this.top_lines = document.querySelectorAll('span.gallery__modal__images__div__top') 
    this.btm_lines = document.querySelectorAll('span.gallery__modal__images__div__bottom')

    this.gallery_title = document.querySelector('h1.gallery__info__title')
    this.gallery_info = document.querySelector('.gallery__info')

    const CB = document.querySelector('.footer')

    this.createModal(CB)
    this.onModalSelect()
    this.onModalInteraction()
  }

  createModal(CB)
  {
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

    let bounds = CB.getBoundingClientRect()
    let calc = window.innerWidth - bounds.width

    this.modal_div.style.width = `${calc}px`  
  }

  createMotion()
  {
    this.show_close = gsap.fromTo(
      this.close, 
      {
        scale: 0,
      }, 
      {
        scale: 1.0,
        ease: 'power2.inOut', 
        paused: true
      }
    )

    this.onBackShow = gsap.fromTo(
      this.back, 
      {
        scale: 0, 
      }, 
      {
        scale: 1.0, 
        transformOrigin: 'bottom left',
        duration: 0.8,
        ease: 'power2.inOut', 
        paused: true
      }
    )

    this.onInfo = gsap.fromTo(
      this.gallery_info, 
      {
        opacity: 0.0
      }, 
      {
        opacity: 1.0, 
        duration: 0.8, 
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
    if(this.device.desktop)
    {
      this.modal_selected.addEventListener(
        'mouseenter', () => 
        {
          this.close.style.display = 'block'
          this.show_close.play()
        }
      )
  
      this.modal_selected.addEventListener(
        'mouseleave', () => 
        {
          this.show_close.reverse()
            .eventCallback(
              'onReverseComplete', 
              () => 
            { 
              this.close.style.display = 'none' 
            } 
          )
        }
      ) 
    }

    this.modal_divs.forEach(
      (div, idx) => 
      {
        div.addEventListener(
          'mouseenter', () => 
          {
            gsap.to(
              this.modal_figures[idx], 
              {
                scale: 1.2, 
                duration: 0.5, 
                ease: 'power2.inOut'
              }
            )
          }
        )

        div.addEventListener(
          'mouseleave', () => 
          {
            gsap.to(
              this.modal_figures[idx], 
              {
                scale: 1.0, 
                duration: 0.5, 
                ease: 'power2.inOut'
              }
            )
          }
        )
        div.addEventListener(
          'click', () => 
          {
            this.modal_image.src = this.modal_images[idx].src
          }
        )
      }
    )
  }

  onMove(e)
  {
    super.onMove(e)
  }

  onBack()
  {
    this.back.addEventListener('click', (e) => 
    {
      e.preventDefault()
  
      window.history.back()
    })
  }

  show()
  {
    super.show()

    this.onInfo.play()
    this.onBackShow.play()

    this.title = new Show(this.elements.title)
    this.desc = new Show(this.elements.desc)

    this.title.show()
    this.desc.show()
  }

  hide()
  {
    super.hide(true)

    this.title.hide()
    this.desc.hide()
    this.onInfo.reverse()

    return new Promise(
      resolve => 
      {
        this.onBackShow.reverse()
          .eventCallback(
            'onReverseComplete', 
            () => { resolve() })
      }
    )
  }

  update()
  {
    super.update()

    if(this.device.desktop)
    {
      gsap.to(
        this.modal_close, 
        {
          top: this.coord.y, 
          left: this.coord.x,
          duration: 0.5, 
          ease: 'linear'
        }
      )
    }
  }
}
