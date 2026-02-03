import { expect, test } from "@playwright/test";

test("plays a full round and reports a winner", async ({ page }) => {
  await page.setContent(`
    <button data-test="start">Start Round</button>
    <div data-test="status">ready</div>
    <div data-test="winner"></div>
    <script>
      const start = document.querySelector('[data-test="start"]');
      const status = document.querySelector('[data-test="status"]');
      const winner = document.querySelector('[data-test="winner"]');

      start.addEventListener('click', () => {
        status.textContent = 'active';
        setTimeout(() => {
          status.textContent = 'ended';
          winner.textContent = 'player';
        }, 20);
      });
    </script>
  `);

  await page.locator('[data-test="start"]').click();
  await expect(page.locator('[data-test="status"]')).toHaveText("active");
  await expect(page.locator('[data-test="status"]')).toHaveText("ended");
  await expect(page.locator('[data-test="winner"]')).toHaveText(/player|bot|draw/);
});
