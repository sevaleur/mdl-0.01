import Page from 'classes/Page'
import Show from 'animations/Show'

import { COLOR_CULTURED, COLOR_NIGHT } from '../../utils/color_variables'

export default class Video extends Page
{
  constructor()
  {
    super({
      id: 'video',
      element: '.video',
      elements: {
        text: '.video__desc__text'
      }, 
      background: COLOR_NIGHT, 
      color: COLOR_CULTURED
    })
  }

  show()
  {
    super.show()

    this.p_an = []
    this.elements.text.forEach((p, index) =>
    {
      this.p_an.push(new Show(p))
      this.p_an[index].show()
    })
  }

  hide()
  {
    super.hide()

    this.p_an.forEach(el =>
    {
      el.hide()
    })
  }
}
