import gsap from 'gsap'

export default class Line
{
  constructor(element)
  {
    this.element = element 

    this.createAnimation()
  }

  createAnimation()
  {
    this.scaleY = gsap.to(
      this.element, 
      {
        scaleY: 0.5, 
        duration: 1.0, 
        ease: 'power2', 
        paused: true
      }
    )
  }

  show()
  {
    this.scaleY.play()
  }

  hide()
  {
    this.scaleY.reverse()
  }
}