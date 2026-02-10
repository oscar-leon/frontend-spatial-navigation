import { create } from 'zustand'
import type { FocusDirection, RowFocusDirection } from '../domain/types'

export function getNextFocusIndex(
  current: number,
  listLength: number,
  direction: FocusDirection
): number {
  if (listLength <= 0) return 0;

  if (direction === 'next') {
    return (current + 1) % listLength
  }

  return (current - 1 + listLength) % listLength
}

export function getNextFocusRow(
  currentRow: number,
  rowCount: number,
  direction: RowFocusDirection
): number {
  if (rowCount <= 1) return currentRow;

  if (direction === 'down') {
    return (currentRow + 1) % rowCount;
  }
  
  return (currentRow - 1 + rowCount) % rowCount;
}

export function getFocusedIndex(
  focusedIndexByRow: Record<number, number>,
  row: number
): number {
  return focusedIndexByRow[row] ?? 0
}

interface ListStore {
  focusedRow: number
  focusedIndexByRow: Record<number, number>
  focusNext: (listLength: number) => void
  focusPrev: (listLength: number) => void
  focusUp: (rowCount: number) => void
  focusDown: (rowCount: number) => void
  setFocus: (row: number, index: number) => void
}

export const useListStore = create<ListStore>((set) => ({
  focusedRow: 0,
  focusedIndexByRow: {},
  focusNext: (listLength: number) =>
    set((state) => {
      const row = state.focusedRow
      const current = state.focusedIndexByRow[row] ?? 0
      return {
        focusedIndexByRow: {
          ...state.focusedIndexByRow,
          [row]: getNextFocusIndex(current, listLength, 'next'),
        },
      }
    }),
  focusPrev: (listLength: number) =>
    set((state) => {
      const row = state.focusedRow
      const current = state.focusedIndexByRow[row] ?? 0
      return {
        focusedIndexByRow: {
          ...state.focusedIndexByRow,
          [row]: getNextFocusIndex(current, listLength, 'prev'),
        },
      }
    }),
  focusUp: (rowCount: number) =>
    set((state) => ({
      focusedRow: getNextFocusRow(state.focusedRow, rowCount, 'up'),
    })),
  focusDown: (rowCount: number) =>
    set((state) => ({
      focusedRow: getNextFocusRow(state.focusedRow, rowCount, 'down'),
    })),
  setFocus: (row: number, index: number) =>
    set((state) => ({
      focusedRow: row,
      focusedIndexByRow: {
        ...state.focusedIndexByRow,
        [row]: index,
      },
    })),
}))
