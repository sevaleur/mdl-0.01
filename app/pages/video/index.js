import Plyr from 'plyr'
import gsap from 'gsap'

import Page from 'classes/Page'
import Show from 'animations/Show'

import { COLOR_CULTURED, COLOR_NIGHT } from 'utils/color_variables'
import { horizontalLoop } from 'utils/HelperFunctions'

export default class Video extends Page
{
  constructor({ device })
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

    this.device = device
  }

  /* 
    CREATE.
  */

  create()
  {
    super.create()

    this.showAnimations = []

    this.video = {
      isPlaying: false, 
      isClicked: false,
      isCovered: false,
      isInactive: false
    }

    this.createElements()
  }

  createElements()
  { 
    const GHOST = document.querySelector('.video__ghost__div')
    const CREDITS = document.querySelectorAll('h3.video__footer__credits__title__text')
    const THANKS = document.querySelectorAll('h3.video__footer__thanks__title__text')

    this.cover = document.querySelector('.video__media__cover')

    this.titleBounds = this.elements.titleDiv.getBoundingClientRect()

    this.showAnimations.push(new Show(this.elements.title))

    this.createVideo(GHOST)
    this.createMotion()

    if(CREDITS.length && THANKS.length)
      this.createLoop(CREDITS, THANKS)
  }

  createVideo(GHOST)
  {
    this.vid = new Plyr('#plyr', {
      autoplay: false, 
      muted: false, 
      clickToPlay: true,
      hideControls: true, 
      loop: { active: true },
      loadSprite: false,
    })

    this.controls = {
      element: document.querySelector('.video__btn'),  
      rotation: 0
    }

    this.createInteraction(GHOST)
  }

  createInteraction(GHOST)
  {
    GHOST.addEventListener('mouseenter', (e) => { this.enlarge.play() })
    GHOST.addEventListener('mouseleave', (e) => { this.enlarge.reverse() })
    GHOST.addEventListener('click', (e) => 
    {
      this.controls.element.classList.toggle('active')

      this.controls.element.classList.contains('active') 
        ? (this.onPlay(), this.video.isClicked = true)
        : (this.onPause(), this.video.isClicked = false)
    })
  }

  createLoop(CREDITS, THANKS)
  {
    horizontalLoop(CREDITS, { paused: false, reversed: true, repeat: -1, speed: 0.5 })
    horizontalLoop(THANKS, { paused: false, reversed: true, repeat: -1, speed: 0.5 })
  }

  createMotion()
  {
    this.enlarge = gsap.to(
      this.controls.element, 
      {
        height: '50rem',
        width: '50rem', 
        duration: 0.5, 
        ease: 'power2.inOut',
        paused: true
      }
    )
  }

  /* 
    EVENTS.
  */

  onWheel(e)
  {
    super.onWheel(e)

    let location = (window.innerHeight - this.titleBounds.height) - this.scroll.current
    let scrollPos = (this.scroll.current + this.titleBounds.height) - window.innerHeight
    
    if(scrollPos >= location)
    {
      this.video.isCovered = true 
      gsap.to(this.cover, {background: this.background})

      if(this.video.isPlaying)
        this.onPause()
    }
    
    if(scrollPos <= 0)
    {
      if(this.video.isCovered)
      {
        this.video.isCovered = false
        gsap.to(this.cover, {background: 'transparent'})

        if(this.video.isClicked)
          this.onPlay()  
      }
    }
  }

  onMove(e)
  {
    super.onMove(e)
  }

  onPlay()
  {
    this.video.isPlaying = true
    this.vid.play()
  }

  onPause()
  {
    this.video.isPlaying = false 
    this.vid.pause()
  }


/* 
  SHOW // HIDE ANIMATIONS.
*/

  show()
  {
    super.show()

    this.showAnimations.forEach(
      el => 
      {
        el.show()
      }
    )

    this.enlarge.play()
  }

  hide()
  {
    super.hide()
    this.enlarge.reverse()
  }

  /* 
    UPDATE.
  */

  update()
  {
    super.update()

    gsap.to(
      this.controls.element,
      {
        top: this.coord.y,
        left: this.coord.x,
        duration: 0.5, 
        ease: 'linear',
      }
    )
  }
}
