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

    this.grid = null
  }

  /*
    CREATE.
  */

  create()
  {
    super.create()

    this.el = Array.from(document.querySelectorAll('.home__gallery__image'))
    this.gl = this.el.length

    this.createGrid(this.gl)
    this.addEventListeners()
  }

  createGrid(gl)
  {
    switch(gl)
    {
      case 5: 
        this.grid = 'five__'
        break 
      case 4: 
        this.grid = 'four__'
        break 
      case 3: 
        this.grid = 'three__'
        break 
      case 2: 
        this.grid = 'two__'
        break 
      case 1: 
        this.grid = 'one__'
        break 
      default: 
        break
    }
  }

  createState(g, i)
  {
    const state = Flip.getState(g)

    if(i === 0)
    {
      g.classList.toggle('flip')
      g.classList.toggle(`${this.grid}${i}`)
    }
    else 
    {
      g.classList.toggle(`${this.grid}${i}`)
      g.classList.toggle(`${this.grid}0`)
    }

    Flip.from(state, { absolute: true, duration: 1.0, ease: 'power.inOut'})
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

  addEventListeners()
  {
    if(this.gl > 1 && this.gl < 4)
    {
      this.el.forEach(
        (g, i) => 
        {
          g.onclick = () =>
          {
            this.createState(g, i)
          }
        }
      )
    }
  }
}
