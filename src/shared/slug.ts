/**
 * Slug 生成工具 — §15
 *
 * 将中文歌名转换为 URL/filesystem 友好的 slug。
 * 纯函数，不访问外部资源。
 */

/**
 * 将歌名转换为 ASCII slug。
 * 中文 → 拼音简化 → 英文保留原样 → 特殊字符替换为连字符。
 */
export function toSlug(title: string): string {
  // 基本 slug 化：去除非字母数字中文，替换空格和特殊字符
  let slug = title
    .trim()
    .toLowerCase()
    // 中文 → 保留（后续会转为拼音近似或直接用空）
    // 英文/数字 → 保留
    // 空格和特殊字符 → 连字符
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

  // 对中文部分做简单的拼音映射（常见字）
  if (/[\u4e00-\u9fff]/.test(slug)) {
    slug = chineseToSlug(slug);
  }

  return slug || "untitled";
}

/**
 * 简单的常见中文词 → 拼音映射，用于 slug。
 * 注意：这不是完整的拼音库，仅覆盖常见歌曲标题用字。
 */
function chineseToSlug(text: string): string {
  // 简化处理：移除无法映射的中文字符，尽量保留可识别部分
  const pinyinMap: Record<string, string> = {
    "月": "yue",
    "下": "xia",
    "独": "du",
    "酌": "zhuo",
    "春": "chun",
    "花": "hua",
    "秋": "qiu",
    "风": "feng",
    "雪": "xue",
    "夜": "ye",
    "梦": "meng",
    "爱": "ai",
    "心": "xin",
    "天": "tian",
    "地": "di",
    "山": "shan",
    "水": "shui",
    "火": "huo",
    "星": "xing",
    "光": "guang",
    "云": "yun",
    "雨": "yu",
    "歌": "ge",
    "曲": "qu",
    "声": "sheng",
    "音": "yin",
    "乐": "yue",
    "舞": "wu",
    "飞": "fei",
    "流": "liu",
    "行": "xing",
    "走": "zou",
    "来": "lai",
    "去": "qu",
    "人": "ren",
    "我": "wo",
    "你": "ni",
    "他": "ta",
    "她": "ta",
    "的": "de",
    "了": "le",
    "是": "shi",
    "不": "bu",
    "在": "zai",
    "有": "you",
    "大": "da",
    "小": "xiao",
    "中": "zhong",
    "上": "shang",
    "前": "qian",
    "后": "hou",
    "左": "zuo",
    "右": "you",
    "明": "ming",
    "白": "bai",
    "红": "hong",
    "蓝": "lan",
    "绿": "lv",
    "金": "jin",
    "银": "yin",
    "龙": "long",
    "凤": "feng",
    "虎": "hu",
    "狼": "lang",
    "海": "hai",
    "湖": "hu",
    "河": "he",
    "江": "jiang",
    "林": "lin",
    "森": "sen",
    "石": "shi",
    "玉": "yu",
    "冰": "bing",
    "阳": "yang",
    "阴": "yin",
    "日": "ri",
    "影": "ying",
    "回": "hui",
    "忆": "yi",
    "思": "si",
    "念": "nian",
    "想": "xiang",
    "忘": "wang",
    "记": "ji",
    "说": "shuo",
    "话": "hua",
    "笑": "xiao",
    "哭": "ku",
    "醉": "zui",
    "醒": "xing",
    "安": "an",
    "静": "jing",
    "等": "deng",
    "候": "hou",
    "寻": "xun",
    "找": "zhao",
    "见": "jian",
  };

  let result = "";
  for (const char of text) {
    const mapped = pinyinMap[char];
    if (mapped) {
      if (result && !result.endsWith("-")) {
        result += "-";
      }
      result += mapped;
    } else if (/[a-z0-9-]/.test(char)) {
      result += char;
    }
    // 跳过无法映射的中文字符和其他字符
  }

  return result.replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "untitled";
}

/**
 * 生成时间戳 slug 前缀：YYYYMMDD-HHMMSS
 */
export function timestampPrefix(): string {
  const now = new Date();
  const y = now.getFullYear().toString();
  const mo = (now.getMonth() + 1).toString().padStart(2, "0");
  const d = now.getDate().toString().padStart(2, "0");
  const h = now.getHours().toString().padStart(2, "0");
  const mi = now.getMinutes().toString().padStart(2, "0");
  const s = now.getSeconds().toString().padStart(2, "0");
  return `${y}${mo}${d}-${h}${mi}${s}`;
}
