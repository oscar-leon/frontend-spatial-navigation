
export const LIST_ITEM_WIDTH = 200
export const LIST_ITEM_HEIGHT = 300
export const LIST_ITEM_GAP = 16
export const VISIBLE_ITEMS_COUNT = 5
export const LIST_VIRTUAL_WINDOW_SIZE = 15
export const TRANSITION_DURATION_MS = 300

export const KEY_ARROW_LEFT = 'ArrowLeft'
export const KEY_ARROW_RIGHT = 'ArrowRight'
export const KEY_LEFT = 'Left'
export const KEY_RIGHT = 'Right'
export const KEY_ENTER = 'Enter'
export const KEY_SELECT = 'Select'
export const KEY_ARROW_UP = 'ArrowUp'
export const KEY_ARROW_DOWN = 'ArrowDown'
export const KEY_UP = 'Up'
export const KEY_DOWN = 'Down'

// Rudimentary implementarion: here we could map different keys depending on platform/models
export const KEYS_PREV = [KEY_ARROW_LEFT, KEY_LEFT] as const
export const KEYS_NEXT = [KEY_ARROW_RIGHT, KEY_RIGHT] as const
export const KEYS_UP = [KEY_ARROW_UP, KEY_UP] as const
export const KEYS_DOWN = [KEY_ARROW_DOWN, KEY_DOWN] as const
export const KEYS_SELECT = [KEY_ENTER, KEY_SELECT] as const
