import Component from 'classes/Component'

export default class Animation extends Component
{
  constructor({ element, elements })
  {
    super({
      element,
      elements
    })

    this.createObserver()

    this.hide()
  }

  createObserver()
  {
    this.observer = new IntersectionObserver(entries =>
    {
      entries.forEach(entry =>
      {
        if(entry.isIntersecting)
        {
          this.show()
        }
        else
        {
          this.hide()
        }
      })
    })

    this.observer.observe(this.element)
  }

  show()
  {

  }

  hide()
  {

  }

  onResize()
  {
    
  }
}
