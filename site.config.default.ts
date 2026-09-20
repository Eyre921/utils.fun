import type { SiteSettings } from "./site.config.shared";

const ICP_HTML = `<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">蜀ICP备2024097797号-8</a>`;

export const siteSettings = {
  title: "个人工具小助手",
  titleSeparator: " - ",
  description: "一个简洁好用的在线工具站，覆盖开发、文本、时间、图片、编码和常用生成类场景。",
  url: "https://tianshu.cloud/edgeone-makers-tools",
  logo: {
    // Intrinsic file is 72×72 (2× retina for 36 CSS px header slot)
    src: "/logo.png",
    alt: "个人工具小助手 标志",
    width: 72,
    height: 72,
  },
  footerHtml: `<p>&copy; ${new Date().getFullYear()} 个人工具小助手. All rights reserved. · ${ICP_HTML}</p>`,
  githubUrl: "https://github.com/Eyre921/utils.fun",
  i18n: {
    cn: {
      title: "个人工具小助手",
      description: "一个简洁好用的在线工具站，覆盖开发、文本、时间、图片、编码和常用生成类场景。",
      footerHtml: `<p>&copy; ${new Date().getFullYear()} 个人工具小助手。保留所有权利。 · ${ICP_HTML}</p>`,
      logoAlt: "个人工具小助手 标志",
    },
    tw: {
      title: "個人工具小助手",
      description: "一個簡潔好用的線上工具站，涵蓋開發、文字、時間、圖片、編碼與常用生成場景。",
      footerHtml: `<p>&copy; ${new Date().getFullYear()} 個人工具小助手。保留所有權利。 · ${ICP_HTML}</p>`,
      logoAlt: "個人工具小助手 標誌",
    },
    ja: {
      title: "個人工具小助手",
      description: "開発、テキスト、時間、画像、エンコード、日常的な生成作業をカバーする、シンプルで使いやすいオンラインツール集です。",
      footerHtml: `<p>&copy; ${new Date().getFullYear()} 個人工具小助手. All rights reserved. · ${ICP_HTML}</p>`,
      logoAlt: "個人工具小助手 logo",
    },
  },
} satisfies SiteSettings;
