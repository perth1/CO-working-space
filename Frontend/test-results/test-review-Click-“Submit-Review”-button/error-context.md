# Test info

- Name: Click “Submit Review” button
- Location: /Users/perth/Documents/CO-working-space/Frontend/test/review.test.ts:3:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('text=Select your Co-Working Space')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('text=Select your Co-Working Space')

    at /Users/perth/Documents/CO-working-space/Frontend/test/review.test.ts:12:67
```

# Page snapshot

```yaml
- alert
- link "logo":
  - /url: /
  - img "logo"
- link "Co-Working Spaces":
  - /url: /coworkingspace
- link "My Reservation":
  - /url: /myreservation
- link "Reservation":
  - /url: /reservation
- link "Sign out":
  - /url: /api/auth/signout
- link:
  - /url: /profile
  - img
- main:
  - text: Select your Co-Working Space
  - link "Coop Image ฿ 300 /hr Latoya Kirlin 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 4-6 people.":
    - /url: /coworkingspace/67c5a3ecc3e4843c9fa2671a
    - img "Coop Image"
    - text: ฿ 300 /hr Latoya Kirlin 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 4-6 people.
  - link "Coop Image ฿ 200 /hr Dr. Virginia Nienow 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 2-4 people.":
    - /url: /coworkingspace/67c5a3f1c3e4843c9fa2671d
    - img "Coop Image"
    - text: ฿ 200 /hr Dr. Virginia Nienow 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 2-4 people.
  - link "Coop Image ฿ 500 /hr Janice Reilly 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 8-12 people.":
    - /url: /coworkingspace/67c5a3f7c3e4843c9fa26720
    - img "Coop Image"
    - text: ฿ 500 /hr Janice Reilly 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 8-12 people.
  - link "Coop Image ฿ 350 /hr Joey Brekke V 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 6-8 people.":
    - /url: /coworkingspace/67c5a405c3e4843c9fa26723
    - img "Coop Image"
    - text: ฿ 350 /hr Joey Brekke V 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 6-8 people.
  - link "Coop Image ฿ 250 /hr Grant Hagenes 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 2-4 people.":
    - /url: /coworkingspace/67c5a407c3e4843c9fa26726
    - img "Coop Image"
    - text: ฿ 250 /hr Grant Hagenes 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 2-4 people.
  - link "Coop Image ฿ 450 /hr Randal Wolf 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 8-10 people.":
    - /url: /coworkingspace/67c67922ad4cb19f0a328962
    - img "Coop Image"
    - text: ฿ 450 /hr Randal Wolf 📍 Demo Coop Space 📞 02-8369999 🕒 05:00 - 19:00 for 8-10 people.
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 | test.setTimeout(50000);
   3 | test('Click “Submit Review” button', async ({ page }) => {
   4 |   await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
   5 |   await page.fill('input[name="email"]', 'SL@gmail.com');
   6 |   await page.fill('input[name="password"]', '12345678');
   7 |   await page.click('button[type="submit"]');
   8 |   await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });
   9 |
  10 |   await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();
  11 |
> 12 |   await expect(page.locator('text=Select your Co-Working Space')).toBeVisible();
     |                                                                   ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  13 |
  14 |   const firstItem = page.locator('a[href^="/coworkingspace/"]').first();
  15 |   await firstItem.click();
  16 |
  17 |
  18 |   await page.getByRole('button', { name:'Write a Review' }).click();
  19 |   
  20 |   await expect(page.locator('text=Your Comments')).toBeVisible();
  21 |
  22 |   await page.fill('textarea[name="comment"]', 'So nice!');
  23 |   await page.waitForTimeout(1000);
  24 |
  25 |
  26 |   await page.click('button[name="submitcomment"]');
  27 |   await page.waitForTimeout(1000);
  28 |
  29 |   await expect(page.locator('text=Review submitted successfully!')).toBeVisible();
  30 |
  31 |   await expect(page.locator('text=Reviews')).toBeVisible();
  32 |   await page.waitForTimeout(1000);
  33 | });
  34 |
  35 | test('“Write a Review”button not displayed.', async ({ page }) => {
  36 |     await page.goto('http://localhost:3000/api/auth/signin',{ timeout: 15000 });
  37 |     await page.fill('input[name="email"]', 'SL@gmail.com');
  38 |     await page.fill('input[name="password"]', '12345678');
  39 |     await page.click('button[type="submit"]');
  40 |     await expect(page).toHaveURL('http://localhost:3000/',{ timeout: 15000 });
  41 |   
  42 |     await page.getByRole('button', { name: 'Browse Our Catalog Now !' }).click();
  43 |
  44 |     await expect(page.locator('text=Select your Co-Working Space')).toBeVisible();
  45 |   
  46 |     const thirdItem = page.locator('a[href^="/coworkingspace/"]').nth(2);
  47 |     await thirdItem.click();
  48 |     await page.waitForTimeout(3000);
  49 |
  50 |     await expect(page.locator('text=You must reserve before rating or reviewing')).toBeVisible();
  51 |     await page.waitForTimeout(500);
  52 |   });
  53 |   
```