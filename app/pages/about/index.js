import Page from 'classes/Page'

import { COLOR_CULTURED, COLOR_NIGHT } from 'utils/color_variables'

export default class About extends Page
{
  constructor()
  {
    super({
      id: 'about',
      element: '.about',
      elements: {
        wrapper: '.about__wrapper',
        title: '.about__title'
      },
      background: COLOR_CULTURED, 
      color: COLOR_NIGHT
    })
  }

  /*
    CREATE.
  */

  create()
  {
    super.create()
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
