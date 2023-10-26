import { PerspectiveCamera } from 'three'

export default class Camera 
{
  constructor({ canvas, screen, scene })
  {
    this.canvas = canvas
    this.screen = screen 
    this.scene = scene 

    this.createInstance()
  }

  createInstance()
  {
    this.instance = new PerspectiveCamera(
      70, 
      this.screen.width / this.screen.height, 
      0.1, 
      100
    )
    this.instance.position.set(0, 0, 2)
    this.scene.add(this.instance)
  }

  onResize()
  {
    this.instance.aspect = this.screen.width / this.screen.height
    this.instance.updateProjectionMatrix()
  }

  update()
  {
    
  }
}