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
        title: '.video__title',
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
    const GHOST = document.querySelector('.video__ghost__div')


    this.createVideo(GHOST)
  }

  createVideo(GHOST)
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

    GHOST.addEventListener('click', () => 
    {
      if(!isPlaying) 
      {
        isPlaying = true
        this.vid.muted = false
        this.vid.play()
      }
      else 
      {
        isPlaying = false 
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
