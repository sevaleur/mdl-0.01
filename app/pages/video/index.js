import Plyr from 'plyr'

import Page from 'classes/Page'
import Show from 'animations/Show'

import { COLOR_CULTURED, COLOR_NIGHT } from 'utils/color_variables'
import { horizontalLoop } from 'utils/HelperFunctions'

export default class Video extends Page
{
  constructor()
  {
    super({
      id: 'video',
      element: '.video',
      elements: {
        titleDiv: '.video__title',
        title: '.video__title__text',
        wrapper: '.video__wrapper'
      }, 
      background: COLOR_NIGHT, 
      color: COLOR_CULTURED
    })

    this.showAnimations = []
  }

  create()
  {
    super.create()
    this.createElements()
  }

  createElements()
  { 
    const GHOST = document.querySelector('.video__ghost__div')
    const CREDITS = document.querySelectorAll('h3.video__footer__credits__title__text')
    const THANKS = document.querySelectorAll('h3.video__footer__thanks__title__text')

    this.titleBounds = this.elements.titleDiv.getBoundingClientRect()
    this.showAnimations.push(new Show(this.elements.title))

    this.createVideo(GHOST)
    this.createLoop(CREDITS, THANKS)
  }

  createVideo(GHOST)
  {
    let isMuted = false 
    let isPlaying = false 

    this.vid = new Plyr('#plyr', {
      autoplay: false, 
      muted: false, 
      clickToPlay: false,
      hideControls: true, 
      loop: { active: true },
    })

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

  createLoop(CREDITS, THANKS)
  {
    horizontalLoop(CREDITS, { paused: false, reversed: true, repeat: -1, speed: 0.5 })
    horizontalLoop(THANKS, { paused: false, reversed: true, repeat: -1, speed: 0.5 })
  }

  onWheel(e)
  {
    super.onWheel(e)

    let location = (window.innerHeight - this.titleBounds.height) - this.scroll.current
    let scrollPos = (this.scroll.current + this.titleBounds.height) - window.innerHeight

    scrollPos >= location
      ? this.vid.pause()
      : this.vid.play()
  }

  show()
  {
    super.show()

    this.showAnimations.forEach(
      el => 
      {
        el.show()
      }
    )
  }

  hide()
  {
    super.hide()
  }
}
