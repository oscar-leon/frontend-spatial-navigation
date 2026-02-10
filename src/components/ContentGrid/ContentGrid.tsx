import { useEffect, useRef, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import type { CollectionItem } from '../../domain/types'
import { useListStore, getFocusedIndex } from '../../store/listStore'
import { useListKeyboard } from '../../hooks/useListKeyboard'
import { HorizontalList } from '../HorizontalList/HorizontalList'
import styles from './ContentGrid.module.css'

// ROW_COUNT is set to 1 as we only have 1 row
// if we would have more rows (or want to test it), we should duplicate the rows or add more []data
// This is just a hardcoded approach, on a production app we should have this handled differently.
// decoupling the spatial navigation and map virtually the focusable childres as other libraries do such as "Norigin-Spatial-Navigation"
const ROW_COUNT = 1

interface ContentGridProps {
  items: CollectionItem[]
}

export function ContentGrid({ items }: ContentGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const focusedRow = useListStore((s) => s.focusedRow)
  const focusedIndexByRow = useListStore((s) => s.focusedIndexByRow)
  const focusedIndex = getFocusedIndex(focusedIndexByRow, focusedRow)

  const cellIdMapRef = useRef<Map<string, string>>(new Map())

  const getCellId = useCallback((row: number, col: number): string => {
    const cellKey = `${row}-${col}`

    if (!cellIdMapRef.current.has(cellKey)) {
      cellIdMapRef.current.set(cellKey, uuid())
    }

    const cellId = cellIdMapRef.current.get(cellKey)
    if (!cellId) {
      throw new Error(`Failed to get cell ID for row ${row}, col ${col}`)
    }
    return cellId
  }, [])

  useListKeyboard(items.length, containerRef, {
    rowCount: ROW_COUNT,
  })

  useEffect(() => {
    if (items.length > 0) {
      containerRef.current?.focus()
    }
  }, [items.length])

  if (items.length === 0) {
    return (
      <div className={styles.grid} role="status">
        No items to display.
      </div>
    )
  }

  const activedescendantId = getCellId(focusedRow, focusedIndex)  

  return (
    <div
      ref={containerRef}
      className={styles.grid}
      role="grid"
      aria-label="Content grid"
      aria-activedescendant={activedescendantId}
      tabIndex={0}
      data-focused-row={focusedRow}
      data-focused-index={focusedIndex}
      data-testid="content-grid"
    >
      <div className={styles.row} role="row">
        <HorizontalList
          items={items}
          rowIndex={0}
          getCellId={getCellId}
          registerKeyboard={false}
        />
      </div>
    </div>
  )
}
