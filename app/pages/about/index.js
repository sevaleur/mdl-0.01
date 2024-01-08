import Page from 'classes/Page'

import { COLOR_CULTURED, COLOR_NIGHT } from 'utils/color_variables'

export default class About extends Page
{
  constructor({ device })
  {
    super({
      id: 'about',
      element: '.about',
      elements: {
        wrapper: '.about__wrapper',
        title: '.about__title'
      },
      background: COLOR_CULTURED, 
      color: COLOR_NIGHT,
      device: device
    })
  }

  /*
    CREATE.
  */

  create()
  {
    super.create()

    this.createAnimations()
  }

  createAnimations()
  {
    super.createAnimations(true)
  }

  /*
    EVENTS.
  */

  show()
  {
    super.show()
  }

  hide()
  {
    super.hide()
  }
}
