import { useState, useEffect, useRef, useCallback } from 'react'
import { loadCollectionAsync } from './data/loadCollection'
import type { CollectionItem } from './domain/types'
import { ContentGrid } from './components/ContentGrid/ContentGrid'
import styles from './App.module.css'

export type SelectedCell = { row: number; index: number }

export default function App() {
  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    loadCollectionAsync() // on react 19 we could use it on the state and clean the useEffect
      .then((collection) => {
        setItems(collection)
      })
      .catch((e) => {
        console.error('Failed to load collection', e)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleFocusOut = useCallback((e: React.FocusEvent<HTMLElement>) => {
    const main = mainRef.current

    if (!main) return;

    const next = e.relatedTarget as Node | null

    if (next != null && main.contains(next)) return;

    requestAnimationFrame(() => {
      // in production this should be handled differently, a combination of a focus trap with a better decoupling of the spatial navigation instead of the data-testid
      const grid = main.querySelector<HTMLElement>('[data-testid="content-grid"]') 
      grid?.focus()
    })
  }, [])

  if (loading) {
    return (
      <div className={styles.loading} role="status" aria-live="polite">
        Loading…
      </div>
    )
  }

  return (
    <main
      ref={mainRef}
      className={styles.main}
      onBlur={handleFocusOut}
    >
      <h1 className={styles.title}>Content list</h1>
      <ContentGrid
        items={items}
      />
    </main>
  )
}
