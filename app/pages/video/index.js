import Plyr from 'plyr'
import gsap from 'gsap'

import Page from 'classes/Page'

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
      color: COLOR_CULTURED,
      device: device
    })
  }

  /* 
    CREATE.
  */

  create()
  {
    super.create()

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
    const TITLE = document.querySelectorAll('.video__title__text')

    this.cover = document.querySelector('.video__media__cover')
    this.back = document.querySelector('.video__back')

    this.titleBounds = this.elements.titleDiv.getBoundingClientRect()

    this.createVideo(GHOST)
    this.createMotion()
    this.onBack()

    CREDITS.length && THANKS.length
       ? this.createLoop(TITLE, CREDITS, THANKS)
       : this.createLoop(TITLE)
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

    this.onBackShow = gsap.fromTo(
      this.back, 
      {
        scale: 0, 
      }, 
      {
        scale: 1.0, 
        transformOrigin: 'bottom left',
        duration: 0.8,
        ease: 'power2.inOut', 
        paused: true
      }
    )

    this.onTitleShow = gsap.fromTo(
      this.elements.titleDiv, 
      {
        yPercent: 100 
      }, 
      {
        yPercent: 0, 
        duration: 0.8, 
        ease: 'power2.inOut', 
        paused: true
      }
    )
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
      ratio: this.device.tablet || this.device.phone ? '9:16' : '16:9'
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

  createLoop(TITLE, CREDITS=false, THANKS=false)
  {
    horizontalLoop(TITLE, { paused: false, reversed: true, repeat: -1, speed: 0.5 })

    if(CREDITS && THANKS)
    {
      horizontalLoop(CREDITS, { paused: false, reversed: true, repeat: -1, speed: 0.5 })
      horizontalLoop(THANKS, { paused: false, reversed: false, repeat: -1, speed: 0.5 })
    }
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

  onBack()
  {
    this.back.addEventListener('click', (e) => 
    {
      e.preventDefault()

      window.history.back()
    })
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

    this.onBackShow.play()
    this.onTitleShow.play()
    this.enlarge.play()
  }

  hide()
  {
    super.hide()

    this.enlarge.reverse()
    this.onTitleShow.reverse()
    this.onBackShow.reverse()
  }

  /* 
    UPDATE.
  */

  update()
  {
    super.update()

    if(this.device.desktop)
    {
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
}
