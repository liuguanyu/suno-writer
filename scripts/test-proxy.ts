import { chromium } from "playwright";

async function main() {
  const ctx = await chromium.launchPersistentContext(
    "/tmp/suno-writer-chrome-profile",
    {
      headless: true,
      channel: "chrome",
      proxy: { server: "socks5://127.0.0.1:1086" },
    },
  );
  const page = await ctx.newPage();
  try {
    const resp = await page.goto("https://suno.com/create", {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    console.log("status:", resp?.status());
    console.log("url:", page.url());
    const title = await page.title();
    console.log("title:", title);

    // 等待页面完全加载
    await page.waitForTimeout(5000);

    const hasLogin = await page
      .getByText("Log in", { exact: true })
      .isVisible()
      .catch(() => false);
    console.log("hasLogin:", hasLogin);

    const lyricsEditor = page.getByRole("textbox", { name: /lyrics/i });
    const hasLyrics = await lyricsEditor.isVisible().catch(() => false);
    console.log("hasLyricsEditor:", hasLyrics);

    // 打印所有 textbox
    const textboxes = await page.getByRole("textbox").all();
    for (let i = 0; i < textboxes.length; i++) {
      const name = await textboxes[i].getAttribute("aria-label");
      const placeholder = await textboxes[i].getAttribute("placeholder");
      const visible = await textboxes[i].isVisible().catch(() => false);
      console.log(`  textbox[${i}]: label="${name}" placeholder="${placeholder}" visible=${visible}`);
    }
  } catch (e) {
    console.error("ERROR:", e instanceof Error ? e.message : e);
  } finally {
    await ctx.close();
  }
}

main();
