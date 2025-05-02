# Test info

- Name: Update review text
- Location: /Users/perth/Documents/CO-working-space/Frontend/test/reviewedit.test.ts:3:5

# Error details

```
Error: locator.click: Test ended.
Call log:
  - waiting for getByRole('button', { name: 'Write a Review' })

    at /Users/perth/Documents/CO-working-space/Frontend/test/reviewedit.test.ts:15:62
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | test.setTimeout(50000);
   3 | test('Update review text', async ({ page }) => {
   4 |   await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
   5 |   await page.fill('input[name="email"]', 'SL@gmail.com');
   6 |   await page.fill('input[name="password"]', '12345678');
   7 |   await page.click('button[type="submit"]');
   8 |   await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });
   9 |
  10 |   await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();
  11 |
  12 |   const firstItem = page.locator('a[href^="/coworkingspace/"]').first();
  13 |   await firstItem.click();
  14 |
> 15 |   await page.getByRole('button', { name: 'Write a Review' }).click();
     |                                                              ^ Error: locator.click: Test ended.
  16 |   
  17 |   await expect(page.locator('text=Your Comments')).toBeVisible();
  18 |
  19 |   const firstEditButton = page.locator('text=Edit').first();
  20 |   await firstEditButton.click();
  21 |   await expect(page.locator('text=Edit Comment')).toBeVisible();
  22 |
  23 |
  24 |   await page.fill('textarea[name="editcomment"]', 'So nice2!');
  25 |   await page.waitForTimeout(1000);
  26 |
  27 |
  28 |   await page.click('button[name="save"]');
  29 |
  30 |   await expect(page.locator('text=Review updated successfully.')).toBeVisible();
  31 |
  32 |   await expect(page.locator('text=Reviews')).toBeVisible();
  33 |   await page.waitForTimeout(1000);
  34 | });
  35 |
  36 | test('Empty review text.', async ({ page }) => {
  37 |     await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
  38 |     await page.fill('input[name="email"]', 'SL@gmail.com');
  39 |     await page.fill('input[name="password"]', '12345678');
  40 |     await page.click('button[type="submit"]');
  41 |     await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });
  42 |   
  43 |     await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();
  44 |   
  45 |     const firstItem = page.locator('a[href^="/coworkingspace/"]').first();
  46 |     await firstItem.click();
  47 |   
  48 |     await page.getByRole('button', { name: 'Write a Review' }).click();
  49 |     
  50 |     await expect(page.locator('text=SUBMIT REVIEW')).toBeVisible();
  51 |     await page.waitForTimeout(3000);
  52 |
  53 |     await page.click('button[name="submitcomment"]');
  54 |     await page.waitForTimeout(2000);
  55 |
  56 |     await expect(page.locator('text=Please provide a comment.')).toBeVisible();
  57 |   
  58 | });
  59 |
  60 | test('Click “Edit” but make no changes (No edits and Save).', async ({ page }) => {
  61 |     await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
  62 |     await page.fill('input[name="email"]', 'SL@gmail.com');
  63 |     await page.fill('input[name="password"]', '12345678');
  64 |     await page.click('button[type="submit"]');
  65 |     await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });
  66 |   
  67 |     await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();
  68 |   
  69 |     const firstItem = page.locator('a[href^="/coworkingspace/"]').first();
  70 |     await firstItem.click();
  71 |   
  72 |     await page.getByRole('button', { name: 'Write a Review' }).click();
  73 |     
  74 |     await expect(page.locator('text=Your Comments')).toBeVisible();
  75 |   
  76 |     const fristEditButton = page.locator('text=Edit').first();
  77 |     await fristEditButton.click();
  78 |     await expect(page.locator('text=Edit Comment')).toBeVisible();
  79 |   
  80 |     await page.click('button[name="save"]');
  81 |     await page.waitForTimeout(1000);
  82 |   
  83 |     await expect(page.locator('text=Review updated successfully.')).toBeVisible();
  84 |   
  85 |     await expect(page.locator('text=Reviews')).toBeVisible();
  86 |     await page.waitForTimeout(1000);
  87 |   });
```