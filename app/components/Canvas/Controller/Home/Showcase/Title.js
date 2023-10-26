import { Color, Geometry, Mesh, Program, Text, Texture } from 'ogl'
import gsap from 'gsap'

import fnt from '/fonts/BebasNeue.json'
import src from '/fonts/BebasNeue.png'

import fragment from 'shaders/home/text/fragment.glsl'
import vertex from 'shaders/home/text/vertex.glsl'

export default class Title
{
  constructor({ gl, plane, renderer, viewport, screen, left_title, right_title, type, index, color })
  {
    this.gl = gl
    this.plane = plane
    this.renderer = renderer
    this.viewport = viewport
    this.screen = screen
    this.left_title = left_title
    this.right_title = right_title
    this.color = color

    this.title_config = {
      align: 'center',
      font: fnt,
      letterSpacing: 0.05,
      size: 0.15,
      wordSpacing: 0,
      width: 4,
      lineHeight: 1.1,
    }

    this.createShader()
    this.createMesh()
  }

  createShader()
  {
    const texture = new Texture(this.gl, { generateMipmaps: false })
    const textureImage = new Image()

    textureImage.src = src
    textureImage.onload = _ => texture.image = textureImage

    const vertex100 = `${vertex}`

    const fragment100 = `
      #extension GL_OES_standard_derivatives : enable

      precision highp float;

      ${fragment}
    `

    const vertex300 = `#version 300 es

      #define attribute in
      #define varying out

      ${vertex}
    `

    const fragment300 = `#version 300 es

      precision highp float;

      #define varying in
      #define texture2D texture
      #define gl_FragColor FragColor

      out vec4 FragColor;

      ${fragment}
    `

    let fragmentShader = fragment100
    let vertexShader = vertex100

    if (this.renderer.isWebgl2) {
      fragmentShader = fragment300
      vertexShader = vertex300
    }

    this.program = new Program(this.gl, {
      cullFace: null,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      fragment: fragmentShader,
      vertex: vertexShader,
      uniforms: {
        u_color: { value: new Color(this.color) },
        u_scroll: { value: 0.0 },
        u_viewportSize: { value: [this.viewport.width, this.viewport.height] },
        u_alpha: { value: 0.0 },
        tMap: { value: texture }
      }
    })
  }

  createMesh()
  {
    const left_title_text = new Text({
      ...this.title_config,
      text: this.left_title,
    })

    const right_title_text = new Text({
      ...this.title_config,
      text: this.right_title,
    })

    const r_title_geo = new Geometry(this.gl, {
      position: { size: 3, data: right_title_text.buffers.position },
      uv: { size: 2, data: right_title_text.buffers.uv },
      id: { size: 1, data: right_title_text.buffers.id },
      index: { data: right_title_text.buffers.index }
    })

    const l_title_geo = new Geometry(this.gl, {
      position: { size: 3, data: left_title_text.buffers.position },
      uv: { size: 2, data: left_title_text.buffers.uv },
      id: { size: 1, data: left_title_text.buffers.id },
      index: { data: left_title_text.buffers.index }
    })

    r_title_geo.computeBoundingBox()
    l_title_geo.computeBoundingBox()

    this.right_title_mesh = new Mesh(this.gl, { geometry: r_title_geo, program: this.program })
    this.left_title_mesh = new Mesh(this.gl, { geometry: l_title_geo, program: this.program })

    this.right_title_mesh.position.x = this.plane.scale.x + 0.05
    this.right_title_mesh.rotation.z = -Math.PI * 0.5

    this.left_title_mesh.position.x = -this.plane.scale.x - 0.05
    this.left_title_mesh.rotation.z = Math.PI * 0.5

    this.right_title_mesh.setParent(this.plane)
    this.left_title_mesh.setParent(this.plane)
  }

  show()
  {
    gsap.fromTo(
      this.program.uniforms.u_alpha,
      {
        value: -1.0
      },
      {
        value: .5,
        delay: 1.0,
        duration: 1.0,
      })
  }

  hide()
  {
    gsap.to(
      this.program.uniforms.u_alpha,
      {
        value: -1.0,
        duration: 1
      })
  }

  update(scroll)
  {
    this.program.uniforms.u_scroll.value = ((scroll.current - scroll.last) / this.screen.width) * 20
  }
}
