import { test, expect } from "@playwright/test";

// Quick functional checks for the interactive bits (votes + hype slider).
test("vote buttons single-select and hype slider updates", async ({ page }) => {
  await page.goto("/");

  // Manta vote group: clicking one button highlights only it.
  const manta = page.locator('.vote[data-group="manta"] button');
  await manta.nth(0).click();
  await expect(manta.nth(0)).toHaveClass(/on/);
  await manta.nth(2).click();
  await expect(manta.nth(2)).toHaveClass(/on/);
  await expect(manta.nth(0)).not.toHaveClass(/on/); // previous deselected

  // Amed vote group exists with 2 options.
  const amed = page.locator('.vote[data-group="amed"] button');
  await expect(amed).toHaveCount(2);

  // Hype slider updates the readout.
  const hype = page.locator("#hype");
  await hype.fill("100");
  await hype.dispatchEvent("input");
  await expect(page.locator("#hypeval")).toContainText("100%");

  // Nav dots: one per section (11).
  await expect(page.locator(".navdots a")).toHaveCount(11);
});
