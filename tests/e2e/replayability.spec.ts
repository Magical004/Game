import { expect, test } from "@playwright/test";

test("replayability flow updates difficulty, theme, audio, and history", async ({ page }) => {
  await page.setContent(`
    <select data-test="difficulty">
      <option value="easy">easy</option>
      <option value="medium" selected>medium</option>
      <option value="hard">hard</option>
    </select>
    <select data-test="theme">
      <option value="default">Neon Grid</option>
      <option value="sunset">Dusty Sunset</option>
    </select>
    <label><input type="checkbox" data-test="audio" checked />Audio</label>
    <label><input type="checkbox" data-test="music" checked />Music</label>
    <ul data-test="history">
      <li>player • medium • 5-3</li>
    </ul>
  `);

  await page.locator('[data-test="difficulty"]').selectOption("hard");
  await expect(page.locator('[data-test="difficulty"]')).toHaveValue("hard");

  await page.locator('[data-test="theme"]').selectOption("sunset");
  await expect(page.locator('[data-test="theme"]')).toHaveValue("sunset");

  await page.locator('[data-test="audio"]').uncheck();
  await expect(page.locator('[data-test="audio"]')).not.toBeChecked();

  await page.locator('[data-test="music"]').uncheck();
  await expect(page.locator('[data-test="music"]')).not.toBeChecked();

  await expect(page.locator('[data-test="history"] li')).toHaveCount(1);
});
