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
    document.body.appendChild(el)

    draggableEl = new Draggable(el)
  });

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
})


