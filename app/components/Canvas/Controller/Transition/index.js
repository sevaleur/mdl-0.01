import { PlaneGeometry, ShaderMaterial, Mesh } from 'three'
import gsap from 'gsap'

import vertex from 'shaders/transition/vertex.glsl'
import fragment from 'shaders/transition/fragment.glsl'

export default class Transition
{
  constructor({ index, elements, scene, viewport, screen, url, scroll })
  {
    this.index = index
    this.elements = elements
    this.scene = scene
    this.viewport = viewport
    this.screen = screen
    this.url = url
    this.scroll = scroll

    this.geo = new PlaneGeometry()
    this.finished = false

    this.createMesh()
  }

  /*
    Create.
  */

  createMesh()
  {
    this.element = this.elements[this.index]

    this.material = new ShaderMaterial(
    {
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms:
      {
        tMap: { value: this.element.texture },
        u_bg: { value: this.element.bgTMap },
        u_alpha: { value: 1.0 },
        u_imageSize: { value: [0, 0] },
        u_planeSize: { value: [0, 0] },
        u_viewportSize: { value: [this.viewport.width, this.viewport.height] },
        u_offset: { value: this.element.plane.material.uniforms.u_offset.value },
        u_state: { value: 0.0 },
        u_intensity: { value: 10.0 }
      },
      transparent: true
    })

    this.material.uniforms.u_imageSize.value = [
      this.element.texture.image.naturalWidth, 
      this.element.texture.image.naturalHeight
    ]

    this.plane = new Mesh( this.geo, this.material )

    this.plane.scale.x = this.element.plane.scale.x
    this.plane.scale.y = this.element.plane.scale.y
    this.plane.scale.z = this.element.plane.scale.z

    this.plane.material.uniforms.u_planeSize.value = [this.plane.scale.x, this.plane.scale.y]

    this.plane.position.x = this.element.plane.position.x
    this.plane.position.y = this.element.plane.position.y
    this.plane.position.z = this.element.plane.position.z + 0.01

    this.scene.add(this.plane)
  }

  /*
    Animations.
  */

  animateMenu(menu)
  {
    if(menu)
    {
      menu.scroll.current = this.scroll.current
      menu.scroll.target = this.scroll.target
    }
    else
    {
      return
    }

  }

  animateTransition(_elements)
  {
    let element 

    if(_elements.id === 'gallery')
    {
      const { elements } = _elements
      element = elements[0]
    } 
    
    let tl = gsap.timeline({
      onComplete: () =>
      {
        _elements.show(true)
    
        this.hide()
      }
    })

    tl.to(this.plane.position,
    {
      x: element.plane.position.x,
      y: element.plane.position.y,
      z: element.plane.position.z + 0.01,
      duration: 1.5,
      ease: 'expo.inOut'
    }, 0)

    tl.to(this.plane.scale,
    {
      x: element.plane.scale.x,
      y: element.plane.scale.y,
      z: element.plane.scale.z,
      duration: 1.5,
      ease: 'expo.inOut'
    }, 0)
  }

  hide()
  {
    gsap.delayedCall(0.5, () =>
    {
      this.scene.remove(this.plane)
      this.finished = true
    })
  }

  /*
    Update.
  */

  updateScale()
  {
    this.plane.material.uniforms.u_planeSize.value = [this.plane.scale.x, this.plane.scale.y]
  }

  updateX(_elements)
  {
    if(_elements.id === 'gallery')
    {
      const { elements } = _elements
      this.element = elements[0]
    }

    this.y = this.element.bounds.top / this.screen.height
    this.pos_y = this.plane.position.y + this.y / 100

    if(!this.screen.phone)
      this.plane.material.uniforms.u_offset.value = gsap.utils.mapRange(-this.viewport.height, this.viewport.height, -0.35, 0.35, this.pos_y)
  }

  update(elements)
  {
    this.updateX(elements)
    this.updateScale()
  }
}
