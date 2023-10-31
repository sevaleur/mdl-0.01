import { Group, ShaderMaterial, Mesh } from 'three'
import gsap from 'gsap'

import vertex from 'shaders/background/vertex.glsl'
import fragment from 'shaders/background/fragment.glsl'

export default class Background 
{
  constructor({ id, bgTMap, scene, screen, viewport, geo, dt, ray })
  {
    this.id = id 
    this.bgTMap = bgTMap
    this.scene = scene 
    this.screen = screen 
    this.viewport = viewport
    this.geo = geo
    this.dt = dt
    this.ray = ray 

    this.group = new Group()

    this.createElement()
    this.createBackground()
    this.createBounds()

    this.scene.add(this.group)

    this.show()
  }

  createElement()
  {
    this.element = document.querySelector(`.${this.id}__background__figure__image`)
  }

  createBackground()
  {
    this.texture = window.IMAGE_TEXTURES[this.element.getAttribute('data-src')]

    this.material = new ShaderMaterial({
      vertexShader: vertex, 
      fragmentShader: fragment, 
      uniforms: 
      {
        tMap: { value: this.texture },
        tData: { value: this.dt.image },
        u_alpha: { value: 0.0 },
        u_state: { value: 0.0 },
        u_hover: { value: [ 0, 0 ] },
        u_imageSize: { value: [ 0, 0 ] },
        u_planeSize: { value: [ 0, 0 ] },
      },
      transparent: true
    })

    this.material.uniforms.u_imageSize.value = [
      this.texture.image.natuaralWidth, 
      this.texture.image.natualHeight
    ]

    this.material.uniforms.tData.value.needsUpdate = true

    this.plane = new Mesh( this.geo, this.material )

    this.ray.init({ obj : [ this.plane ] })
    
    this.group.add(this.plane)
  }

  createBounds()
  {
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale()
    this.updateX()
    this.updateY()

    this.plane.material.uniforms.u_planeSize.value = [
      this.plane.scale.x,
      this.plane.scale.y
    ]
  }

  show()
  {
    gsap.to(
      [this.material.uniforms.u_alpha, 
      this.material.uniforms.u_state],
      {
        value: 1.0,
        duration: 1.0
      }
    )
  }

  hide()
  {
    gsap.to(
      [this.material.uniforms.u_alpha, 
      this.material.uniforms.u_state], 
      {
        value: 0.0, 
        duration: 1.0
      }
    )
  }

  /*
    EVENTS.
  */

  onResize(sizes)
  {
    if(sizes)
    {
      const { screen, viewport } = sizes

      if(screen) this.screen = screen
      if(viewport) this.viewport = viewport
    }

    this.createBounds()
  }

  /*
    UPDATE.
  */

  updateScale()
  {
    this.plane.scale.x = (this.viewport.width * this.bounds.width) / this.screen.width
    this.plane.scale.y = (this.viewport.height * this.bounds.height) / this.screen.height

    this.plane.material.uniforms.u_planeSize.value = [this.plane.scale.x, this.plane.scale.y]
  }

  updateX()
  {
    this.x = this.bounds.left / this.screen.width

    this.plane.position.x = (-this.viewport.width / 2) + (this.plane.scale.x / 2) + (this.x * this.viewport.width)
  }

  updateY()
  {
    this.y = this.bounds.top / this.screen.height

    this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - (this.y * this.viewport.height)
  }

  update()
  {
    if(!this.bounds) return

    this.updateScale()
    this.updateX()
    this.updateY()
    this.ray.update()
  }

  destroy()
  {
    this.scene.remove(this.group)
  }
}