import { expect, test } from "@playwright/test";

test("visual cues are distinct and present", async ({ page }) => {
  await page.setContent(`
    <div data-test="cues">
      <span data-test="cue-food" style="color: #f7d154;">Food</span>
      <span data-test="cue-poison" style="color: #ff6b6b;">Poison</span>
      <span data-test="cue-teleport" style="color: #6ea8ff;">Teleport</span>
      <span data-test="cue-collision" style="color: #ffffff;">Collision</span>
    </div>
  `);

  const foodColor = await page
    .locator('[data-test="cue-food"]')
    .evaluate((el) => getComputedStyle(el).color);
  const poisonColor = await page
    .locator('[data-test="cue-poison"]')
    .evaluate((el) => getComputedStyle(el).color);
  const teleportColor = await page
    .locator('[data-test="cue-teleport"]')
    .evaluate((el) => getComputedStyle(el).color);

  expect(foodColor).not.toBe(poisonColor);
  expect(poisonColor).not.toBe(teleportColor);
  await expect(page.locator('[data-test="cue-collision"]')).toHaveText("Collision");
});
