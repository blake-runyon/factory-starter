import { expect, test } from "@playwright/test";

test("starter: home page shows API and database are healthy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByTestId("api-status")).toHaveText("ok");
  await expect(page.getByTestId("db-status")).toHaveText("ok");
});
