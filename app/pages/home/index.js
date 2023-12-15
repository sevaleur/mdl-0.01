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
        showcase_elem_images: '.home__gallery__image', 
        showcase_targets: '.home__gallery__image__figure', 
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
      flip: {
        targets: this.elements.showcase_targets, 
        config: {
          absolute: this.elements.showcase_targets,
          nested: true, 
          duration: 0.8, 
          ease: 'power2.inOut', 
          onComplete: () => { this.onSelect(this.aIdx, this.fIdx) }
        }
      },
      animations: {
        titles: [], 
        types: []
      }
    }

    this.createTitles()
    this.createShowcase()
  }

  createTitles()
  {
    this.main = new Show(this.elements.title)
    this.st = new Show(this.elements.showcase_title_text)

    if(this.showcase.length > 1)
    {
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
    else 
    {
      this.showcase.animations.titles.push(
        new Show(this.elements.showcase_elem_titles)
      )

      this.showcase.animations.types.push(
        new Show(
          this.elements.showcase_elem_types
        )
      )
    }
  }

  createShowcase()
  {
    this.elements.showcase_title.classList.add('grid__title')

    if(this.showcase.length > 1)
    {
      this.elements.showcase.dataset.grid=this.showcase.length
      this.elements.showcase_title.dataset.grid=this.showcase.length 

      this.half = Math.floor( this.showcase.length / 2 ) 
      this.mid = this.showcase.elements[this.half]
  
      this.active = this.mid
      
      this.onSelect(this.half)
  
      this.showcase.elements.forEach( 
        (el, idx) => 
        { 
          this.createGrid(el, idx) 
          this.onDeviceCheck(el)
        }
      )

      let device = this.showcase.elements[0].dataset.device
      this.elements.showcase.dataset.device = device

      if(device === 'desktop')
        this.elements.showcase_title.dataset.device = device
    }
    else 
    { 
      this.active = this.elements.showcase_elem_images
      this.active.dataset.grid = 1
      this.active.dataset.active = true
      this.active.classList.add(`grid__0`)
      
      
      this.onDeviceCheck(this.elements.showcase_elem_images)
      this.onSelect(0)
      
      let device = this.elements.showcase_elem_images.dataset.device
      this.elements.showcase.dataset.device = device
      
      if(device === 'desktop')
      {
        this.elements.showcase_title.dataset.device = device
        this.elements.showcase_title.dataset.grid = 1
      }
    }
  }

  createGrid(el, idx)
  {
    el.classList.add(`grid__${idx}`)
    el.dataset.grid=this.showcase.length

    if(el !== this.active)
    {
      el.dataset.active = false
      el.dataset.state = 'small'
      el.firstChild.style.visibility = 'hidden'
    }
    else 
    {
      el.dataset.active = true
      el.dataset.state = 'large'
      el.firstChild.style.visibility = 'visible'
    }
  }

  createState(el, idx)
  {
    let former, 
        formerIdx, 
        activeIdx, 
        fData

    switch(idx)
    {
      case 0: 
        fData = this.onSetFormer(former, formerIdx)
        this.fIdx = fData.formerIdx

        if(this.showcase.length > 1)
          this.mid.dataset.state = 'btm'

        this.aIdx = this.onSetActive(el, activeIdx)
      break 

      case 1: 
        fData = this.onSetFormer(former, formerIdx)
        this.fIdx = fData.formerIdx
        this.aIdx = this.onSetActive(el, activeIdx)
      break 
      
      case 2:
        fData = this.onSetFormer(former, formerIdx)
        this.fIdx = fData.formerIdx

        this.mid.dataset.state = 'top'

        this.aIdx = this.onSetActive(el, activeIdx)
      break 

      default: 
      break
    }
  }

  /*
    EVENTS.
  */

  onSetFormer(former, formerIdx)
  {
    former = this.active 
    formerIdx = this.showcase.elements.indexOf(former)
    former.dataset.state = 'small'
    former.firstChild.style.visibility = 'hidden'
    former.dataset.active = false

    return { former, formerIdx }
  }

  onSetActive(el, activeIdx)
  {
    this.active = el 
    this.active.firstChild.style.visibility = 'visible'
    activeIdx = this.showcase.elements.indexOf(el)
    this.active.dataset.state = 'large'
    this.active.dataset.active = true

    return activeIdx
  }

  onMouseEnter(el, idx)
  {
    if(el === this.active) return 

    this.state = Flip.getState(this.showcase.flip.targets)
    this.createState(el, idx)
    Flip.from(this.state, this.showcase.flip.config)
  }

  onSelect(aIdx, fIdx = null)
  {
    if(fIdx === null)
    {
      gsap.delayedCall(
        2.5, () => 
        { 
          this.showcase.animations.titles[aIdx].show() 
          this.showcase.animations.types[aIdx].show() 
        } 
      )
    }
    else 
    {
      this.showcase.animations.titles[fIdx].hide(true)
      this.showcase.animations.types[fIdx].hide(true)
      this.showcase.animations.titles[aIdx].show()
      this.showcase.animations.types[aIdx].show() 
    }
  }

  onDeviceCheck(el)
  {
    this.device.desktop
      ? el.dataset.device = 'desktop'
      : el.dataset.device = 'mobile'
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
    
    this.showcase.elements.forEach( 
      (el, idx) => 
      { 
        this.device.desktop
          ? el.addEventListener('mouseenter', this.onMouseEnter.bind(this, el, idx)) 
          : el.addEventListener('click', this.onMouseEnter.bind(this, el, idx))
      }
    )
  }

  removeEventListeners()
  {
    super.removeEventListeners()

    this.showcase.elements.forEach( 
      (el, idx) => 
      { 
        this.device.desktop
          ? el.removeEventListener('mouseenter', this.onMouseEnter) 
          : el.removeEventListener('click', this.onMouseEnter)
      }
    )
  }
}