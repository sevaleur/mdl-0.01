import { Raycaster } from 'three'

import gsap from 'gsap'

export default class Ray 
{
  constructor({ scene, screen, camera, objs })
  {
    this.scene = scene
    this.screen = screen
    this.camera = camera

    this.createObjects(objs)
  }

  /* 
    CREATE.
  */

  createObjects(objs)
  {
    this.os = []
    this.constant = {}
    this.temp = {}
    this.ray = new Raycaster()
    
    objs.forEach(
      o => 
      {
        this.os.push(o.plane)
        this.constant[o.plane.userData.template] = o.plane
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

  /* 
    OBJECT HANDLING.
  */

  addObjects(objs)
  {
    objs.forEach(
      o => 
      {
        if(!this.temp[o.plane.userData.uid])
        {
          this.temp[o.plane.userData.uid] = o.plane

          this.os.push(o.plane)
        }
      }
    )
  }

  removeObjects(template)
  {
    this.os.forEach(
      (o, index) => 
      {
        if(!this.constant[o.userData.template])
        {
          this.temp = {}
          this.os.splice(index, 1)
          this.checkObjects()
        }
      }
    )
  }

  checkObjects()
  {
    if(!Object.keys(this.temp).length)
    {
      if(Object.keys(this.constant).length !== this.os.length)
      {
        this.removeObjects()
      }
    }
  }

  /* 
    UPDATE.
  */

  update(mouse)
  {
    this.ray.setFromCamera(mouse, this.camera)

    const INTERSECTS = this.ray.intersectObjects( this.os )

    if(INTERSECTS.length > 0)
    {
      this.hits.x = INTERSECTS[0].uv.x * 2 - 1
      this.hits.y = INTERSECTS[0].uv.y * 2 - 1
     
      this.hits.vX = this.hits.x - this.hits.pX 
      this.hits.vY = this.hits.y - this.hits.pY 
      
      this.o = INTERSECTS[0].object

      gsap.to(
        this.o.material.uniforms.u_hover.value,
        {
          x: this.hits.x, 
          y: this.hits.y, 
          duration: 1.8, 
          delay: 0.2, 
          ease: 'linear',
        }
      )
      
      if(!this.constant[this.o.userData.template])
      {
        gsap.to(
          this.o.rotation,
          {
            x: -this.hits.y * 0.01, 
            y: this.hits.x * 0.01, 
            duration: 0.4, 
            delay: 0.1, 
            ease: 'linear',
          }
        )
      }

      this.hits.pX = this.hits.x 
      this.hits.pY = this.hits.y
    }
  }

  /* 
    DESTROY.
  */

  destroy()
  {
    this.os = null
    this.temp = null
    this.constant = null
    this.ray = null 
  }
}