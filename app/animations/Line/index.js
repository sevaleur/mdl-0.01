import gsap from 'gsap'

export default class Line
{
  constructor(element, vector=false)
  {
    this.element = element 

    this.createAnimation(vector)
  }

  createAnimation(vector)
  {
    if(!vector)
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
    else 
    {
      this.scaleX = gsap.to(
        this.element, 
        {
          scaleX: 1.0, 
          duration: 1.0, 
          ease: 'power2', 
          paused: true
        }
      )
    }
  }

  show(x=false)
  {
    x 
      ? this.scaleX.play() 
      : this.scaleY.play()
  }

  hide(x=false)
  {
    x
      ? this.scaleX.reverse()
      : this.scaleY.reverse()
  }
}