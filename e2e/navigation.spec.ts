import { test, expect } from "@playwright/test";

test.describe("ナビゲーション・画面構造", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("ログイン画面にmainコンテナが存在する", async ({ page }) => {
    // main要素が存在する
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // h1タイトルがmain内に存在する
    await expect(main.locator("h1")).toContainText("Silver Lantern");

    // ボタンがmain内に存在する
    await expect(main.locator("button")).toBeVisible();
  });

  test("htmlのlang属性がjaに設定されている", async ({ page }) => {
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("ja");
  });

  test("meta descriptionが設定されている", async ({ page }) => {
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description).toBe(
      "Simple habit tracker to build better daily routines"
    );
  });
});
