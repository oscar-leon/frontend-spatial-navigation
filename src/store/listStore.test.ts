import { describe, it, expect, beforeEach } from 'vitest'
import {
  useListStore,
  getNextFocusIndex,
  getNextFocusRow,
  getFocusedIndex,
} from './listStore'

describe('getNextFocusIndex', () => {
  it('returns 0 when listLength is 0', () => {
    expect(getNextFocusIndex(0, 0, 'next')).toBe(0)
    expect(getNextFocusIndex(0, 0, 'prev')).toBe(0)
  })

  it('returns 0 when listLength is negative', () => {
    expect(getNextFocusIndex(0, -1, 'next')).toBe(0)
  })

  it('wraps from last to first on next', () => {
    expect(getNextFocusIndex(2, 3, 'next')).toBe(0)
  })

  it('wraps from first to last on prev', () => {
    expect(getNextFocusIndex(0, 3, 'prev')).toBe(2)
  })

  it('increments on next when not at end', () => {
    expect(getNextFocusIndex(0, 5, 'next')).toBe(1)
    expect(getNextFocusIndex(1, 5, 'next')).toBe(2)
  })

  it('decrements on prev when not at start', () => {
    expect(getNextFocusIndex(2, 5, 'prev')).toBe(1)
    expect(getNextFocusIndex(1, 5, 'prev')).toBe(0)
  })

  it('stays at 0 when length is 1', () => {
    expect(getNextFocusIndex(0, 1, 'next')).toBe(0)
    expect(getNextFocusIndex(0, 1, 'prev')).toBe(0)
  })
})

describe('getNextFocusRow', () => {
  it('returns currentRow when rowCount is 0 or 1', () => {
    expect(getNextFocusRow(0, 0, 'down')).toBe(0)
    expect(getNextFocusRow(0, 1, 'up')).toBe(0)
    expect(getNextFocusRow(0, 1, 'down')).toBe(0)
  })

  it('moves down and wraps from last to first', () => {
    expect(getNextFocusRow(0, 2, 'down')).toBe(1)
    expect(getNextFocusRow(1, 2, 'down')).toBe(0)
  })

  it('moves up and wraps from first to last', () => {
    expect(getNextFocusRow(1, 2, 'up')).toBe(0)
    expect(getNextFocusRow(0, 2, 'up')).toBe(1)
  })
})

describe('getFocusedIndex', () => {
  it('returns value for row when set', () => {
    expect(getFocusedIndex({ 0: 2, 1: 3 }, 0)).toBe(2)
    expect(getFocusedIndex({ 0: 2, 1: 3 }, 1)).toBe(3)
  })

  it('returns 0 for row not in map', () => {
    expect(getFocusedIndex({}, 0)).toBe(0)
    expect(getFocusedIndex({ 1: 1 }, 0)).toBe(0)
  })
})

describe('useListStore', () => {
  beforeEach(() => {
    useListStore.setState({ focusedRow: 0, focusedIndexByRow: {} })
  })

  it('starts with focusedIndex 0 for row 0', () => {
    const state = useListStore.getState()
    expect(getFocusedIndex(state.focusedIndexByRow, 0)).toBe(0)
  })

  it('focusNext increments and wraps at end', () => {
    const { focusNext } = useListStore.getState()
    focusNext(3)
    expect(getFocusedIndex(useListStore.getState().focusedIndexByRow, 0)).toBe(1)
    focusNext(3)
    expect(getFocusedIndex(useListStore.getState().focusedIndexByRow, 0)).toBe(2)
    focusNext(3)
    expect(getFocusedIndex(useListStore.getState().focusedIndexByRow, 0)).toBe(0)
  })

  it('focusNext only updates current row', () => {
    useListStore.setState({ focusedRow: 0, focusedIndexByRow: { 0: 1, 1: 2 } })
    const { focusNext } = useListStore.getState()
    focusNext(5)
    const state = useListStore.getState()
    expect(getFocusedIndex(state.focusedIndexByRow, 0)).toBe(2)
    expect(getFocusedIndex(state.focusedIndexByRow, 1)).toBe(2)
  })

  it('focusPrev decrements and wraps at start', () => {
    useListStore.setState({ focusedIndexByRow: { 0: 2 } })
    const { focusPrev } = useListStore.getState()
    focusPrev(3)
    expect(getFocusedIndex(useListStore.getState().focusedIndexByRow, 0)).toBe(1)
    focusPrev(3)
    expect(getFocusedIndex(useListStore.getState().focusedIndexByRow, 0)).toBe(0)
    focusPrev(3)
    expect(getFocusedIndex(useListStore.getState().focusedIndexByRow, 0)).toBe(2)
  })

  it('focusNext with length 1 keeps index 0', () => {
    const { focusNext } = useListStore.getState()
    focusNext(1)
    expect(getFocusedIndex(useListStore.getState().focusedIndexByRow, 0)).toBe(0)
  })

  it('focusPrev with length 1 keeps index 0', () => {
    const { focusPrev } = useListStore.getState()
    focusPrev(1)
    expect(getFocusedIndex(useListStore.getState().focusedIndexByRow, 0)).toBe(0)
  })

  it('starts with focusedRow 0', () => {
    expect(useListStore.getState().focusedRow).toBe(0)
  })

  it('focusDown moves to row 1 without changing row 1 index', () => {
    const { focusDown } = useListStore.getState()
    focusDown(2)
    const state = useListStore.getState()
    expect(state.focusedRow).toBe(1)
    expect(getFocusedIndex(state.focusedIndexByRow, 1)).toBe(0)
  })

  it('focusDown does not overwrite target row index', () => {
    useListStore.setState({ focusedRow: 0, focusedIndexByRow: { 0: 2, 1: 3 } })
    const { focusDown } = useListStore.getState()
    focusDown(2)
    const state = useListStore.getState()
    expect(state.focusedRow).toBe(1)
    expect(getFocusedIndex(state.focusedIndexByRow, 1)).toBe(3)
  })

  it('focusDown wraps from row 1 to 0 when rowCount is 2', () => {
    useListStore.setState({ focusedRow: 1, focusedIndexByRow: { 1: 1 } })
    const { focusDown } = useListStore.getState()
    focusDown(2)
    expect(useListStore.getState().focusedRow).toBe(0)
  })

  it('focusUp moves to row 0 when on row 1 and does not change row 0 index', () => {
    useListStore.setState({ focusedRow: 1, focusedIndexByRow: { 0: 2, 1: 1 } })
    const { focusUp } = useListStore.getState()
    focusUp(2)
    const state = useListStore.getState()
    expect(state.focusedRow).toBe(0)
    expect(getFocusedIndex(state.focusedIndexByRow, 0)).toBe(2)
  })

  it('focusUp wraps from row 0 to 1 when rowCount is 2', () => {
    const { focusUp } = useListStore.getState()
    focusUp(2)
    expect(useListStore.getState().focusedRow).toBe(1)
  })

  it('focusUp and focusDown no-op when rowCount is 1', () => {
    const { focusUp, focusDown } = useListStore.getState()
    focusUp(1)
    expect(useListStore.getState().focusedRow).toBe(0)
    focusDown(1)
    expect(useListStore.getState().focusedRow).toBe(0)
  })

  it('setFocus sets focusedRow and that row index', () => {
    const { setFocus } = useListStore.getState()
    setFocus(1, 2)
    const state = useListStore.getState()
    expect(state.focusedRow).toBe(1)
    expect(getFocusedIndex(state.focusedIndexByRow, 1)).toBe(2)
  })
})
