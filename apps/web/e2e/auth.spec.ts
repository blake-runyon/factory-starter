import { expect, test, type Page } from "@playwright/test";

// The e2e database is not reset between tests, so every test signs up a fresh email.
const uniqueEmail = () => `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
const password = "correct-horse-battery";

async function signUp(page: Page, email: string) {
  await page.goto("/signup");
  await page.getByLabel("Name").fill("Ada Lovelace");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page).toHaveURL("/");
}

const accountNav = (page: Page) => page.getByRole("navigation", { name: "Account" });

test("auth: sign up signs the user in and shows them on the home page", async ({ page }) => {
  const email = uniqueEmail();
  await signUp(page, email);
  await expect(accountNav(page).getByRole("link", { name: email })).toBeVisible();
});

test("auth: sign out, then sign in again with email and password", async ({ page }) => {
  const email = uniqueEmail();
  await signUp(page, email);

  await accountNav(page).getByRole("button", { name: "Sign out" }).click();
  await expect(accountNav(page).getByRole("link", { name: "Sign in" })).toBeVisible();

  await accountNav(page).getByRole("link", { name: "Sign in" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL("/");
  await expect(accountNav(page).getByRole("link", { name: email })).toBeVisible();
});

test("auth: sign in with a wrong password shows an error", async ({ page }) => {
  const email = uniqueEmail();
  await signUp(page, email);
  await accountNav(page).getByRole("button", { name: "Sign out" }).click();
  await expect(accountNav(page).getByRole("link", { name: "Sign in" })).toBeVisible();

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page).toHaveURL("/login");
});

test("auth: /account redirects to sign in, then returns there after signing in", async ({
  page,
}) => {
  const email = uniqueEmail();
  await signUp(page, email);
  await accountNav(page).getByRole("button", { name: "Sign out" }).click();
  await expect(accountNav(page).getByRole("link", { name: "Sign in" })).toBeVisible();

  await page.goto("/account");
  await expect(page).toHaveURL("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL("/account");
  await expect(page.getByRole("heading", { level: 1, name: "Account" })).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();
});
