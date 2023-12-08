import gsap from 'gsap'

export default class ColorManager
{
  constructor({ device })
  {
    this.device = device
  }

  change({ backgroundColor, color })
  {
    gsap.to(
      document.documentElement,
    {
      backgroundColor,
      color,
      duration: 1.0,
    })

    if(this.device.desktop)
    {
      gsap.to(
        '.navigation__list',
        {
          color,
          duration: 1.0
        }
      )
    }
  }
}
