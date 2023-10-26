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
      mobile: false
    }

    this.screen.mobile = this.screen.width > 1024 ? false : true

    window.addEventListener(
      'resize',
      () =>
      {
        this.screen.width = window.innerWidth
        this.screen.height = window.innerHeight
        this.screen.ratio = Math.min(2, window.devicePixelRatio)

        this.screen.mobile = this.screen.width > 1024 ? false : true

        this.trigger('resize')
     }
    )
  }
}