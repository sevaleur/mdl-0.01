import { ShaderMaterial, Mesh, TextureLoader } from 'three'
import gsap from 'gsap'

import vertex from 'shaders/logo/vertex.glsl'
import fragment from 'shaders/logo/fragment.glsl'

export default class Media
{
  constructor({ element, index, template, geometry, scene, screen, viewport })
  {
    this.element = element
    this.index = index
    this.template = template
    this.geo = geometry
    this.scene = scene
    this.screen = screen
    this.viewport = viewport

    this.newTexture = {
      required: false,
    }

    this.createMaterial()
    this.createTexture()
    this.createMesh()
    this.createBounds()
  }

  /*
    CREATE.
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
        u_alpha: { value: 1.0 },
        u_state: { value: 0.0 },
        u_scroll: { value: 0.0 },
        u_intensity: { value: 10.0 },
        u_mod: { value: 0.5 },
        u_hover: { value: [ 0, 0 ] },
        u_imageSize: { value: [ 0, 0 ] },
        u_planeSize: { value: [ 0, 0 ] },
      }
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
    this.plane = new Mesh( this.geo, this.material )

    this.plane.position.z = 0.001
    this.plane.userData.template = this.template

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

    this.plane.material.uniforms.u_planeSize.value = [
      this.plane.scale.x,
      this.plane.scale.y
    ]
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
      delay: 0.8, 
      duration: 1
    })
  }

  hide()
  {
    gsap.to([
      this.material.uniforms.u_alpha,
      this.material.uniforms.u_state
    ],
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

  update(scroll)
  {
    if(!this.bounds) return

    this.plane.material.uniforms.u_scroll.value = ((scroll.current - scroll.last) / this.screen.height) * 5

    this.createBounds()

    this.updateScale()
    this.updateX()
    this.updateY()
  }
}