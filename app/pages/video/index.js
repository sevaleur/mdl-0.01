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
        wrapper: '.video__wrapper', 
        ghost: '.video__ghost__div',
        credits: 'h3.video__footer__credits__title__text',
        thanks: 'h3.video__footer__thanks__title__text',
        cover: '.video__media__cover', 
        back: '.video__back',
        play: '.video__controls__play'
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

    this.createControls()
    this.createVideo()
    this.createBounds()
    this.createMotion()

    this.elements.credits && this.elements.thanks
       ? this.createLoop(this.elements.title, this.elements.credits, this.elements.thanks)
       : this.createLoop(this.elements.title)
  }

  createControls()
  {
    this.controls = {
      element: document.querySelector('.video__controls'),
      buttons: {
        mute: '', 
        play: document.querySelector('.video__btn'),
        fullScreen: ''
      },
      isPlaying: false, 
      isClicked: false,
      isCovered: false,
      isInactive: false
    }
  }

  createVideo()
  {
    this.vid = new Plyr('#plyr', {
      autoplay: !this.device.desktop ? true : false, 
      muted: true, 
      clickToPlay: true,
      hideControls: true, 
      loop: { active: true },
      loadSprite: false,
      ratio: this.device.tablet || this.device.phone ? '9:16' : '16:9'
    })

    if(this.vid.autoplay)
    {
      this.controls.isPlaying = true 
      this.controls.buttons.play.classList.add('active')
    }
  }

  createBounds()
  {
    this.backBounds = this.elements.back.getBoundingClientRect()
    this.titleBounds = this.elements.titleDiv.getBoundingClientRect()
    this.controlBounds = this.controls.element.getBoundingClientRect()

    if(this.device.phone)
      this.createWidth()
  }

  createWidth()
  {
    let calc = window.innerWidth - (this.backBounds.width * 2) + 2
    this.controls.element.style.width = `${calc}px`
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

  createMotion()
  {
    if(!this.device.phone)
    {
      this.enlargeControls = gsap.fromTo(
        this.controls.element, 
        {
          xPercent: -100, 
        }, 
        {
          xPercent: 0,
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )

      this.enlargeButton = gsap.to(
        this.controls.buttons.play, 
        {
          height: '50rem',
          width: '50rem', 
          duration: 0.5, 
          ease: 'power2.inOut',
          paused: true
        }
      )
    }
    else 
    {
      this.enlargeControls = gsap.fromTo(
        this.controls.element, 
        {
          yPercent: -100, 
        }, 
        {
          yPercent: 0,
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )

      this.enlargeButton = gsap.to(
        this.controls.buttons.play, 
        {
          height: '20rem',
          width: '20rem', 
          duration: 0.5, 
          ease: 'power2.inOut',
          paused: true
        }
      )
    }

    this.onBackShow = gsap.fromTo(
      this.elements.back, 
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

  /* 
    EVENTS.
  */

  onClickInteraction()
  {
    this.controls.isPlaying  
      ? this.controls.buttons.play.classList.remove('active')
      : this.controls.buttons.play.classList.add('active')

    this.controls.buttons.play.classList.contains('active') 
      ? (this.onPlay(), this.controls.isClicked = true)
      : (this.onPause(), this.controls.isClicked = false)
  }

  onMouseEnter()
  {
    this.enlargeButton.play()
  }

  onMouseLeave()
  {
    this.enlargeButton.reverse()
  }

  onWheel(e)
  {
    super.onWheel(e)

    let location = (window.innerHeight - this.titleBounds.height) - this.scroll.current
    let scrollPos = (this.scroll.current + this.titleBounds.height) - window.innerHeight

    let scrollPosControls, 
        controlsLocation
    
    if(this.device.phone)
    {
      scrollPosControls = (this.scroll.current + this.controlBounds.height) - window.innerHeight
      controlsLocation = (window.innerHeight - this.controlBounds.height) - this.scroll.current
    }
    else 
    {
      scrollPosControls = (this.scroll.current + (this.controlBounds.height + this.backBounds.height)) - window.innerHeight
      controlsLocation = (window.innerHeight - (this.controlBounds.height + this.backBounds.height)) - this.scroll.current
    }

    if(scrollPosControls >= controlsLocation)
    {
      this.enlargeControls.reverse()
    }
    else 
    {
      this.enlargeControls.play()
    }

    if(scrollPos >= location)
    {
      this.controls.isCovered = true 

      gsap.to(this.elements.cover, {background: this.background})

      if(this.controls.isPlaying)
        this.onPause()
    }

    if(scrollPos<=0)
    {
      if(this.controls.isCovered)
      {
        this.controls.isCovered = false

        gsap.to(this.elements.cover, {background: 'transparent'})

        if(this.controls.isClicked)
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
    window.history.back()
  }

  onPlay()
  {
    this.controls.isPlaying = true
    this.vid.play()
  }

  onPause()
  {
    this.controls.isPlaying = false 
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

    if(this.device.phone)
    {
      this.enlargeControls.play()
        .eventCallback(
          'onComplete', () => 
          { 
            this.enlargeButton.play() 
          }
        )
    }
    else 
    {
      this.enlargeControls.play()
      this.enlargeButton.play()
    }
  }

  hide()
  {
    super.hide()

    if(this.device.phone)
    {
      this.enlargeControls.reverse()
        .eventCallback(
          'onReverseComplete', () => 
          {
            this.enlargeButton.reverse()
          }
        )
    }
    else 
    {
      this.enlargeControls.reverse()
      this.enlargeButton.reverse()
    }

    this.onTitleShow.reverse()
    this.onBackShow.reverse()
  }

  /* 
    UPDATE.
  */

  addEventListeners()
  {
    super.addEventListeners()

    if(!this.device.phone)
    {
      this.elements.ghost.addEventListener('mouseenter', this.onMouseEnter.bind(this))
      this.elements.ghost.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    }
    else
    {
      this.elements.play.addEventListener('click', this.onClickInteraction.bind(this))
    }

    this.elements.ghost.addEventListener('click', this.onClickInteraction.bind(this))
    this.elements.back.addEventListener('click', this.onBack)
  }

  removeEventListeners()
  {
    super.removeEventListeners()

    if(!this.device.phone)
    {
      this.elements.ghost.removeEventListener('mouseenter', this.onMouseEnter)
      this.elements.ghost.removeEventListener('mouseleave', this.onMouseLeave)
    }
    else 
    {
      this.elements.play.removeEventListener('click', this.onClickInteraction)
    }

    this.elements.ghost.removeEventListener('click', this.onClickInteraction)
    this.elements.back.removeEventListener('click', this.onBack)
  }

  update()
  {
    super.update()

    if(this.device.desktop)
    {
      gsap.to(
        this.controls.buttons.play,
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
