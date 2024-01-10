import { TextureLoader } from 'three'
import gsap from 'gsap'

import Component from "classes/Component"

export default class Preloader extends Component
{
  constructor({ canvas })
  {
    super({
      element: '.preloader',
      elements: {
        numberText: '.preloader__number__text'
      }
    })

    this.canvas = canvas

    this.loaded = 0
    this.finished = false

    window.IMAGE_TEXTURES = {}

    this.createLoader()
  }

  /*
    CREATE.
  */

  createLoader()
  {
    const textureLoader = new TextureLoader()

    window.ASSETS.forEach(
      image => 
      {
        const texture = textureLoader.load(
          image,
          (data) => 
          {
            window.IMAGE_TEXTURES[image] = data
            this.onAssetLoaded()
          }  
        )
      }
    )
  }

  /*
    EVENTS.
  */

  onAssetLoaded()
  {
    this.loaded += 1

    this.percent = this.loaded / window.ASSETS.length

    this.elements.numberText.innerHTML = `${Math.round(this.percent * 100)}`

    this.animateLines()

    if(this.percent === 1)
      this.onLoaded()
  }

  onLoaded()
  {
    return new Promise(resolve =>
    {
      gsap.to(
        this.element,
        {
          opacity: 0.0,
          duration: 0.5,
          delay: 0.5,
          onComplete: () =>
          {
            this.emit('completed')
          }
        }
      )
    })
  }

  /*
    ANIMATIONS.
  */

  animateLines()
  {
    gsap.to([
      '.bottom',
      '.pretop'
    ],
    {
      scaleX: this.percent,
      ease: 'power2.inOut'
    })

    gsap.to([
      '.left',
      '.right',
    ],
    {
      scaleY: this.percent,
      ease: 'power2.inOut'
    })
  }

  /*
    DESTROY.
  */

  destroy()
  {
    this.element.parentNode.removeChild(this.element)
  }
}
