import { test, expect } from '@playwright/test';

test('should have orders', async ({ page }) => {
    await page.goto('/');

    const orders = page.getByRole('region', { name: 'orders' });
    await expect(orders.getByRole('heading', { level: 2 })).toHaveText('Orders');

    const order1 = page.getByRole('region', { name: 'order-1' });
    await expect(order1.getByRole('heading')).toHaveText('Order ID: 1');
    await expect(order1).toContainText('Shipdate:')
    await expect(order1).toContainText('placed');
});
