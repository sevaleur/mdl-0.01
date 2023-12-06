import EventEmitter from './EventEmitter'

export default class Sizes extends EventEmitter
{
  constructor()
  {
    super()

    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: Math.min(2, window.devicePixelRatio),
      tablet: false, 
      mobile: false
    }

    this.screen.desktop = this.screen.width > 1024 ? true : false
    this.screen.tablet = this.screen.width <= 1024 ? true : false
    this.screen.phone = this.screen.width <= 768 ? true : false

    window.addEventListener(
      'resize',
      () =>
      {
        this.screen.width = window.innerWidth
        this.screen.height = window.innerHeight
        this.screen.ratio = Math.min(2, window.devicePixelRatio)

        this.screen.desktop = this.screen.width > 1024 ? true : false
        this.screen.tablet = this.screen.width <= 1024 ? true : false
        this.screen.phone = this.screen.width <= 768 ? true : false

        if(this.screen.tablet)
        {
          this.screen.phone = false 
        }
        else if(this.screen.phone)
        {
          this.screen.tablet = false 
        }
        else 
        {
          this.screen.tablet = false 
          this.screen.phone = false
        }

        this.trigger('resize')
     }
    )
  }
}