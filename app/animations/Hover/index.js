import Splitting from 'splitting'
import gsap from 'gsap'

export default class Hover
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
    this.createMotion()
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

  createMotion()
  {
    this.onShow = gsap.to(
      this.chars,
    {
      duration: 0.8,
      opacity: 1.0,
      ease: 'power2.inOut',
      xPercent: 0,
      paused: true
    })
  }

  show()
  { 
    this.chars.forEach(
      char => 
      {
        char.style.display = 'block'
      }
    )
    
    this.onShow.play()
  }

  hide()
  {
    this.onShow.reverse() 
  }
}