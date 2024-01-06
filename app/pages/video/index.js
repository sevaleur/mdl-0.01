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
        iframe: '.video__iframe',
        title_div: '.video__title',
        title: '.video__title__text',
        wrapper: '.video__wrapper', 
        wrap: '.video__wrap',
        credits: 'h3.video__footer__credits__title__text',
        thanks: 'h3.video__footer__thanks__title__text',
        video_cover: '.video__media__cover', 
        back: '.video__back',
        controls: '.video__controls',
        controls_play: '.video__controls__play',
        controls_play_btn: '.video__btn',
        controls_mute: '.video__controls__mute',
        controls_mute_icon: '.video__controls__mute__icon'
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
  }

  createControls()
  {
    this.controls = {
      isPlaying: false, 
      isClicked: false,
      isCovered: false,
      isInactive: false,
      isFullscreen: false, 
    }
  }

  createVideo()
  {
    this.vid = new Plyr('#plyr', {
      autoplay: true, 
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
      this.elements.controls_play_btn.classList.add('active')
    }

    this.vid.muted
      ? this.elements.controls_mute_icon.classList.add('on')
      : this.elements.controls_mute_icon.classList.remove('on')

    this.iframe = document.querySelector('.plyr__video-embed')
    this.iframeContainer = document.querySelector('.plyr__video-embed__container')
  }

  createBounds()
  {
    this.backBounds = this.elements.back.getBoundingClientRect()
    this.titleBounds = this.elements.title_div.getBoundingClientRect()
    this.controlBounds = this.elements.controls.getBoundingClientRect()

    this.createWidth()
  }

  createWidth()
  {
    let calcWidth = window.innerWidth - (this.backBounds.width * 2) + 2
    let calcHeight = window.innerHeight - this.backBounds.height
    let calcVideo = window.innerHeight - (this.backBounds.height * 3)

    if(this.device.phone)
    {
      this.elements.wrap.style.height = `${calcVideo}px`
      this.elements.wrap.style.top = `${this.backBounds.height}px`

      this.elements.title_div.style.width = `${calcWidth}px`
      this.elements.iframe.style.height = `${calcHeight - this.backBounds.height}px`
    }
    else 
    {
      this.elements.iframe.style.height = `${calcHeight - 1}px`
    }

    if(!this.device.desktop)
    {
      this.iframe.style.top = `${(calcVideo / 3) + 5}px`
    }
  }

  createMotion()
  {
    horizontalLoop(
      this.elements.title, 
      { 
        paused: false, 
        reversed: true, 
        repeat: -1, 
        speed: 0.5 
      }
    )

    if(this.elements.credits && this.elements.thanks)
    {
      horizontalLoop(
        this.elements.credits, 
        { 
          paused: false, 
          reversed: true, 
          repeat: -1, 
          speed: 0.5 
        }
      )

      horizontalLoop(
        this.elements.thanks, 
        { 
          paused: false, 
          reversed: false, 
          repeat: -1, 
          speed: 0.5 
        }
      )
    }
    
    if(!this.device.phone)
    {
      this.onTitleShow = gsap.fromTo(
        this.elements.title_div, 
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
      
      this.enlargeControls = gsap.fromTo(
        this.elements.controls, 
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

      this.enlargePlayButton = gsap.to(
        this.elements.controls_play_btn,
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
      this.onTitleShow = gsap.fromTo(
        this.elements.title_div, 
        {
          yPercent: -100 
        }, 
        {
          yPercent: 0, 
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )

      this.enlargeControls = gsap.fromTo(
        this.elements.controls, 
        {
          yPercent: 100, 
        }, 
        {
          yPercent: 0,
          duration: 0.8, 
          ease: 'power2.inOut', 
          paused: true
        }
      )

      this.enlargePlayButton = gsap.to(
        this.elements.controls_play_btn, 
        {
          height: '30rem',
          width: '30rem', 
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

    this.enlargeMuteButton = gsap.fromTo(
      this.elements.controls_mute, 
      {
        scale: 0
      },
      {
        scale: 1,
        duration: 0.5, 
        ease: 'power2.inOut',
        paused: true
      }
    )

    this.onMuteClick = gsap.fromTo(
      this.elements.controls_mute_on, 
      {
        scale: 1, 
      }, 
      {
        scale: 0, 
        duration: 0.5, 
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
      ? this.elements.controls_play_btn.classList.remove('active')
      : this.elements.controls_play_btn.classList.add('active')

    this.elements.controls_play_btn.classList.contains('active') 
      ? (this.onPlay(), this.controls.isClicked = true)
      : (this.onPause(), this.controls.isClicked = false)
  }

  onMute()
  {
    if(!this.vid.muted)
    {
      this.vid.muted = true 
      this.elements.controls_mute_icon.classList.add('on')
    }
    else 
    {
      this.vid.muted = false
      this.elements.controls_mute_icon.classList.remove('on')
    }
  }

  onMouseEnter()
  {
    this.enlargePlayButton.play()
  }

  onMouseLeave()
  {
    this.enlargePlayButton.reverse()
  }

  onTouchMove(e)
  {
    super.onTouchMove(e)

    this.onIsCovered()
  }

  onWheel(e)
  {
    super.onWheel(e)

    this.onIsCovered()
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
    this.elements.controls_play_btn.classList.add('active')
    this.vid.play()
  }

  onPause()
  {
    this.controls.isPlaying = false 
    this.elements.controls_play_btn.classList.remove('active')
    this.vid.pause()
  }

  onIsCovered()
  {
    let location = (window.innerHeight - this.titleBounds.height) - this.scroll.current
    let scrollPos = (this.scroll.current + this.titleBounds.height) - window.innerHeight

    if(scrollPos >= location)
    {
      this.controls.isCovered = true 

      if(!this.device.phone)
        this.enlargeControls.reverse()

      gsap.to(this.elements.video_cover, { background: this.background } )

      if(this.controls.isPlaying)
        this.onPause()
    }

    if(scrollPos<=0)
    {
      if(this.controls.isCovered)
      {
        this.controls.isCovered = false

        if(!this.device.phone)
          this.enlargeControls.play()

        gsap.to(this.elements.video_cover, { background: 'transparent' } )

        this.onPlay()  
      }
    }
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
            this.enlargePlayButton.play() 
            this.enlargeMuteButton.play()
          }
        )
    }
    else 
    {
      this.enlargeControls.play()
      this.enlargePlayButton.play()
      this.enlargeMuteButton.play()
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
            this.enlargeMuteButton.reverse()
            this.enlargePlayButton.reverse()
          }
        )
    }
    else 
    {
      this.enlargeControls.reverse()
      this.enlargePlayButton.reverse()
      this.enlargeMuteButton.reverse()
    }

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
        this.elements.controls_play_btn,
        {
          top: this.coord.y,
          left: this.coord.x,
          duration: 0.5, 
          ease: 'linear',
        }
      )
    }

    if(this.device.tablet)
    {
      if(this.controls.isPlaying)
      {
        this.enlargePlayButton.reverse()
      }
      else 
      {
        this.enlargePlayButton.play()
      }
    }
  }

  /* 
    EVENTLISTENERS.
  */

  addEventListeners()
  {
    super.addEventListeners()

    if(!this.device.phone)
    {
      this.elements.iframe.addEventListener('mouseenter', this.onMouseEnter.bind(this))
      this.elements.iframe.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    }
    else
    {
      this.elements.controls_play.addEventListener('click', this.onClickInteraction.bind(this))
    }

    this.elements.controls_mute.addEventListener('click', this.onMute.bind(this))
    this.elements.iframe.addEventListener('click', this.onClickInteraction.bind(this))
    this.elements.back.addEventListener('click', this.onBack)
  }

  removeEventListeners()
  {
    super.removeEventListeners()

    if(!this.device.phone)
    {
      this.elements.iframe.removeEventListener('mouseenter', this.onMouseEnter)
      this.elements.iframe.removeEventListener('mouseleave', this.onMouseLeave)
    }
    else 
    {
      this.elements.controls_play.removeEventListener('click', this.onClickInteraction)
    }

    this.elements.controls_mute.removeEventListener('click', this.onMute)
    this.elements.iframe.removeEventListener('click', this.onClickInteraction)
    this.elements.back.removeEventListener('click', this.onBack)
  }
}
