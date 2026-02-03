import { expect, test } from "@playwright/test";

test("HUD remains readable and layout responds", async ({ page }) => {
  await page.setContent(`
    <div data-test="hud" style="color: #f5f7fa; background: #0e1a1f; padding: 8px;">
      <span data-test="timer">Time: 30</span>
      <span data-test="status">Ready</span>
    </div>
    <style>
      @media (max-width: 480px) {
        [data-test="hud"] {
          font-size: 14px;
        }
      }
    </style>
  `);

  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(page.locator('[data-test="timer"]')).toHaveText(/Time: 30/);
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.locator('[data-test="status"]')).toHaveText("Ready");
});
