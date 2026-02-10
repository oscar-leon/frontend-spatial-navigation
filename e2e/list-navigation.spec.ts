import { test, expect } from '@playwright/test'

test.describe('Content grid keyboard navigation', () => {
  test('loads and shows the grid with two rows', async ({ page }) => {
    await page.goto('/')
    const grid = page.getByTestId('content-grid')
    await expect(grid).toBeVisible()
    await grid.focus()
    await expect(grid).toHaveAttribute('data-focused-row', '0')
    await expect(grid).toHaveAttribute('data-focused-index', '0')
    const lists = page.getByTestId('horizontal-list')
    await expect(lists).toHaveCount(2)
  })

  test('ArrowRight moves focus within row and wraps', async ({ page }) => {
    await page.goto('/')
    const grid = page.getByTestId('content-grid')
    await grid.focus()
    await expect(grid).toHaveAttribute('data-focused-index', '0')
    await page.keyboard.press('ArrowRight')
    await expect(grid).toHaveAttribute('data-focused-index', '1')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(grid).toHaveAttribute('data-focused-index', '3')
  })

  test('ArrowLeft moves focus backward within row', async ({ page }) => {
    await page.goto('/')
    const grid = page.getByTestId('content-grid')
    await grid.focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await expect(grid).toHaveAttribute('data-focused-index', '2')
    await page.keyboard.press('ArrowLeft')
    await expect(grid).toHaveAttribute('data-focused-index', '1')
    await page.keyboard.press('ArrowLeft')
    await expect(grid).toHaveAttribute('data-focused-index', '0')
  })

  test('focused cell changes when focus moves', async ({ page }) => {
    await page.goto('/')
    const grid = page.getByTestId('content-grid')
    await grid.focus()
    const activedescendant = await grid.getAttribute('aria-activedescendant')
    expect(activedescendant).toBeTruthy()
    const focusedCell = page.locator(`[id="${activedescendant}"]`)
    await expect(focusedCell).toBeVisible()
    await page.keyboard.press('ArrowRight')
    const activedescendant2 = await grid.getAttribute('aria-activedescendant')
    expect(activedescendant2).not.toBe(activedescendant)
  })
})
