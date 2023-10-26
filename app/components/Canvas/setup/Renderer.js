import { WebGLRenderer } from 'three'

export default class Renderer 
{
  constructor({ canvas, screen, camera, scene })
  {
    this.canvas = canvas 
    this.screen = screen 
    this.camera = camera 
    this.scene = scene 

    this.createInstance()
  }

  createInstance()
  {
    this.instance = new WebGLRenderer({
      canvas: this.canvas, 
      antialias: true, 
      alpha: true
    })

    this.instance.setSize(this.screen.width, this.screen.height)
    this.instance.setPixelRatio(this.screen.ratio)
  }

  onResize()
  {
    this.instance.setSize(this.screen.width, this.screen.height)
    this.instance.setPixelRatio(this.screen.ratio)
  }

  update()
  {
    this.instance.render(this.scene, this.camera)
  }
}