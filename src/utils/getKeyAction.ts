type KeyAction = 'down' | 'up' | 'bottom' | 'top' | 'launch'

export default (e: React.KeyboardEvent): KeyAction => {
  const ctrlPressed = e.ctrlKey || e.metaKey
  if (e.key === 'ArrowDown') {
    if (ctrlPressed) {
      return 'bottom'
    } else {
      return 'down'
    }
  }
  if (e.key === 'ArrowUp') {
    if (ctrlPressed) {
      return 'top'
    } else {
      return 'up'
    }
  }
  if (ctrlPressed) {
    if (e.key === 'j') {
      if (e.shiftKey) {
        return 'bottom'
      } else {
        return 'down'
      }
    } else if (e.key === 'k') {
      if (e.shiftKey) {
        return 'top'
      } else {
        return 'up'
      }
    }
  }
}
