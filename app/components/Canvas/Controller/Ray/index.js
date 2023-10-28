import { Raycaster, Vector2 } from 'three'

export default class Ray 
{
  constructor({ scene, screen, camera })
  {
    this.scene = scene
    this.screen = screen
    this.camera = camera
  }

  init(obj)
  {
    this.objects = obj
    this.mouse = new Vector2()
    this.hit = new Vector2()
    this.ray = new Raycaster()

    window.onmousemove = (e) => { this.onMouseMove(e) }
  }

  onMouseMove(e)
  {
    this.mouse.x = e.clientX / this.screen.width * 2 - 1
    this.mouse.y = -(e.clientY / this.screen.height * 2 - 1)
  }

  update()
  {
    this.ray.setFromCamera(this.mouse, this.camera)

    const intersects = this.ray.intersectObjects( this.objects )
    if(intersects.length > 0)
    {
      this.hit = intersects[0].uv
      console.log(this.hit)
    }
  }
}