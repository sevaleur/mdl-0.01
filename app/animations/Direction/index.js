import Splitting from 'splitting'
import gsap from 'gsap'

export default class Direction
{
  constructor(element)
  {
    this.element = element

    Splitting({
      target: this.element,
      by: 'chars'
    })

    this.chars = this.element.querySelectorAll('.char')
    this.wrap(this.chars, 'span', 'wrap')
  }

  wrap(elms, type, cl)
  {
    elms.forEach(
      char => 
    {
        const el = document.createElement(type)
        el.classList = cl
        char.parentNode.appendChild(el)
        el.appendChild(char)

        gsap.set(
          char, 
          {
            opacity: 0.0, 
            xPercent: -150
          }
        )
    })
  }

  show()
  { 
    gsap.to(
      this.chars,
    {
      duration: 0.5,
      opacity: 1.0,
      ease: 'power2',
      xPercent: 0,
      stagger: 0.06,
    })
  }

  hide()
  {
    gsap.to(
      this.chars,
    {
      duration: 0.5,
      opacity: 1.0,
      ease: 'power2',
      xPercent: 150,
      stagger: 0.06,
    })
  }
}