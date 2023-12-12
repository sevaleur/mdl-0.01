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
    })
  }
}
