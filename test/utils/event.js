export function createEvent (type, name) {
  const event = document.createEvent(type || 'Event')
  event.initEvent(name, true, true)
  return event
}

export function dispatchTouch (target, name = 'touchstart', touches) {
  const event = createEvent('', name)
  event.touches = event.targetTouches = event.changedTouches = Array.isArray(touches) ? touches : [touches]
  target.dispatchEvent(event)
}

export function dispatchTouchStart (target, touches) {
  dispatchTouch(target, 'touchstart', touches)
}

export function dispatchTouchMove (target, touches) {
  dispatchTouch(target, 'touchmove', touches)
}

export function dispatchTouchEnd (target, touches) {
  dispatchTouch(target, 'touchend', touches)
}
