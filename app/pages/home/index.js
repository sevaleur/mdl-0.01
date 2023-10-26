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
}
