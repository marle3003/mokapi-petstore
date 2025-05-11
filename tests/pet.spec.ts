import { test, expect } from '@playwright/test';

test('should has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Petstore App/);
});

test('should have three pets', async ({ page }) => {
    await page.goto('/');

    const pets = page.getByRole('region', { name: 'pets' });
    await expect(pets.getByRole('heading', { level: 2 })).toHaveText('Pets');

    await expect(pets.getByRole('region')).toHaveCount(3);

    const pet1 = page.getByRole('region', { name: 'pet-1' });
    await expect(pet1.getByRole('heading')).toHaveText('Pet ID: 1');
    await expect(pet1).toContainText('Yoda');
    await expect(pet1).toContainText('dog')
});
