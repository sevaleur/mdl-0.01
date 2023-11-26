import gsap from 'gsap'
import { Flip } from 'gsap/all'

gsap.registerPlugin(Flip)

import Page from 'classes/Page'
import Show from 'animations/Show'

import { COLOR_NIGHT, COLOR_CULTURED } from 'utils/color_variables'

export default class Home extends Page
{
  constructor()
  {
    super({
      id: 'home',
      element: '.home',
      elements: {
        title: '.home__title__text',
        showcase: '.home__gallery__showcase__title__text'
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

    const GRID = document.querySelector('.home__gallery__showcase')
    const TITLES = Array.from(document.querySelectorAll('h3'))
    const TYPES = Array.from(document.querySelectorAll('.home__gallery__image__info__type__text'))
    const TITLE = document.querySelector('.home__gallery__showcase__title')
    const LEN = this.elms.length

    this.createTitles(TITLES, TYPES)
    this.createShowcase(TITLE, LEN, GRID)
  }

  createTitles(TITLES, TYPES)
  {
    this.main = new Show(this.elements.title)
    this.st = new Show(this.elements.showcase)

    this.title = []
    this.type = []
    TITLES.forEach(
      (t, i) => 
      {
        this.title.push(new Show(t))
        this.type.push(new Show(TYPES[i]))
      }
    )
  }

  createShowcase(TITLE, LEN, GRID)
  {
    if(LEN > 1)
    {
      const HALF = Math.floor( LEN / 2 ) 
      const MID_EL = this.elms[HALF]
  
      this.active = MID_EL
      this.onSelect(HALF)
  
      this.elms.forEach( 
        (el, i) => 
      { 
        this.createGrid( el, i, LEN, TITLE, GRID ) 
  
        el.addEventListener('mouseenter', () => 
        {
          const STATE = Flip.getState(this.elms)
          this.createState( el, i, HALF, MID_EL, LEN )
          Flip.from(STATE, { scale: true, duration: 0.5, ease: 'power2.inOut' })
        } ) 
      })
    }
    else 
    {
      this.active = this.elms[0]
      this.createGrid( this.elms[0], 0, LEN, TITLE ) 
      this.onSelect(0)
    }
  }

  createGrid(el, i, LEN, TITLE, GRID )
  {
    TITLE.classList.add('grid__title')
    el.classList.add(`grid__${i}`)

    TITLE.dataset.grid=LEN
    el.dataset.grid=LEN

    if(LEN > 2)
      GRID.dataset.grid=LEN

    if(el !== this.active)
    {
      el.dataset.active = false
      el.firstChild.style.visibility = 'hidden'
    }
    else 
    {
      el.dataset.active = true
      el.firstChild.style.visibility = 'visible'
    }
  }

  createState(el, i, HALF, MID_EL, LEN )
  {
    if(el === this.active) return

    let former = this.active
    let formerIdx = this.elms.indexOf(former)
    former.dataset.active = false
    former.firstChild.style.visibility = 'hidden'

    if(LEN > 2)
    {
      former === MID_EL
        ? i < HALF
          ? former.dataset.state = 'btm'
          : former.dataset.state = 'top'
        : MID_EL.dataset.state == 'btm'
          ? MID_EL.dataset.state = 'top'
          : MID_EL.dataset.state = 'btm'
    }

    this.active = el
    let activeIdx = this.elms.indexOf(el)
    this.onSelect(activeIdx, formerIdx)
    this.active.dataset.active = true
    this.active.firstChild.style.visibility = 'visible'
  }

  /*
    SHOW // HIDE - ANIMATIONS.
  */

  onSelect(aIdx, fIdx = null)
  {
    if(fIdx)
    {
      this.title[fIdx].hide()
      this.type[fIdx].hide()
    }

    fIdx === null
      ? gsap.delayedCall(1.5, () => { this.title[aIdx].show(), this.type[aIdx].show() } )
      : gsap.delayedCall(0.5, () => { this.title[aIdx].show(), this.type[aIdx].show() } )
  }

  show()
  {
    super.show()

    this.main.show()
    this.st.show()
  }

  hide()
  {
    super.hide()

    this.main.hide()
    this.st.hide()

    this.title.forEach(
      t => 
      {
        t.hide()
      }
    )
  }

  /* 
    EVENTS.
  */  

}
