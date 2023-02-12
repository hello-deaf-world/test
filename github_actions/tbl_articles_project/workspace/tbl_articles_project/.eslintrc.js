module.exports = {
  env: {
    browser: false,
    es2021: true,
    // 以下ユーザ定義
    node: true,
  },
  extends: [
    "standard-with-typescript",
    // 以下ユーザ定義
    "eslint:recommended",
    "prettier", // eslint-config-prettierのこと // prettierと競合したらprettier(.prettierrc.js？)を優先
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    // 以下ユーザ定義
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  rules: {
    // 以下ユーザ定義
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-empty-character-class": "error",
    "no-eval": ["error"],
    "no-trailing-spaces": ["error"],
    "no-unsafe-finally": "error",
    "no-whitespace-before-property": "error",
    "quote-props": "off",
    "comma-dangle": [
      "error",
      {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "functions": "never", // これでJSXによる戻り値の複数行を対象外にする
      },
    ],
    "spaced-comment": [
      "error",
      "always",
    ],
    "brace-style": ["warn", "1tbs"],
    indent: [
      "warn",
      2,
      {
        SwitchCase: 1,
      },
    ],
    quotes: [
      "error",
      "double",
      {
        avoidEscape: true,
      },
    ],
    semi: ["error", "always"],
    "@typescript-eslint/no-inferrable-types": "warn", // 自明な型アノテーションの除去については警告に留める
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"], // 厳密に検討してないが…
    "object-shorthand": ["warn", "never"], // 連想配列のキーの省略はしないようにしよう
    "@typescript-eslint/type-annotation-spacing": [ // 型の前にスペース入れよう
      "error",
      {
        "before": false,
        "after": true,
        "overrides": {
          arrow: { // アロー関数のアローの前後はスペース入れよう
            before: true,
            after: true,
          },
        },
      },
    ],
    "space-infix-ops": ["error"], // 演算子の前後にスペースを入れよう
  },
  ignorePatterns: [
    // VSCodeによるアプリに関係ないコード(設定用など)の静的解析を無視させるために必要
    // `.eslintignore`と同等のようだが，ファイル数減らすため一旦こちらで設定
    "*.config.ts",
    "*.config.js",
    "*.cjs",
    "**/build/",
    "**/public/",
    "**/node_modules/",
    "**/*.escapeCheck/", // lintしたくないコードを置く場所
    "**/done_*", // 実施し終わったテストコードも一旦無視
  ],
};
