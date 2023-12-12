import gsap from 'gsap'
import { Flip } from 'gsap/all'

gsap.registerPlugin(Flip)

import Page from 'classes/Page'
import Show from 'animations/Show'

import { COLOR_NIGHT, COLOR_CULTURED } from 'utils/color_variables'

export default class Home extends Page
{
  constructor({ device })
  {
    super({
      id: 'home',
      element: '.home',
      elements: {
        title: '.home__title__text',
        showcase: '.home__gallery__showcase',
        showcase_title: '.home__gallery__showcase__title',
        showcase_title_text: '.home__gallery__showcase__title__text', 
        showcase_elem_titles: 'h3',
        showcase_elem_types: '.home__gallery__image__info__type__text',
        showcase_elem_images: '.home__gallery__image'
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

    this.showcase = { 
      elements: Array.from(this.elements.showcase_elem_images),
      length: this.elements.showcase_elem_images.length, 
      animations: {
        titles: [], 
        types: []
      }
    }

    this.createTitles()

    if(this.device.desktop)
    {
      this.createShowcase()
    }
  }

  createTitles()
  {
    this.main = new Show(this.elements.title)
    this.st = new Show(this.elements.showcase_title_text)

    this.elements.showcase_elem_titles.forEach(
      (t, idx) => 
      {
        this.showcase.animations.titles.push(
          new Show(t)
        )

        this.showcase.animations.types.push(
          new Show(
            this.elements.showcase_elem_types[idx]
          )
        )
      }
    )
  }

  createShowcase()
  {
    if(this.showcase.length > 1)
    {
      this.half = Math.floor( this.showcase.length / 2 ) 
      this.mid = this.showcase.elements[this.half]
  
      this.active = this.mid
      this.onSelect(this.half)
  
      this.showcase.elements.forEach( 
        (el, idx) => 
        { 
          this.createGrid( el, idx ) 
        }
      )
    }
    else 
    {
      this.active = this.showcase.elements[0]
      this.createGrid( this.showcase.elements[0], 0 ) 
      this.onSelect(0)
    }
  }

  createGrid(el, idx )
  {
    this.elements.showcase_title.classList.add('grid__title')
    el.classList.add(`grid__${idx}`)

    this.elements.showcase_title.dataset.grid=this.showcase.length
    el.dataset.grid=this.showcase.length

    if(this.showcase.length > 2)
      this.elements.showcase.dataset.grid=this.showcase.length

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

  createState(el, idx)
  {
    if(el === this.active) return

    let former = this.active
    let formerIdx = this.showcase.elements.indexOf(former)
    former.dataset.active = false
    former.firstChild.style.visibility = 'hidden'

    if(this.showcase.length > 2)
    {
      former === this.mid
        ? idx < this.half
          ? former.dataset.state = 'btm'
          : former.dataset.state = 'top'
        : this.mid.dataset.state == 'btm'
          ? this.mid.dataset.state = 'top'
          : this.mid.dataset.state = 'btm'
    }

    this.active = el
    let activeIdx = this.showcase.elements.indexOf(el)
    this.onSelect(activeIdx, formerIdx)
    this.active.dataset.active = true
    this.active.firstChild.style.visibility = 'visible'
  }

  /*
    EVENTS.
  */

  onMouseEnter(el, idx)
  {
    this.state = Flip.getState(this.showcase.elements)
    this.createState(el, idx)
    Flip.from(this.state, { scale: true, nested: true, duration: 0.5, ease: 'power2.inOut' })
  }

  onSelect(aIdx, fIdx = null)
  {
    if(fIdx)
    {
      this.showcase.animations.titles[fIdx].hide()
      this.showcase.animations.types[fIdx].hide()
    }

    if(fIdx === null)
    {
      gsap.delayedCall(
        1.5, () => 
        { 
          this.showcase.animations.titles[aIdx].show() 
          this.showcase.animations.types[aIdx].show() 
        } 
      )
    }
    else 
    {
      gsap.delayedCall(
        0.5, () => 
        { 
          this.showcase.animations.titles[aIdx].show()
          this.showcase.animations.types[aIdx].show() 
        } 
      )
    }
  }

  /* 
    ANIMATIONS.
  */

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

    this.showcase.animations.titles.forEach(
      t => 
      {
        t.hide()
      }
    )
  }

  /* 
    EVENTLISTENERS.
  */  

  addEventListeners()
  {
    super.addEventListeners()

    if(this.device.desktop)
    {
      this.showcase.elements.forEach( 
        (el, idx) => 
        { 
          el.addEventListener('mouseenter', this.onMouseEnter.bind(this, el, idx)) 
        }
      )
    }
  }

  removeEventListeners()
  {
    super.removeEventListeners()

    if(this.device.desktop)
    {
      this.showcase.elements.forEach( 
        (el, idx) => 
        { 
          el.removeEventListener('mouseenter', this.onMouseEnter) 
        }
      )
    }
  }
}
