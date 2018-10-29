import Dragable from '../../src/Dragable'

import {
  dispatchTouchStart,
  dispatchTouchMove,
  dispatchTouchEnd
} from '../utils/event'

describe('Dragable', () => {
  it('start', () => {
    const el = document.createElement('div')
    const dragableEl = new Dragable(el)
    dispatchTouchStart()
  })
})
