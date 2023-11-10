import { ShaderMaterial, Mesh, Texture } from 'three'
import gsap from 'gsap'

import Prefix from 'prefix'

import vertex from 'shaders/showcase/vertex.glsl'
import fragment from 'shaders/showcase/fragment.glsl'

export default class Element
{
  constructor({ element, index, template, bgTMap, link, geometry, length, scene, screen, viewport })
  {
    this.element = element
    this.index = index
    this.template = template
    this.bgTMap = bgTMap
    this.link = link
    this.geo = geometry
    this.length = length
    this.scene = scene
    this.screen = screen
    this.viewport = viewport

    this.l_prefix = Prefix('transform')

    this.active = false

    this.link_parent = this.link.parentElement

    this.createMesh()
    this.createBounds()
  }

  /*
    CREATE.
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
        u_bg: { value: this.bgTMap },
        u_imageSize: { value: [0, 0] },
        u_planeSize: { value: [0, 0] },
        u_alpha: { value: 0.0 },
        u_hover: { value : [ 0, 0 ] }, 
        u_state: { value: 0.0 },
        u_offset: { value: 0.0 },
        u_deformation: { value: [0, 0] },
        u_intensity: { value: 10. },
        u_viewportSize: { value: [this.viewport.width, this.viewport.height] },
      },
      transparent: true,
    })

    this.material.uniforms.u_imageSize.value = [
      this.texture.image.naturalWidth, 
      this.texture.image.naturalHeight
    ]

    this.plane = new Mesh(
      this.geo, 
      this.material
    )

    this.plane.userData.template = this.template
    this.plane.userData.uid = `${this.template}${this.index}`

    this.scene.add(this.plane)
  }

  createBounds(active = false)
  {
    if(active)
    {
      this.bounds = this.element.getBoundingClientRect()

      this.plane.material.uniforms.u_planeSize.value = [this.plane.scale.x, this.plane.scale.y]
    }
    else 
    {
      this.bounds = this.element.getBoundingClientRect()
  
      this.updateScale()
      this.updateX()
      this.updateY()
  
      this.plane.material.uniforms.u_planeSize.value = [this.plane.scale.x, this.plane.scale.y]
    }
  }

  /*
    ANIMATIONS.
  */

  show()
  {
    gsap.fromTo(
      this.material.uniforms.u_state,
      {
        value: 0.0
      },
      {
        value: 1.0,
        delay: 0.6 * this.index, 
        duration: 1.0,
      }
    )

    gsap.fromTo(
      this.material.uniforms.u_alpha,
      {
        value: 0.0
      },
      {
        value: 1.0,
        duration: 1.0,
        delay: 0.5 * this.index, 
      }
    )
  }

  hide()
  {
    gsap.to(
      this.material.uniforms.u_state,
      {
        value: 0.0,
        duration: 1,
      })

    gsap.to(
      this.material.uniforms.u_alpha,
      {
        value: 0.0,
        duration: 1
      })
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
      if(viewport) {
        this.viewport = viewport

        this.plane.material.uniforms.u_viewportSize.value = [this.viewport.width, this.viewport.height]
      }
    }

    this.createBounds()
  }

  /*
    UPDATE.
  */

  updateScale()
  {
    this.plane.scale.x = this.viewport.width * this.bounds.width / this.screen.width
    this.plane.scale.y = this.viewport.height * this.bounds.height / this.screen.height

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

    this.link_pos = (this.y / (-this.viewport.height / 2))
    this.link_parent.style[this.l_prefix] = `translateY(${-this.link_pos}px)`

    if(this.length > 2)
    {
      this.pos_viewport_y = this.plane.position.y + this.y / 100
      this.plane.material.uniforms.u_offset.value = gsap.utils.mapRange(-this.viewport.height, this.viewport.height, -1., 1., this.pos_viewport_y)
    }
  }

  update()
  {
    if(!this.bounds) return

    this.active = this.link_parent.dataset.active

    if(this.active)
      this.createBounds(this.active)

    this.updateScale()
    this.updateX()
    this.updateY()
  }
}
