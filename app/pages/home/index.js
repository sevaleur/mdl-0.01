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
    
    const LEN = this.elms.length

    if(LEN > 1)
    {
      const HALF = Math.floor( LEN / 2 ) 
      const MID_EL = this.elms[HALF]
  
      this.active = MID_EL
      this.active.dataset.active = true
      this.active.firstChild.style.visibility = 'visible'
  
      this.onGridSelect(this.active)
  
      this.elms.forEach( 
        (el, i) => 
      { 
        this.createGrid( el, i, LEN ) 
  
        el.addEventListener('mouseenter', () => 
        {
          const STATE = Flip.getState(this.elms)
          this.createState( el, i, HALF, MID_EL )
          Flip.from(STATE, { scale: true, duration: 0.5, ease: 'power1.inOut' })
        } ) 
      })
    }
    else 
    {
      this.active = this.elms[0]
      this.active.dataset.active = true
      this.active.firstChild.style.visibility = 'visible'

      this.createGrid( this.elms[0], 0, LEN ) 
    }
  }

  createGrid(el, i, LEN )
  {
    el.classList.add(`grid__${i}`)
    el.dataset.grid=LEN

    if(el !== this.active)
    {
      el.dataset.active = false
      el.firstChild.style.visibility = 'hidden'
    }
  }

  createState(el, i, HALF, MID_EL )
  {
    if(el === this.active) return

    let former = this.active
    former.dataset.active = false
    former.firstChild.style.visibility = 'hidden'

    former === MID_EL
      ? i < HALF
        ? former.dataset.state = 'btm'
        : former.dataset.state = 'top'
      : MID_EL.dataset.state == 'btm'
        ? MID_EL.dataset.state = 'top'
        : MID_EL.dataset.state = 'btm'

    this.active = el
    this.onGridSelect(el, former)
    this.active.dataset.active = true
    this.active.firstChild.style.visibility = 'visible'
  }

  /*
    SHOW // HIDE - ANIMATIONS.
  */

  onGridSelect(active, former = undefined)
  {
    if(former)
    {
      let formerInfo = former.querySelector('.home__gallery__image__info')
      gsap.to(
        formerInfo, 
        {
          opacity: 0.0, 
          duration: .2,
        }
      )
    }

    let currentInfo = active.querySelector('.home__gallery__image__info')
    gsap.to(
      currentInfo, 
      {
        opacity: 1.0, 
        duration: .5,
        delay: 0.2
      }
    )
  }

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
