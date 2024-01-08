import * as THREE from 'three'
import gsap from 'gsap'

import vertex from 'shaders/about/vertex.glsl'
import fragment from 'shaders/about/fragment.glsl'

export default class Flag
{
  constructor({ element, index, geometry, scene, screen, viewport })
  {
    this.element = element
    this.index = index
    this.geo = geometry
    this.scene = scene
    this.screen = screen
    this.viewport = viewport

    this.time = 0

    this.createMesh()
    this.createBounds()
  }

  /*
    Create.
  */

  createMesh()
  {
    this.texture = window.IMAGE_TEXTURES[this.element.getAttribute('data-src')]

    this.material = new THREE.ShaderMaterial(
    {
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms:
      {
        tMap: { value: this.texture },
        u_alpha: { value: 0.0 },
        u_time: { value: 0.0 },
        u_imageSize: { value: [0, 0] },
        u_planeSize: { value: [0, 0] },
        u_viewportSize: { value: [this.viewport.width, this.viewport.height] }
      },
      transparent: true
    })

    if(this.texture !== undefined)
    {
      this.material.uniforms.u_imageSize.value = [
        this.texture.source.data.naturalWidth, 
        this.texture.source.data.naturalHeight
      ]
    }

    this.plane = new THREE.Mesh( this.geo, this.material )
    this.scene.add(this.plane)
  }

  createBounds()
  {
    this.bounds = this.element.getBoundingClientRect()

    this.updateScale()
    this.updateX()
    this.updateY()

    this.plane.material.uniforms.u_planeSize.value = [this.plane.scale.x, this.plane.scale.y]
  }

  /*
    Animations.
  */

  show()
  {
    gsap.to(
      this.material.uniforms.u_alpha,
      {
        value: 1.0,
        duration: 1.0
      }
    )
  }

  hide()
  {
    gsap.to(
      this.material.uniforms.u_alpha,
      {
        value: 0.0
      }
    )
  }

  /*
    Events.
  */

  onResize(sizes)
  {
    if(sizes)
    {
      const { screen, viewport } = sizes

      if(screen) this.screen = screen
      if(viewport) {
        this.viewport = viewport

        this.plane.material.uniforms.u_viewportSize.value = [this.viewport.width, this.viewport.height]
      }
    }

    this.createBounds()
  }

  /*
    Update.
  */

  updateScale()
  {
    this.plane.scale.x = (this.viewport.width * this.bounds.width) / this.screen.width
    this.plane.scale.y = (this.viewport.height * this.bounds.height) / this.screen.height

    this.plane.material.uniforms.u_planeSize.value = [this.plane.scale.x, this.plane.scale.y]
  }

  updateX()
  {
    this.x = (this.bounds.left / this.screen.width) * this.viewport.width
    this.plane.position.x = (-this.viewport.width / 2) + (this.plane.scale.x / 2) + this.x
  }

  updateY()
  {
    this.y = (this.bounds.top / this.screen.height) * this.viewport.height
    this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - this.y
  }

  update()
  {
    if(!this.bounds) return

    this.time += 0.05

    this.material.uniforms.u_time.value = this.time

    this.updateScale()
    this.updateX()
    this.updateY()
  }
}
