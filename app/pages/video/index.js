import Plyr from 'plyr'
import gsap from 'gsap'

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
      isMuted: false, 
      isClicked: false,
      isCovered: false
    }

    this.coord = {
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2,
      pX: 0, 
      pY: 0
    }

    this.createElements()
  }

  createElements()
  { 
    const GHOST = document.querySelector('.video__ghost__div')
    const CREDITS = document.querySelectorAll('h3.video__footer__credits__title__text')
    const THANKS = document.querySelectorAll('h3.video__footer__thanks__title__text')

    this.cover = document.querySelector('.video__media__cover')
    this.controls = document.querySelector('.video__btn')
    this.titleBounds = this.elements.titleDiv.getBoundingClientRect()
    this.showAnimations.push(new Show(this.elements.title))

    this.createVideo(GHOST)

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

    this.createInteraction(GHOST)
  }

  createInteraction(GHOST)
  {
    this.element.addEventListener('mousemove', (e) => 
    {
      this.coord.x = e.clientX
      this.coord.y = e.clientY
    })

    GHOST.addEventListener('mouseenter', (e) => 
    {
      gsap.to(
        this.controls, 
        {
          scale: 1.0, 
          duration: 0.5, 
          ease: 'power2.inOut'
        }
      )
    })

    GHOST.addEventListener('mouseleave', (e) => 
    {
      gsap.to(
        this.controls, 
        {
          scale: 0.0, 
          duration: 0.5, 
          ease: 'power2.inOut'
        }
      )
    })

    GHOST.addEventListener('click', (e) => 
    {
      this.controls.classList.toggle('active')

      this.controls.classList.contains('active') 
        ? (this.onPlay(), this.video.isClicked = false)
        : (this.onPause(), this.video.isClicked = true)
    })
  }

  createLoop(CREDITS, THANKS)
  {
    horizontalLoop(CREDITS, { paused: false, reversed: true, repeat: -1, speed: 0.5 })
    horizontalLoop(THANKS, { paused: false, reversed: true, repeat: -1, speed: 0.5 })
  }

  /* 
    EVENTS.
  */

  onWheel(e)
  {
    super.onWheel(e)

    let location = (window.innerHeight - this.titleBounds.height) - this.scroll.current
    let scrollPos = (this.scroll.current + this.titleBounds.height) - window.innerHeight
    
    if(this.video.isPlaying && scrollPos >= location)
    {
      this.onPause()
      this.video.isCovered = true 
      gsap.to(this.cover, {background: this.background})
    }

    if(this.video.isCovered && scrollPos <= 0)
    {
      this.onPlay()
      this.video.isCovered = false
      gsap.to(this.cover, {background: 'transparent'})
    }
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

  show()
  {
    super.show()

    this.showAnimations.forEach(
      el => 
      {
        el.show()
      }
    )

    gsap.to(
      this.controls, 
      {
        height: '50rem',
        width: '50rem', 
        duration: 0.5, 
        ease: 'power2.inOut'
      }
    )
  }

  hide()
  {
    super.hide()

    gsap.to(
      this.controls, 
      {
        height: '0rem',
        width: '0rem', 
        duration: 0.5, 
        ease: 'power2.inOut'
      }
    )
  }

  update()
  {
    super.update()

    gsap.to(
      this.controls,
      {
        top: this.coord.y,
        left: this.coord.x,
        duration: 0.5, 
        ease: 'linear'
      }
    )
  }
}
