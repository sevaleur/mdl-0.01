import gsap from 'gsap'
import Splitting from 'splitting'

import Animation from 'classes/Animation'

export default class Label extends Animation
{
  constructor({element, elements})
  {
    super({
      element,
      elements
    })

    Splitting({
      target: this.element,
      by: 'words'
    })

    this.words = this.element.querySelectorAll('.word')
  }

  show()
  {
    this.tl_in = gsap.timeline({
      delay: 0.5
    })

    this.tl_in.set(
      this.words,
    {
      opacity: 0,
      y: '100%'
    })

    this.words.forEach(
      word =>
    {
      this.tl_in.to(
        word,
        {
          opacity: 1,
          duration: 1.,
          ease: 'expo.out',
          y: '0%',
          stagger: 0.03
        }, 0)
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
