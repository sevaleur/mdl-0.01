import Page from 'classes/Page'
import Show from 'animations/Show'

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

  create()
  {
    super.create()
  }

  show()
  {
    super.show()

    gsap.to(
      '.gallery__info', 
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
