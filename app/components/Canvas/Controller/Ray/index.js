import { Raycaster, Vector2 } from 'three'
import gsap from 'gsap'

export default class Ray 
{
  constructor({ scene, screen, camera })
  {
    this.scene = scene
    this.screen = screen
    this.camera = camera
  }

  init({ obj })
  {
    this.objects = obj
    this.ray = new Raycaster()

    this.mouse = {
      x: 0, 
      y: 0,
      pX: 0, 
      pY: 0, 
      vX: 0, 
      vY: 0
    }

    window.onmousemove = (e) => { this.onMouseMove(e) }
  }

  onMouseMove(e)
  {
    this.mouse.x = e.clientX / this.screen.width * 2 - 1
    this.mouse.y = -(e.clientY / this.screen.height * 2 - 1)

    this.mouse.vX = this.mouse.x - this.mouse.pX 
    this.mouse.vY = this.mouse.y - this.mouse.pY 

    this.mouse.pX = this.mouse.x 
    this.mouse.pY = this.mouse.y
  }

  update()
  {
    this.ray.setFromCamera(this.mouse, this.camera)

    const intersects = this.ray.intersectObjects( [ ...this.objects ] )
    if(intersects.length > 0)
    {
      let obj = intersects[0].object
    
      gsap.to(
        obj.material.uniforms.u_hover.value,
        {
          x: intersects[0].uv.x * 2 - 1, 
          y: intersects[0].uv.y * 2 - 1, 
          duration: 1.0, 
          ease: 'linear'
        }
      )
    }
  }
}