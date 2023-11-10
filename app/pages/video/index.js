import Plyr from 'plyr'

import Page from 'classes/Page'
import Show from 'animations/Show'

import { COLOR_CULTURED, COLOR_NIGHT } from '../../utils/color_variables'

export default class Video extends Page
{
  constructor()
  {
    super({
      id: 'video',
      element: '.video',
      elements: {
        text: '.video__desc__text',
        wrapper: '.video__wrapper'
      }, 
      background: COLOR_NIGHT, 
      color: COLOR_CULTURED
    })
  }

  create()
  {
    super.create()
    this.createElements()
  }

  createElements()
  { 
    this.ghost = document.querySelector('.video__ghost__div')


    this.createVideo()
  }

  createVideo()
  {
    let isMuted = false 
    let isPlaying = false 

    this.vid = new Plyr('#plyr', {
      autoplay: true, 
      muted: false, 
      clickToPlay: false,
      hideControls: true, 
      loop: { active: true },
    })

    console.log(this.vid)

    this.vid.on('playing', () => isPlaying = true)


    this.ghost.addEventListener('click', () => 
    {
      if(!this.isPlaying) 
      {
        this.isPlaying = true
        this.vid.muted = false
        this.vid.play()
      }
      else 
      {
        this.isPlaying = false 
        this.vid.muted = true 
        this.vid.pause()
      }
    })
  }

  show()
  {
    super.show()

    /* this.p_an = []
    this.elements.text.forEach((p, index) =>
    {
      this.p_an.push(new Show(p))
      this.p_an[index].show()
    }) */
  }

  hide()
  {
    super.hide()

    /* this.p_an.forEach(el =>
    {
      el.hide()
    }) */
  }
}
