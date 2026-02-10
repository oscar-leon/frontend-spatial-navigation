import { memo } from 'react'
import type { CollectionItem } from '../../domain/types'
import { LIST_ITEM_WIDTH, LIST_ITEM_HEIGHT } from '../../domain/constants'
import styles from './ListItem.module.css'

interface ListItemProps {
  item: CollectionItem
  isFocused: boolean
}

// AI generated placeholder
// ideally to point to a specific asset
const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"%3E%3Crect fill="%23333" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" fill="%23666" text-anchor="middle" dy=".3em"%3ENo image%3C/text%3E%3C/svg%3E'

function ListItemComponent({ item, isFocused }: ListItemProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget
    target.onerror = null
    target.src = PLACEHOLDER_IMAGE
  }

  return (
    <div
      className={styles.item}
      data-focused={isFocused}
      data-testid="list-item"
    >
      <div
        className={`${styles.cover} ${isFocused ? styles.focused : ''}`}
        style={{
          width: LIST_ITEM_WIDTH,
          height: LIST_ITEM_HEIGHT,
          ...(isFocused && { willChange: 'transform' }),
        }}
      >
        <img
          src={item.images.artwork_portrait}
          alt={item.title || 'Content item artwork'}
          width={LIST_ITEM_WIDTH}
          height={LIST_ITEM_HEIGHT}
          onError={handleImageError}
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className={styles.title} data-testid="item-title">{item.title}</span>
    </div>
  )
}

export const ListItem = memo(ListItemComponent)
