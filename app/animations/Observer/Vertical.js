import gsap from 'gsap'
import Splitting from 'splitting'

import Animation from 'classes/Animation'

export default class Vertical extends Animation
{
  constructor({element, elements})
  {
    super({
      element,
      elements
    })

    Splitting({
      target: this.element,
      by: 'chars'
    })

    this.words = this.element.querySelectorAll('.char')
  }

  show()
  {
    this.tl_in = gsap.timeline({
      delay: 0.5
    })

    this.tl_in.set(
      this.words,
    {
      opacity: 0
    })

    this.tl_in.to(
      this.words,
    {
      opacity: 1,
      ease: 'expo.out',
      duration: 1.5,
      stagger: 0.03
    })
  }

  hide()
  {
    gsap.set(
      this.words,
      {
        opacity: 0
      })
  }
}
