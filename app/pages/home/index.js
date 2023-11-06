import gsap from 'gsap'
import { Flip } from 'gsap/all'

gsap.registerPlugin(Flip)

import Page from 'classes/Page'

import { COLOR_NIGHT, COLOR_CULTURED } from 'utils/color_variables'

export default class Home extends Page
{
  constructor()
  {
    super({
      id: 'home',
      element: '.home',
      elements: {
        logo: '.home__logo'
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

    this.elms = Array.from(document.querySelectorAll('.home__gallery__image'))
    this.gl = this.elms.length

    this.createGrid()
  }

  createGrid()
  {
    this.elms[1].classList.add('large__1')

    this.elms.forEach(
      (el, i) => 
      {
        if(el.classList.contains(`large__${i}`))
        {
          el.firstChild.style.visibility = 'visible'
          el.dataset.active = true 
          this.active = el

          gsap.to(
            this.active.firstChild, 
            {
              opacity: 1.0,
              duration: 0.5
            }
          )
        }

        if(el != this.active)
        {
          el.dataset.active = false
          el.classList.add(`small__${i}`)
          el.firstChild.style.visibility = 'hidden'
        }

        el.addEventListener('mouseover', () => 
        {
          if(el === this.active) return
          
          gsap.to(
            this.active.firstChild,
            {
              opacity: 0.0,
              duration: 1.0,
            }
          )

          let state = Flip.getState(this.elms)

          let index = this.elms.indexOf(this.active)
          this.active.firstChild.style.visibility = 'hidden'

          if(index === 1)
          {
            this.active.classList.remove(`large__${index}`)

            i < index
              ? (this.active.classList.add(`small__${index}T`))
              : this.active.classList.add(`small__${index}B`)
          }
          else 
          {
            this.active.classList.toggle(`small__${index}`)
            this.active.classList.toggle(`large__${index}`)
          }

          if(i === 1)
          {
            el.classList.contains(`small__${i}T`) 
              ? el.classList.remove(`small__${i}T`)
              : el.classList.remove(`small__${i}B`)

            el.classList.add(`large__${i}`)
          }
          else 
          {
            i === 0
              ? (this.elms[1].classList.add(`small__1T`), this.elms[1].classList.remove(`small__1B`))
              : (this.elms[1].classList.add(`small__1B`), this.elms[1].classList.remove(`small__1T`))
            
            el.classList.toggle(`small__${i}`)
            el.classList.toggle(`large__${i}`)
          }

          el.firstChild.style.visibility = 'visible'
          
          Flip.from(state, { absolute: true, duration: 0.8, ease: 'power.inOut'})

          gsap.to(
            el.firstChild, 
            {
              opacity: 1.0,
              duration: 0.5
            }
          )
          
          this.active.dataset.active = false
          this.active = el 
          this.active.dataset.active = false
        })
      }
    )
  }

  /*
    SHOW // HIDE - ANIMATIONS.
  */

  show()
  {
    super.show()
  }

  hide()
  {
    super.hide()
  }

  /* 
    EVENTS.
  */  

}
