import { test, expect } from "@playwright/test";

test.describe("認証ガード", () => {
  test("未認証で /dashboard にアクセスすると / にリダイレクトされる", async ({
    page,
  }) => {
    await page.goto("/dashboard", { waitUntil: "networkidle" });

    // AuthGuardが未認証を検知して / にリダイレクトする
    await page.waitForURL("/", { timeout: 15000 });

    // ログイン画面が表示されていることを確認
    await expect(page.locator("h1")).toContainText("Silver Lantern");
  });

  test("未認証で /habits にアクセスすると / にリダイレクトされる", async ({
    page,
  }) => {
    await page.goto("/habits", { waitUntil: "networkidle" });

    // AuthGuardが未認証を検知して / にリダイレクトする
    await page.waitForURL("/", { timeout: 15000 });

    // ログイン画面が表示されていることを確認
    await expect(page.locator("h1")).toContainText("Silver Lantern");
  });
});
