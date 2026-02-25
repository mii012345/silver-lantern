import { test, expect } from "@playwright/test";

test.describe("ログイン画面", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("ログイン画面が正しく表示される", async ({ page }) => {
    // アプリタイトルが表示される
    await expect(page.locator("h1")).toContainText("Silver Lantern");

    // タグラインが表示される
    await expect(page.locator("text=シンプルな習慣トラッカー")).toBeVisible();
  });

  test("Googleでログインボタンが存在する", async ({ page }) => {
    const loginButton = page.locator("button", {
      hasText: "Googleでログイン",
    });
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  });

  test("ページタイトルが正しい", async ({ page }) => {
    await expect(page).toHaveTitle("Silver Lantern - Habit Tracker");
  });
});
