import { Raycaster } from 'three'

import gsap from 'gsap'

export default class Ray 
{
  constructor({ scene, screen, camera, objs })
  {
    this.scene = scene
    this.screen = screen
    this.camera = camera

    this.create(objs)
  }

  create(objs)
  {
    this.os = []
    this.ray = new Raycaster()
    
    objs.forEach(
      o => 
      {
        this.os.push(o.plane)
      }
    )

    this.hits = {
      x: 0, 
      y: 0,
      pX: 0, 
      pY: 0, 
      vX: 0, 
      vY: 0
    }
  }

  destroy()
  {
    this.objects = null
    this.ray = null 
  }

  update(mouse)
  {
    this.ray.setFromCamera(mouse, this.camera)

    const intersects = this.ray.intersectObjects( this.os )

    if(intersects.length > 0)
    {
      this.hits.x = intersects[0].uv.x * 2 - 1
      this.hits.y = intersects[0].uv.y * 2 - 1
     
      this.hits.vX = this.hits.x - this.hits.pX 
      this.hits.vY = this.hits.y - this.hits.pY 
      
      this.o = intersects[0].object

      gsap.to(
        this.o.material.uniforms.u_hover.value,
        {
          x: this.hits.x, 
          y: this.hits.y, 
          duration: 0.8, 
          delay: 0.2, 
          ease: 'linear',
        }
      )

      gsap.to(
        this.o.rotation,
        {
          x: -this.hits.y * 0.02, 
          y: this.hits.x * 0.02, 
          duration: 0.4, 
          delay: 0.1, 
          ease: 'linear',
        }
      )

      this.hits.pX = this.hits.x 
      this.hits.pY = this.hits.y
    }
  }
}