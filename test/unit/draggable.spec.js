import Draggable from '../../src/Draggable'

import {
  dispatchTouchStart,
  dispatchTouchMove,
  dispatchTouchEnd
} from '../utils/event'

mocha.setup({ timeout: 5000 })

describe('Draggable', () => {
  let el, draggableEl

  before(() => {
    el = document.createElement('div')
    el.style.height = '500px'
    el.style.width = '500px'
    el.style.background = 'red'
    document.body.appendChild(el)

    draggableEl = new Draggable(el)
  });

  afterEach(function() {
    dispatchTouchEnd(el, {
      pageX: 200,
      pageY: 200
    })
  })

  it('start', () => {
    const startHandler = sinon.spy()
    draggableEl.on('start', startHandler)

    dispatchTouchStart(el, {
      pageX: 100,
      pageY: 50
    })
    expect(startHandler)
      .to.be.calledOnce
    expect(draggableEl.x)
      .to.equal(0)
    expect(draggableEl.y)
      .to.equal(0)
  })

  it('move', () => {
    const moveHandler = sinon.spy()
    draggableEl.on('move', moveHandler)

    dispatchTouchStart(el, {
      pageX: 200,
      pageY: 200
    })
    dispatchTouchMove(el, {
      pageX: 200,
      pageY: 250
    })

    expect(moveHandler)
      .to.be.calledOnce
    expect(draggableEl.x)
      .to.equal(0)
    expect(draggableEl.y)
      .to.equal(50)
  })

  it('end', done => {
    const endHandler = sinon.spy()
    draggableEl.on('end', endHandler)

    dispatchTouchStart(el, {
      pageX: 200,
      pageY: 200
    })
    dispatchTouchMove(el, {
      pageX: 200,
      pageY: 250
    })
    dispatchTouchEnd(el, {
      pageX: 200,
      pageY: 250
    })

    setTimeout(() => {
      expect(endHandler)
      .to.be.calledOnce
      expect(draggableEl.x)
        .to.equal(0)
      expect(draggableEl.y)
        .to.equal(0)
      done()
    }, 3000)
  })
})


