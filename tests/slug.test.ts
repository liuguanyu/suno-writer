import { describe, it, expect } from "vitest";
import { toSlug, timestampPrefix } from "../src/shared/slug.js";

describe("toSlug", () => {
  it("英文标题应原样转换为 slug", () => {
    expect(toSlug("My Song Title")).toBe("my-song-title");
  });

  it("中文标题应转换为拼音 slug", () => {
    const slug = toSlug("月下独酌");
    expect(slug).toBe("yue-xia-du-zhuo");
  });

  it("空字符串应返回 untitled", () => {
    expect(toSlug("")).toBe("untitled");
  });

  it("特殊字符应替换为连字符", () => {
    expect(toSlug("Hello!!! World???")).toBe("hello-world");
  });

  it("混合中英文", () => {
    const slug = toSlug("Hello 月下");
    expect(slug).toContain("hello");
    expect(slug).toContain("yue");
    expect(slug).toContain("xia");
  });
});

describe("timestampPrefix", () => {
  it("应返回 YYYYMMDD-HHMMSS 格式", () => {
    const ts = timestampPrefix();
    expect(ts).toMatch(/^\d{8}-\d{6}$/);
  });
});
