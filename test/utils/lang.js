import { expect } from 'chai'

import { extend } from '../../src/utils/lang'

describe('lang.js', () => {
  it('#extend()', () => {
    const target = {}
    const source = {
      a: 'a',
      b: {
        c: 'c'
      },
      d: ['2'],
      e: [
        {
          m: 'm'
        }
      ]
    }
    extend(target, source, {
      a: 'aa'
    })
    expect(target.a).to.equal('aa')
    expect(target.b).to.equal(source.b)
    expect(target.b.c).to.equal(source.b.c)
    expect(target.d).to.equal(source.d)
    expect(target.e).to.equal(source.e)
    expect(target.e.length).to.equal(source.e.length)
    expect(target.e[0]).to.equal(source.e[0])
  })
})
