import { ShaderMaterial, Mesh } from 'three'
import gsap from 'gsap'

import Prefix from 'prefix'

import vertex from 'shaders/menu/vertex.glsl'
import fragment from 'shaders/menu/fragment.glsl'

export default class Element
{
  constructor({ element, index, bgTMap, link, geometry, length, scene, screen, viewport })
  {
    this.element = element
    this.index = index
    this.bgTMap = bgTMap
    this.link = link
    this.geo = geometry
    this.length = length
    this.scene = scene
    this.screen = screen
    this.viewport = viewport

    this.l_prefix = Prefix('transform')

    this.link_parent = this.link.parentElement

    this.createMesh()
    this.createAnimations()
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
        u_offset: { value: 0 },
        u_scroll: { value: 0 },
        u_progress: { value: 0.0 },
        u_viewportSize: { value: [this.viewport.width, this.viewport.height] },
        u_intensity: { value: 10. },
        u_state: { value: 0.0 },
        u_time: { value: 0.0 }
      },
      transparent: true
    })

    this.material.uniforms.u_imageSize.value = [
      this.texture.image.naturalWidth, 
      this.texture.image.naturalHeight
    ]

    this.plane = new Mesh( this.geo, this.material )
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

  createAnimations()
  {
    this.state = gsap.to(
      this.material.uniforms.u_state,
      {
        value: 1.0,
        delay: 1.0,
        duration: 1.0,
        ease: 'linear',
        paused: true
      }
    )

    this.alpha = gsap.to(
      this.material.uniforms.u_alpha,
      {
        value: 1.0,
        delay: 1.0,
        duration: 1.0,
        ease: 'linear', 
        paused: true
      }
    )
  }

  /*
    ANIMATIONS.
  */

  show()
  {
    this.state.play()
    this.alpha.play()
  }

  hide()
  {
    this.state.reverse()
    this.alpha.reverse()
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

  updateY(current = 0)
  {
    this.y = ((this.bounds.top + current) / this.screen.height) * this.viewport.height
    this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - this.y

    this.pos_viewport_y = this.plane.position.y + this.y / 100
    this.plane.material.uniforms.u_offset.value = gsap.utils.mapRange(-this.viewport.height, this.viewport.height, -0.35, 0.35, this.pos_viewport_y)
  }

  updateLink()
  {
    this.x = this.plane.position.x * this.screen.width

    this.link_pos = (this.x / (-this.viewport.width / 2))
    this.link_parent.style[this.l_prefix] = `translateX(${this.link_pos}px)`
  }

  update(scroll)
  {
    if(!this.bounds) return

    this.updateScale()
    this.updateX()
    this.updateY(scroll.current)
    this.updateLink()

    this.plane.material.uniforms.u_scroll.value = ((scroll.current - scroll.last) / this.screen.width) * 20
  }
}
