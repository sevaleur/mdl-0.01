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
        info: '.gallery__info',
        title: '.gallery__info__title',
        desc: '.gallery__info__desc', 
        links: '.gallery__media__div',
        gallery_images: 'img.gallery__media__div__figure__image',
        modal: '.gallery__modal',
        modal_selected: '.gallery__modal__selected',
        modal_image: 'img.gallery__modal__selected__figure__image', 
        modal_images: '.gallery__modal__images',
        modal_images_div: '.gallery__modal__images__div',
        modal_images_image: 'img.gallery__modal__images__div__media__figure__image',
        modal_images_figure: '.gallery__modal__images__div__media__figure',
        modal_top_lines: 'span.gallery__modal__images__div__top',
        modal_bottom_lines: 'span.gallery__modal__images__div__bottom',
        modal_close: '.gallery__modal__text',
        back: '.gallery__back',
        footer: '.footer'
      }, 
      background: COLOR_NIGHT, 
      color: COLOR_CULTURED, 
      device: device
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
      enlarged: false,
      animations: {
        hover: [],
        top_lines: [], 
        btm_lines: [], 
      }
    }

    this.createAnimations()
    this.createModal()
    this.onModalSelection()
    this.onDeviceCheck()
  }

  createModal()
  {
    this.elements.modal_top_lines.forEach(
      (line, idx) => 
      {
        this.modal.animations.top_lines.push(
          new Line(
            line, 
            true
          )
        )

        this.modal.animations.btm_lines.push(
          new Line(
            this.elements.modal_bottom_lines[idx], 
            true
          )
        )
      }
    )

    let bounds = this.elements.footer.getBoundingClientRect()
    let calc = window.innerWidth - bounds.width

    this.elements.modal_images.style.width = `${calc}px`  

    if(this.device.desktop)
    {
      this.elements.modal_selected.style.top = `${bounds.height / 2}px`
      this.elements.modal_selected.style.height = `${window.innerHeight - (bounds.height * 2)}px`
    }
    else 
    {
      this.elements.modal_selected.style.height = `${window.innerHeight - (bounds.height * 3)}px`
    }
  }

  createAnimations()
  {
    super.createAnimations(false)

    this.onBackShow = gsap.fromTo(
      this.elements.back, 
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
      this.elements.info, 
      {
        opacity: 0.0
      }, 
      {
        opacity: 1.0, 
        duration: 0.8, 
        paused: true
      }
    )

    this.onModal = gsap.to(
      this.elements.modal,
    {
      opacity: 1.0,
      duration: .5,
      paused: true,
    })

    this.onModalSelect = gsap.fromTo(
      this.elements.modal_image, 
      {
        opacity: 0.0
      },
      {
        opacity: 1.0, 
        ease: 'power2.inOut', 
        paused: true
      }
    )

    this.onModalShow = gsap.fromTo(
      this.elements.modal_images, 
      {
        yPercent: 100
      },
      {
        yPercent: 0, 
        duration: 0.8,
        ease: 'power2.inOut', 
        paused: true
      }
    )

    if(this.device.desktop)
    {
      this.onCloseShow = gsap.fromTo(
        this.elements.modal_close, 
        {
          yPercent: 300
        },
        {
          yPercent: 0, 
          duration: 0.8,
          ease: 'power2.inOut', 
          paused: true
        }
      )
    }
    else 
    {
      this.onModalMobile = gsap.fromTo(
        this.elements.modal_close, 
        {
          xPercent: 100
        }, 
        {
          xPercent: 0, 
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )
    }
  }

  createMotionElement(element)
  {
    let imageHover = gsap.fromTo(
      element, 
      {
        scale: 1.0,
      },
      {
        scale: 1.2, 
        duration: 0.5, 
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.modal.animations.hover.push(imageHover)
  }

  /* 
    EVENTS.
  */

  onDeviceCheck()
  {
    if(this.device.tablet)
    {
      this.break = this.elements.title.querySelector('br')
      this.span = document.createElement('span')
      this.span.className = 'whitespace'

      if(this.break)
      {
        this.elements.title.replaceChild(this.span, this.break)
      }
    }
  }

  onModalChangeSelection(idx)
  {
    this.elements.modal_image.src = this.elements.modal_images_image[idx].src
  }

  onModalSelection()
  {
    let observer = new MutationObserver((changes) => {
      changes.forEach(change => 
      {
        if(change.attributeName.includes('src'))
        {
          this.modal.active = change.target.src

          this.elements.modal_images_image.forEach(
            (img, idx) => 
            {
              if(img.src === this.modal.active)
              {
                this.modal.animations.top_lines[idx].show(true)
                this.modal.animations.btm_lines[idx].show(true)
              }
              else 
              {
                this.modal.animations.top_lines[idx].hide(true)
                this.modal.animations.btm_lines[idx].hide(true)
              }
            }
          )
        }
      })
    })
    observer.observe(this.elements.modal_image, { attributes : true })
  }

  onModalEnlarge(idx)
  {
    this.modal.enlarged = true

    this.elements.modal_image.src = this.elements.gallery_images[idx].src
    this.elements.modal_image.alt = this.elements.gallery_images[idx].alt

    gsap.delayedCall(
      0.5, 
      () => 
      {
        this.modal.animations.top_lines[idx].show(true)
        this.modal.animations.btm_lines[idx].show(true)
      }
    )

    this.elements.modal.style.display = 'grid'

    this.onModal.play()
    this.onModalSelect.play()
    
    if(this.device.desktop)
    {
      this.onModalShow.play().eventCallback('onComplete', () => 
      {
        this.onCloseShow.play()
      })
    }
    else 
    {
      this.onModalMobile.play()
      this.onModalShow.play()
    }
  }

  onModalClose()
  {
    this.onModalSelect.reverse()

    if(this.device.desktop)
    {
      this.onCloseShow.reverse().eventCallback('onReverseComplete', () => 
      {
        this.onModalShow.reverse().eventCallback('onReverseComplete', () => 
        {
          this.onModal.reverse().eventCallback('onReverseComplete', () => 
          {
            this.elements.modal.style.display = 'none'
            this.modal.enlarged = false
          })
        })
      })
    }
    else 
    {
      this.onModalSelect.reverse()
      this.onModalMobile.reverse()

      this.onModalShow.reverse().eventCallback('onReverseComplete', () => 
      {
        this.onModal.reverse().eventCallback('onReverseComplete', () => 
        {
          this.elements.modal.style.display = 'none'
          this.modal.enlarged = false
        })
      })
    }
  }

  onModalImagesEnter(idx)
  {
    this.modal.animations.hover[idx].play()
  }

  onModalImagesLeave(idx)
  {
    this.modal.animations.hover[idx].reverse()
  }

  onMove(e)
  {
    super.onMove(e)
  }

  onBack()
  {
    this.hide()

    window.history.back()
  }

  show()
  {
    super.show()

    this.onInfo.play()
    this.onBackShow.play()

    this.title = new Show(this.elements.title)
    this.title.show()

    if(this.elements.desc)
    {
      this.desc = new Show(this.elements.desc)
      this.desc.show()
    }
  }

  hide()
  {
    super.hide(true)

    return new Promise(
      resolve => 
    {
        this.title.hide()
        
        if(this.desc)
        this.desc.hide()
      
        this.onInfo.reverse()
        this.onBackShow.reverse()
          .eventCallback(
            'onReverseComplete', 
            () => 
          {
            resolve()
          }
        )

        if(this.modal.enlarged)
        {
          this.onModalSelect.reverse()

          if(this.device.desktop)
          {
            this.onCloseShow.reverse()
              .eventCallback(
                'onReverseComplete', 
                () => 
              {
                this.onModal.reverse()
                  .eventCallback(
                    'onReverseComplete', 
                    () => 
                  {
                    this.elements.modal.style.display = 'none'
                    this.modal.enlarged = false

                    resolve()
                  }
                )
              } 
            )
          }
          else 
          {
            this.onModalMobile.reverse()
      
            this.onModalShow.reverse()
              .eventCallback(
                'onReverseComplete', 
                () => 
              {
                this.onModal.reverse()
                  .eventCallback(
                    'onReverseComplete', 
                    () => 
                  {
                    this.elements.modal.style.display = 'none'
                    this.modal.enlarged = false

                    resolve()
                  }
                )
              }
            )
          }
        }
      }
    )
  }

  /* 
    EVENTLISTENERS.
  */

  addEventListeners()
  {
    super.addEventListeners()

    this.elements.modal_images_div.forEach(
      (div, idx) => 
      {
        this.createMotionElement(this.elements.modal_images_figure[idx])

        div.addEventListener('mouseenter', this.onModalImagesEnter.bind(this, idx))
        div.addEventListener('mouseleave', this.onModalImagesLeave.bind(this, idx))
        div.addEventListener('click', this.onModalChangeSelection.bind(this, idx))
      }
    )

    this.elements.links.forEach(
      (link, idx) =>
      {
        link.addEventListener('click', this.onModalEnlarge.bind(this, idx))
      }
    )
    
    this.elements.modal_close.addEventListener('click', this.onModalClose.bind(this))
    this.elements.back.addEventListener('click', this.onBack.bind(this))
  }

  removeEventListeners()
  {
    super.removeEventListeners()

    this.elements.modal_images_div.forEach(
      (div, idx) => 
      {
        div.removeEventListener('mouseenter', this.onModalImagesEnter)
        div.removeEventListener('mouseleave', this.onModalImagesLeave)
        div.removeEventListener('click', this.onModalChangeSelection)
      }
    )

    this.elements.links.forEach(
      (link, idx) =>
      {
        link.removeEventListener('click', this.onModalEnlarge)
      }
    )
    
    this.elements.modal_close.removeEventListener('click', this.onModalClose)

    this.elements.back.removeEventListener('click', this.onBack)
  }
}
