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

    this.chars = this.element.querySelectorAll('.char')
    this.wrap(this.chars, 'span', 'wrap')
    this.create()
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

  create()
  {
    this.onShow = gsap.to(
      this.chars,
    {
      duration: 0.5,
      opacity: 1.0,
      ease: 'power2',
      xPercent: 0,
      stagger: 0.06,
      paused: true,
    })
  }

  show()
  { 
    this.onShow.play()
  }

  hide()
  {
    this.onShow.reverse()
  }
}
