import gsap from 'gsap'
import Splitting from 'splitting'

import Animation from 'classes/Animation'

export default class Title extends Animation
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

    this.chars = this.element.querySelectorAll('.char')
  }

  show()
  {
    this.tl_in = gsap.timeline({
      delay: 0.5
    })

    this.tl_in.set(
      this.chars,
    {
      opacity: 0,
      y: '100%'
    })

    this.tl_in.to(
      this.chars,
    {
      opacity: 1,
      duration: 1.,
      ease: 'back.inOut(2)',
      y: '0%',
      stagger: 0.03,
    }, 0)
  }

  hide()
  {
    gsap.set(
      this.chars,
    {
      opacity: 0,
      y: '100%'
    })
  }
}
