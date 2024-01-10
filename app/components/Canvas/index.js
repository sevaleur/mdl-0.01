import { Scene, Texture, TextureLoader } from 'three'

import Sizes from './utils/Sizes'

import Camera from './setup/Camera'
import Renderer from './setup/Renderer'

import Controller from './Controller'

export default class Canvas
{
  static instance

  constructor({ template, canvas })
  {
    if(Canvas.instance)
      return Canvas.instance 

    Canvas.instance = this

    this.template = template
    this.canvas = canvas

    this.createObjects()
    this.createSizes()
    this.createScene()
    this.createCamera()
    this.createRenderer()
    
    this.onResize()
    
    this.createController()
  }

  /*
  *
  ** CREATE.
  *
  */

  createObjects()
  {
    this.touch = {
      y: {
        start: 0,
        distance: 0,
        end: 0
      },
      x: {
        start: 0,
        distance: 0,
        end: 0
      }
    }

    this.scroll = {}
  }

  createSizes()
  {
    this.sizes = new Sizes()
    this.sizes.on('resize', () => { this.onResize() } )
  }

  createScene()
  {
    this.scene = new Scene()
  }

  createCamera()
  {
    this.camera = new Camera({
      canvas: this.canvas, 
      screen: this.sizes.screen, 
      scene: this.scene
    })
  }

  createRenderer()
  {
    this.renderer = new Renderer({
      canvas: this.canvas, 
      screen: this.sizes.screen, 
      camera: this.camera.instance, 
      scene: this.scene
    })
  }

  createController()
  {
    this.controller = new Controller({
      sizes: this.sizes, 
      scene: this.scene, 
      viewport: this.viewport,
      camera: this.camera
    })
  }

  /*
  *
  ** EVENTS.
  *
  */

  onPreloaded()
  {
    this.controller.onChange(this.template)
  }

  onChangeStart(template, url, push)
  {
    if(!push)
        return

    this.controller.onChangeStart(template, url, push)
  }

  onChange(template)
  {
    this.controller.onChange(template)
  }

  onResize()
  {
    this.renderer.onResize()
    this.camera.onResize()

    const fov = this.camera.instance.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.instance.position.z
    const width = height * this.camera.instance.aspect

    this.viewport = {
      width,
      height
    }

    if(this.controller)
    {
      this.controller.onResize({
        screen: this.sizes.screen, 
        viewport: this.viewport
      })
    }
  }

  onTouchDown(e)
  {
    this.isDown = true

    this.touch.x.start = e.touches ? e.touches[0].clientX : e.clientX
    this.touch.y.start = e.touches ? e.touches[0].clientY : e.clientY

    this.controller.onTouchDown({
      y: this.touch.y, 
      x: this.touch.x
    })
  }

  onTouchMove(e)
  {
    if(!this.isDown) return

    const x = e.touches ? e.touches[0].clientX : e.clientX
    const y = e.touches ? e.touches[0].clientY : e.clientY

    this.touch.y.end = y
    this.touch.x.end = x

    this.controller.onTouchMove({
      y: this.touch.y, 
      x: this.touch.x
    })
  }

  onTouchUp(e)
  {
    this.isDown = false

    this.controller.onTouchUp({
      y: this.touch.y, 
      x: this.touch.x
    })
  }

  onMove(e)
  {
    this.controller.onMove(e)
  }

  onWheel(e)
  {
    this.controller.onWheel(e)
  }

  /*
  *
  ** LOOP.
  *
  */

  update(scroll)
  {
    this.controller.update(scroll)
    this.camera.update()
    this.renderer.update()
  }
}
