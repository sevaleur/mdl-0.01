import { ShaderMaterial, Mesh, TextureLoader } from 'three'
import gsap from 'gsap'

import Prefix from 'prefix'

import vertex from 'shaders/gallery/vertex.glsl'
import fragment from 'shaders/gallery/fragment.glsl'

export default class Element
{
  constructor({ element, index, link, geometry, length, scene, screen, viewport })
  {
    this.element = element
    this.index = index
    this.link = link
    this.geo = geometry
    this.length = length
    this.scene = scene
    this.screen = screen
    this.viewport = viewport

    this.l_prefix = Prefix('transform')

    this.newTexture = {
      required: false,
    }

    this.createMaterial()
    this.createTexture()
    this.createMesh()
    this.createBounds()
    this.createAnimations()
  }

  /*
    Create.
  */

  createMaterial()
  { 
    this.material = new ShaderMaterial(
    {
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms:
      {
        tMap: { value: null },
        u_imageSize: { value: [0, 0] },
        u_planeSize: { value: [0, 0] },
        u_alpha: { value: 0.0 },
        u_scroll: { value: 0.0 },
        u_viewportSize: { value: [this.viewport.width, this.viewport.height] },
        u_intensity: { value: 25.0 },
        u_state: { value: 0.0 }
      },
      transparent: true
    })
  }

  async createTexture()
  { 
    let src = this.element.getAttribute('data-src')

    if(!window.IMAGE_TEXTURES[src])
    {
      this.newTexture.required = true

      const textureLoader = new TextureLoader()
      this.texture = await textureLoader.loadAsync(src)

      this.material.uniforms.tMap.value = this.texture

      this.material.uniforms.u_imageSize.value = [
        this.texture.source.data.naturalWidth,
        this.texture.source.data.naturalHeight
      ]
    }
    else 
    {
      this.texture = window.IMAGE_TEXTURES[src]
      this.material.uniforms.tMap.value = this.texture 
      
      this.material.uniforms.u_imageSize.value = [
        this.texture.source.data.naturalWidth,
        this.texture.source.data.naturalHeight
      ]
    } 
  }

  createMesh()
  {
    this.plane = new Mesh( this.geo, this.material)
    this.scene.add(this.plane)
  }

  createBounds()
  {
    this.bounds = this.element.getBoundingClientRect()

    this.plane.material.uniforms.u_imageSize.value = [
      this.texture.source.data.naturalWidth, 
      this.texture.source.data.naturalHeight
    ]

    this.updateScale()
    this.updateX()
    this.updateY()

    this.plane.material.uniforms.u_planeSize.value = [this.plane.scale.x, this.plane.scale.y]

    this.pos_y = Math.sin(this.index + Math.PI) * (this.viewport.height / 2)
  }

  createAnimations()
  {
    this.onAlphaChange = gsap.fromTo(
      this.material.uniforms.u_alpha,
      {
        value: 0.0
      },
      {
        value: 1.0,
        delay: 0.8,
        paused: true
      }
    )
    
    this.onStateChange = gsap.fromTo(
      this.material.uniforms.u_state,
      {
        value: 0.0
      },
      {
        value: 1.0, 
        paused: true
      }
    )
  }

  /*
  *
  ** ANIMATIONS.
  *
  */

  show(transition=false)
  {
    if(transition)
    {
      this.onAlphaChange.delay(0).play()  
      this.onStateChange.play()
    }
    else 
    {
      this.onAlphaChange.duration(0.5).play()
        .eventCallback('onComplete', () => 
        {
          this.onStateChange.duration(1.0).play()
        }
      )
    }
  }

  hide()
  {
    this.onStateChange.reverse()
    this.onAlphaChange.reverse()
  }

  /*
  *
  ** EVENTS.
  *
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
  *
  ** UPDATE. 
  *
  */

  updateScale()
  {
    this.plane.scale.x = this.viewport.width * this.bounds.width / this.screen.width
    this.plane.scale.y = this.viewport.height * this.bounds.height / this.screen.height

    this.plane.material.uniforms.u_planeSize.value = [this.plane.scale.x, this.plane.scale.y]
  }

  updateX(current=0)
  {
    this.x = ((this.bounds.left + current) / this.screen.width) * this.viewport.width
    const pos_viewport = this.plane.position.x + this.x / 100

    this.plane.position.x = (-this.viewport.width / 2) + (this.plane.scale.x / 2) + this.x
  }

  updateY()
  {
    this.plane.position.y = gsap.utils.mapRange(-this.viewport.width, this.viewport.width, -this.pos_y, this.pos_y, this.plane.position.x)

    this.y = this.plane.position.y * this.screen.height

    this.link_pos = (this.y / this.viewport.height) + (-this.viewport.height / 2)
    this.link.style[this.l_prefix] = `translateY(${-this.link_pos}px)`
  }

  update(current, last)
  {
    if(!this.bounds) return

    this.updateX(current)
    this.updateY()
    this.updateScale()

    this.plane.material.uniforms.u_scroll.value = ((current - last) / this.screen.height) * 20
  }
}
