import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useListStore } from '../../store/listStore'
import { ContentGrid } from './ContentGrid'
import type { CollectionItem } from '../../domain/types'

const mockItems: CollectionItem[] = [
  { id: 1, title: 'First', images: { artwork_portrait: 'https://a.com/1.jpg' } },
  { id: 2, title: 'Second', images: { artwork_portrait: 'https://a.com/2.jpg' } },
  { id: 3, title: 'Third', images: { artwork_portrait: 'https://a.com/3.jpg' } },
]

describe('ContentGrid', () => {
  beforeEach(() => {
    useListStore.setState({ focusedRow: 0, focusedIndexByRow: {} })
  })

  it('renders grid with items and is accessible', () => {
    render(<ContentGrid items={mockItems} />)
    const grid = screen.getByTestId('content-grid')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveAttribute('role', 'grid')
    expect(grid).toHaveAttribute('aria-label', 'Content grid')
    const lists = screen.getAllByTestId('horizontal-list')
    expect(lists.length).toBeGreaterThan(0)
  })

  it('ArrowRight moves focusedIndex within row', async () => {
    const user = userEvent.setup()
    render(<ContentGrid items={mockItems} />)
    const grid = screen.getByTestId('content-grid')
    grid.focus()
    await user.keyboard('{ArrowRight}')
    expect(grid).toHaveAttribute('data-focused-index', '1')
    expect(grid).toHaveAttribute('data-focused-row', '0')
  })
})
