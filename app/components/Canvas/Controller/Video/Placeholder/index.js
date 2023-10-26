import { ShaderMaterial, Mesh } from 'three'
import gsap from 'gsap'

import vertex from 'shaders/video/vertex.glsl'
import fragment from 'shaders/video/fragment.glsl'

export default class Placeholder
{
  constructor({ element, geometry, scene, screen, viewport })
  {
    this.element = element
    this.geo = geometry
    this.scene = scene
    this.screen = screen
    this.viewport = viewport

    this.movie = document.querySelector('.video__selected__video')

    this.createMesh()
    this.createBounds()
  }

  /*
    Create.
  */

  createMesh()
  {
    this.texture = window.IMAGE_TEXTURES[this.element.getAttribute('data-src')]

    this.material = new ShaderMaterial(
    {
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms:
      {
        tMap: { value: this.texture },
        u_alpha: { value: 0.0 },
        u_imageSize: { value: [0, 0] },
        u_planeSize: { value: [0, 0] },
        u_viewportSize: { value: [this.viewport.width, this.viewport.height] },
        u_offset: { value: 0.0 }
      },
      transparent: true
    })

    this.material.uniforms.u_imageSize.value = [this.texture.image.naturalWidth, this.texture.image.naturalHeight]

    this.plane = new Mesh( this.geo, this.material)
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
    gsap.fromTo(this.material.uniforms.u_alpha,
    {
      value: 0.0
    },
    {
      value: 1.0
    })

    gsap.delayedCall(1.0, () =>
    {
      this.hide()

      gsap.fromTo(this.movie,
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: 1,
        onComplete: () =>
        {
          this.movie.play()
        }
      })
    })
  }

  hide()
  {
    gsap.to(this.material.uniforms.u_alpha,
    {
      value: 0.0,
      duration: 1
    })
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
    this.x = this.bounds.left / this.screen.width
    this.plane.position.x = (-this.viewport.width / 2) + (this.plane.scale.x / 2) + (this.x * this.viewport.width)

    const pos_viewport = this.plane.position.x + this.x / 100
    this.plane.material.uniforms.u_offset.value = gsap.utils.mapRange(-this.viewport.width, this.viewport.width, -0.35, 0.35, pos_viewport)
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
  }
}
