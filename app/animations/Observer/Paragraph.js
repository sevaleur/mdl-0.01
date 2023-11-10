import gsap from 'gsap'
import Splitting from 'splitting'

import Animation from 'classes/Animation'

export default class Paragraph extends Animation
{
  constructor({element, elements})
  {
    super({
      element,
      elements
    })

    this.split = Splitting({
      target: this.element,
      by: 'lines'
    })

    this.lines = this.split[0].lines
  }

  show()
  {
    this.tl_in = gsap.timeline({
      delay: 0.5
    })

    this.tl_in.set(
      this.lines,
    {
      opacity: 0,
      y: '100%'
    })

    this.tl_in.to(
      this.lines,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 1.,
      ease: 'expo.out',
      stagger: 0.005
    }, 0)

  }

  hide()
  {
    gsap.set(
      this.lines,
      {
        opacity: 0
      })
  }
}
