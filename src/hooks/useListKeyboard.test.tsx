import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef } from 'react'
import { useListStore, getFocusedIndex } from '../store/listStore'
import { useListKeyboard } from './useListKeyboard'

function TestComponent({
  listLength,
  rowCount,
}: {
  listLength: number
  rowCount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  useListKeyboard(listLength, ref, { rowCount })
  return (
    <div ref={ref} tabIndex={0} data-testid="container">
      List length: {listLength}
    </div>
  )
}

describe('useListKeyboard', () => {
  beforeEach(() => {
    useListStore.setState({ focusedRow: 0, focusedIndexByRow: {} })
  })

  it('focusNext is called on ArrowRight when container is focused', async () => {
    const user = userEvent.setup()
    render(<TestComponent listLength={3} />)
    const container = screen.getByTestId('container')
    container.focus()
    await user.keyboard('{ArrowRight}')
    const state = useListStore.getState()
    expect(getFocusedIndex(state.focusedIndexByRow, state.focusedRow)).toBe(1)
  })

  it('focusPrev is called on ArrowLeft when container is focused', async () => {
    const user = userEvent.setup()
    useListStore.setState({ focusedIndexByRow: { 0: 1 } })
    render(<TestComponent listLength={3} />)
    const container = screen.getByTestId('container')
    container.focus()
    await user.keyboard('{ArrowLeft}')
    const state = useListStore.getState()
    expect(getFocusedIndex(state.focusedIndexByRow, state.focusedRow)).toBe(0)
  })

  it('does not change focus when list length is 0', async () => {
    const user = userEvent.setup()
    render(<TestComponent listLength={0} />)
    const container = screen.getByTestId('container')
    container.focus()
    await user.keyboard('{ArrowRight}')
    const state = useListStore.getState()
    expect(getFocusedIndex(state.focusedIndexByRow, state.focusedRow)).toBe(0)
  })

  it('ArrowDown moves to row 1 without scrolling row 1', async () => {
    const user = userEvent.setup()
    render(<TestComponent listLength={3} rowCount={2} />)
    const container = screen.getByTestId('container')
    container.focus()
    await user.keyboard('{ArrowDown}')
    const state = useListStore.getState()
    expect(state.focusedRow).toBe(1)
    expect(getFocusedIndex(state.focusedIndexByRow, 1)).toBe(0)
  })

  it('ArrowUp moves to row 0 when on row 1 and rowCount is 2', async () => {
    const user = userEvent.setup()
    useListStore.setState({ focusedRow: 1 })
    render(<TestComponent listLength={3} rowCount={2} />)
    const container = screen.getByTestId('container')
    container.focus()
    await user.keyboard('{ArrowUp}')
    expect(useListStore.getState().focusedRow).toBe(0)
  })

  it('ArrowUp does nothing when rowCount is 1', async () => {
    const user = userEvent.setup()
    render(<TestComponent listLength={3} />)
    const container = screen.getByTestId('container')
    container.focus()
    await user.keyboard('{ArrowUp}')
    expect(useListStore.getState().focusedRow).toBe(0)
  })

  it('Left/Right do not change focusedRow when rowCount is 2', async () => {
    const user = userEvent.setup()
    render(<TestComponent listLength={3} rowCount={2} />)
    const container = screen.getByTestId('container')
    container.focus()
    await user.keyboard('{ArrowRight}')
    const state = useListStore.getState()
    expect(state.focusedRow).toBe(0)
    expect(getFocusedIndex(state.focusedIndexByRow, 0)).toBe(1)
  })
})
