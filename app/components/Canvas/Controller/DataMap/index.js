import { DataTexture, RGBAFormat, FloatType, NearestFilter } from "three"

export default class DataMap 
{
  constructor({ screen })
  {
    this.screen = screen
    this.mouse = 0.25
    this.strength = 0.11
    const grid = 50 

    this.size = grid
    const w = this.size 
    const h = this.size 
    const size = w * h

    const data = new Float32Array( size * 4 )

    this.createData(w, h, size, data)
  }

  createData(w, h, size, data)
  {
    for(let i = 0; i < size; i++)
    {
      const r = Math.random()
      const g = Math.random()

      const pixel = i * 4

      data[pixel] = r
      data[pixel + 1] = g
      data[pixel + 2] = r
      data[pixel + 3] = g
    }


    this.image = new DataTexture(
      data,
      w, 
      h,
      RGBAFormat, 
      FloatType
    )

    this.image.magFilter = this.image.minFilter = NearestFilter
  }
}