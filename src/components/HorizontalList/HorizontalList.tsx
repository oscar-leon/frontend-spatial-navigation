import { useEffect, useRef } from 'react'
import type { CollectionItem } from '../../domain/types'
import { useListStore, getFocusedIndex } from '../../store/listStore'
import { useListKeyboard } from '../../hooks/useListKeyboard'
import {
  LIST_ITEM_WIDTH,
  LIST_ITEM_GAP,
  LIST_VIRTUAL_WINDOW_SIZE,
  TRANSITION_DURATION_MS,
} from '../../domain/constants'
import { ListItem } from '../ListItem/ListItem'
import styles from './HorizontalList.module.css'

interface HorizontalListProps {
  items: CollectionItem[]
  onSelect?: (rowIndex: number, index: number) => void
  rowIndex?: number
  getCellId?: (row: number, col: number) => string
  registerKeyboard?: boolean
}

const itemOffset = LIST_ITEM_WIDTH + LIST_ITEM_GAP

export function HorizontalList({
  items,
  rowIndex,
  getCellId,
  registerKeyboard = true,
}: HorizontalListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const focusedIndexByRow = useListStore((s) => s.focusedIndexByRow)
  const focusedRow = useListStore((s) => s.focusedRow)
  const effectiveFocusedIndex = getFocusedIndex(focusedIndexByRow, rowIndex ?? 0)

  // this logic could be centralised as it will be problematic if the app scales following this approach
  useListKeyboard(items.length, containerRef, {
    enabled: registerKeyboard,
  })

  // Ensure list has focus when items are ready
  // Skip when grid owns focus (registerKeyboard=false).
  useEffect(() => {
    if (registerKeyboard && items.length > 0) {
      containerRef.current?.focus()
    }
  }, [items.length, registerKeyboard])

  if (items.length === 0) {
    return (
      <div className={styles.empty} role="status">
        No items to display.
      </div>
    )
  }

  const isThisRowFocused = rowIndex === undefined ? true : focusedRow === rowIndex
  const translateX = -effectiveFocusedIndex * itemOffset
  const startIndex = Math.max(0, effectiveFocusedIndex - LIST_VIRTUAL_WINDOW_SIZE)
  const endIndex = Math.min(items.length - 1, effectiveFocusedIndex + LIST_VIRTUAL_WINDOW_SIZE)
  const windowItems = items.slice(startIndex, endIndex + 1)
  const leadingWidth = startIndex * itemOffset
  const trailingWidth = (items.length - 1 - endIndex) * itemOffset

  const shouldOptimizeTransform = items.length > 0

  return (
    <div
      ref={containerRef}
      className={styles.viewport}
      tabIndex={registerKeyboard ? 0 : -1}
      aria-label={rowIndex !== undefined ? `Content list row ${rowIndex + 1}` : 'Content list'}
      aria-activedescendant={
        registerKeyboard ? `list-item-${effectiveFocusedIndex}` : undefined
      }
      data-focused-index={effectiveFocusedIndex}
      data-testid="horizontal-list"
    >
      <div
        className={styles.strip}
        role="list"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: `transform ${TRANSITION_DURATION_MS}ms ease-out`,
          ...(shouldOptimizeTransform && { willChange: 'transform' }),
        }}
      >
        {leadingWidth > 0 && (
          <div
            className={styles.spacer}
            style={{ width: leadingWidth, flexShrink: 0 }}
            aria-hidden
          />
        )}
        {windowItems.map((item, i) => {
          const index = startIndex + i
          const isFocused =
            index === effectiveFocusedIndex && (rowIndex === undefined || isThisRowFocused)
          const cellKey = getCellId && rowIndex !== undefined ? getCellId(rowIndex, index) : `${item.id}-${index}`
          const cellId = getCellId && rowIndex !== undefined ? getCellId(rowIndex, index) : `list-item-${index}`

          return (
            <div
              key={cellKey}
              id={cellId}
              role="listitem"
              className={styles.itemWrapper}
              style={{ marginRight: LIST_ITEM_GAP }}
              data-focused={isFocused}
              data-row-index={rowIndex ?? 0}
              data-item-index={index}
            >
              <ListItem item={item} isFocused={isFocused} />
            </div>
          )
        })}
        {trailingWidth > 0 && (
          <div
            className={styles.spacer}
            style={{ width: trailingWidth, flexShrink: 0 }}
            aria-hidden
          />
        )}
      </div>
    </div>
  )
}
