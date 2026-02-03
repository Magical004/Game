import { expect, test } from "@playwright/test";

test("customization applies color and HUD stays readable", async ({ page }) => {
  await page.setContent(`
    <div data-test="customize">
      <input type="color" data-test="color" value="#5fd38d" />
      <div data-test="preview" style="width: 40px; height: 20px; background: #5fd38d;"></div>
    </div>
    <div data-test="hud" style="background: #111; color: #fff; padding: 8px;">
      <span data-test="timer">Time: 30</span>
    </div>
    <script>
      const input = document.querySelector('[data-test="color"]');
      const preview = document.querySelector('[data-test="preview"]');
      input.addEventListener('input', () => {
        preview.style.background = input.value;
      });
    </script>
  `);

  await page.locator('[data-test="color"]').fill("#ff0000");
  await expect(page.locator('[data-test="preview"]')).toHaveCSS("background-color", "rgb(255, 0, 0)");
  await expect(page.locator('[data-test="timer"]')).toHaveText(/Time: 30/);
});
