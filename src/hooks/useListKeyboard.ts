import { useEffect, useRef } from 'react'
import { useListStore, getFocusedIndex } from '../store/listStore'
import {
  KEYS_NEXT,
  KEYS_PREV,
  KEYS_UP,
  KEYS_DOWN,
  KEYS_SELECT,
} from '../domain/constants'

export type ListKeyboardOnSelect = (rowIndex: number, colIndex: number) => void

// Attaches keydown handling for list/grid navigation (Left/Right)
// It should work also with up/down but we only use a single row.
// Added key codes for TV remotes as extra.
export function useListKeyboard(
  listLength: number,
  containerRef: React.RefObject<HTMLElement | null>,
  options?: { rowCount?: number; enabled?: boolean; }
): void {
  const rowCount = options?.rowCount ?? 1
  const enabled = options?.enabled ?? true
  const focusNext = useListStore((s) => s.focusNext)
  const focusPrev = useListStore((s) => s.focusPrev)
  const focusUp = useListStore((s) => s.focusUp)
  const focusDown = useListStore((s) => s.focusDown)
  const listLengthRef = useRef(listLength)
  listLengthRef.current = listLength

  useEffect(() => {
    const el = containerRef.current
    if (!el || !enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const len = listLengthRef.current
      if (len <= 0) return

      if (KEYS_NEXT.includes(e.key as (typeof KEYS_NEXT)[number])) {
        e.preventDefault()
        focusNext(len)
      } else if (KEYS_PREV.includes(e.key as (typeof KEYS_PREV)[number])) {
        e.preventDefault()
        focusPrev(len)
      } else if (rowCount > 1 && KEYS_UP.includes(e.key as (typeof KEYS_UP)[number])) {
        e.preventDefault()
        focusUp(rowCount)
      } else if (rowCount > 1 && KEYS_DOWN.includes(e.key as (typeof KEYS_DOWN)[number])) {
        e.preventDefault()
        focusDown(rowCount)
      } else if (KEYS_SELECT.includes(e.key as (typeof KEYS_SELECT)[number])) {
        const state = useListStore.getState()
        const focusedIndex = getFocusedIndex(state.focusedIndexByRow, state.focusedRow)
        if (focusedIndex >= 0 && focusedIndex < len) {
          e.preventDefault()
        }
      }
    }

    el.addEventListener('keydown', handleKeyDown)

    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [containerRef, rowCount, enabled, focusNext, focusPrev, focusUp, focusDown])
}
