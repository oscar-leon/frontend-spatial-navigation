import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useListStore } from '../../store/listStore'
import { HorizontalList } from './HorizontalList'
import type { CollectionItem } from '../../domain/types'

const mockItems: CollectionItem[] = [
  { id: 1, title: 'First', images: { artwork_portrait: 'https://a.com/1.jpg' } },
  { id: 2, title: 'Second', images: { artwork_portrait: 'https://a.com/2.jpg' } },
  { id: 3, title: 'Third', images: { artwork_portrait: 'https://a.com/3.jpg' } },
]

describe('HorizontalList', () => {
  beforeEach(() => {
    useListStore.setState({ focusedRow: 0, focusedIndexByRow: {} })
  })

  it('shows empty message when items is empty', () => {
    render(<HorizontalList items={[]} />)
    expect(screen.getByRole('status')).toHaveTextContent('No items to display')
  })

  it('renders all items and focuses first', () => {
    render(<HorizontalList items={mockItems} />)
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Third')).toBeInTheDocument()
    const list = screen.getByTestId('horizontal-list')
    expect(list).toHaveAttribute('data-focused-index', '0')
  })

  it('updates focused index on ArrowRight', async () => {
    const user = userEvent.setup()
    render(<HorizontalList items={mockItems} />)
    const list = screen.getByTestId('horizontal-list')
    list.focus()
    await user.keyboard('{ArrowRight}')
    expect(list).toHaveAttribute('data-focused-index', '1')
    await user.keyboard('{ArrowRight}')
    expect(list).toHaveAttribute('data-focused-index', '2')
    await user.keyboard('{ArrowRight}')
    expect(list).toHaveAttribute('data-focused-index', '0')
  })

  it('updates focused index on ArrowLeft', async () => {
    const user = userEvent.setup()
    useListStore.setState({ focusedIndexByRow: { 0: 1 } })
    render(<HorizontalList items={mockItems} />)
    const list = screen.getByTestId('horizontal-list')
    list.focus()
    await user.keyboard('{ArrowLeft}')
    expect(list).toHaveAttribute('data-focused-index', '0')
  })

  it('in grid mode uses store focusedRow and getCellId for item id', () => {
    const getCellId = (row: number, col: number) => `cell-${row}-${col}`
    useListStore.setState({ focusedRow: 1, focusedIndexByRow: { 1: 1 } })
    render(
      <HorizontalList
        items={mockItems}
        rowIndex={1}
        getCellId={getCellId}
        registerKeyboard={false}
      />
    )
    const list = screen.getByTestId('horizontal-list')
    expect(list).toHaveAttribute('tabIndex', '-1')
    const cell = document.getElementById('cell-1-1')
    expect(cell).toBeInTheDocument()
    expect(cell).toHaveAttribute('data-focused', 'true')
  })
})
