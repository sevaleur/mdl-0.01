import Splitting from 'splitting'
import gsap from 'gsap'

export default class Show
{
  constructor(element)
  {
    this.element = element

    Splitting({
      target: this.element,
      by: 'chars'
    })
  }

  init()
  {
    this.chars = this.element.querySelectorAll('.char')

    this.animate_in()
  }

  reset()
  {
    this.animate_out()
  }

  animate_in()
  {
    gsap.set(this.chars,
    {
      opacity: 0
    })

    gsap.fromTo(this.chars,
    {
      x: '-50%',
    },
    {
      x: '0%',
      opacity: 1.0,
      stagger: 0.02,
      ease: 'power.inOut',
      duration: 0.4,
      delay: 0.4,
    })
  }

  animate_out()
  {
    gsap.to(this.chars,
    {
      z: '-50%',
      opacity: 0.0,
      stagger: 0.02,
      ease: 'power.inOut',
      duration: 0.4,
    })
  }
}
