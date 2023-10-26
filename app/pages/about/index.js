import gsap from 'gsap'

import Page from 'classes/Page'
import Show from 'animations/Show'

import { COLOR_CULTURED, COLOR_NIGHT } from '../../utils/color_variables'

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
    this.createElements()
  }

  createElements()
  {
    this.contact = document.querySelector('.about__contact__details')

    this.copy_message = document.querySelector('.about__contact__details__copied')
    this.copy_animation = new Show(this.copy_message)
  }

  createContact()
  {
    this.email = this.contact.childNodes[1].querySelector('.word').innerHTML

    this.contact.onclick = () =>
    {
      navigator.clipboard.writeText(this.email)

      gsap.to(this.copy_message,
      {
        opacity: 1,
        duration: 1.0,
        onComplete: () =>
        {
          gsap.delayedCall(1.0, () =>
          {
            gsap.to(this.copy_message,
            {
              opacity: 0.0,
              duration: 1.0
            })
          })
        }
      })

      this.copy_animation.init()
    }
  }

  /*
    EVENTS.
  */

  onLeave()
  {
    this.contact.onclick = null
  }

  show()
  {
    super.show()

    gsap.delayedCall(1.0, () =>
    {
      this.createContact()
    })
  }

  hide()
  {
    super.hide()
    this.onLeave()
  }
}
