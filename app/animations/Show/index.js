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

    this.init()
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
    })
  }

  init()
  {
    this.chars = this.element.querySelectorAll('.char')
    this.wrap(this.chars, 'span', 'wrap')
  }

  show()
  { 
    gsap.set(
      this.chars,
    {
      xPercent: -250,
      opacity: 0.0,
    })

    gsap.to(
      this.chars,
    {
      duration: 1,
      opacity: 1.0,
      ease: 'power2',
      xPercent: 0,
      stagger: 0.06,
      onComplete: () => 
      {
        this.complete = true
      }
    })
  }

  hide(dir=false)
  {
    if(dir)
    {
      gsap.to(
        this.chars,
        {
          duration: 1.0,
          opacity: 0.0,
          ease: 'power2',
          xPercent: 250,
          stagger: 0.06,
        }
      )
    }
    else 
    {
      gsap.to(
        this.chars,
        {
          duration: 1.0,
          opacity: 0.0,
          ease: 'power2',
          xPercent: -250,
          stagger: -0.06,
          onComplete: () => 
          {
            gsap.to(
              this.chars, 
              {
                duration: 1.0,
                opacity: 0.0,
                ease: 'power2',
                xPercent: -250,
              }
            )
          }
        }
      )
    }
  }
}
