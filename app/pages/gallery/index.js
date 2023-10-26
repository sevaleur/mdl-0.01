import Page from 'classes/Page'
import Show from 'animations/Show'

import { COLOR_CULTURED, COLOR_NIGHT } from 'utils/color_variables'

export default class Gallery extends Page
{
  constructor()
  {
    super({
      id: 'gallery',
      element: '.gallery',
      elements: {
        title: '.gallery__info__title'
      }, 
      background: COLOR_NIGHT, 
      color: COLOR_CULTURED
    })
  }

  show()
  {
    super.show()

    this.an_in = new Show(this.elements.title)
    this.an_in.init()
  }

  hide()
  {
    super.hide()

    this.an_in.animate_out()
  }
}
