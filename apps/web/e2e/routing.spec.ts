import { expect, test } from "@playwright/test";

test("router: unknown path renders the not-found page with a link home", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  await page.getByRole("link", { name: "Go home" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByTestId("api-status")).toHaveText("ok");
});
