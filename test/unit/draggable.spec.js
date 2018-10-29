import Draggable from '../../src/Draggable'

import {
  dispatchTouchStart,
  dispatchTouchMove,
  dispatchTouchEnd
} from '../utils/event'

describe('Draggable', () => {
  it('start', () => {
    const el = document.createElement('div')
    const draggableEl = new Draggable(el)
    dispatchTouchStart()
  })
})
