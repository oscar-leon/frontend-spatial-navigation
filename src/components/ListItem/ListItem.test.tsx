import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListItem } from './ListItem'
import type { CollectionItem } from '../../domain/types'

const mockItem: CollectionItem = {
  id: 1,
  title: 'Test Movie',
  images: { artwork_portrait: 'https://example.com/portrait.jpg' },
}

describe('ListItem', () => {
  it('renders title and image', () => {
    render(<ListItem item={mockItem} isFocused={false} />)
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    const item = screen.getByTestId('list-item')
    const img = item.querySelector('img')
    expect(img).not.toBeNull()
    expect(img).toHaveAttribute('src', mockItem.images.artwork_portrait)
  })

  it('has data-focused when focused', () => {
    render(<ListItem item={mockItem} isFocused={true} />)
    const item = screen.getByTestId('list-item')
    expect(item).toHaveAttribute('data-focused', 'true')
  })

  it('does not have data-focused when not focused', () => {
    render(<ListItem item={mockItem} isFocused={false} />)
    const item = screen.getByTestId('list-item')
    expect(item).toHaveAttribute('data-focused', 'false')
  })
})
