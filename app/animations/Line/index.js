import gsap from 'gsap'

export default class Line
{
  constructor(element, vector=false, scaleXMod=false)
  {
    this.element = element 

    this.createAnimation(vector, scaleXMod)
  }

  createAnimation(vector, scaleXMod)
  {
    if(!vector && !scaleXMod)
    {
      this.scaleY = gsap.to(
        this.element, 
        {
          scaleY: 0.25, 
          duration: 1.0, 
          ease: 'power2', 
          paused: true
        }
      )
    }
    else if(vector && scaleXMod)
    {
      this.scaleX = gsap.to(
        this.element, 
        {
          scaleX: scaleXMod, 
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