# 一点甜 · 生日蛋糕工坊

给朋友亲手做一只会旋转、会亮起烛光的生日蛋糕。

**作者：[Sherry小水](https://github.com/XshuiAi)** · [原始仓库](https://github.com/XshuiAi/shui-birthday-cake) · [在线试玩](https://xshuiai.github.io/shui-birthday-cake/)

![生日烛光](三层成品夜景.jpg)

## 直接玩

打开在线试玩，或下载仓库里的 **[手作生日蛋糕.html](手作生日蛋糕.html)**，用电脑浏览器打开。独立文件约 7.8 MB，已包含代码、图片和音乐。电脑横屏体验最佳。

- 打开即展示三层裱花示例；可制作 1–5 层庆典蛋糕，逐层选择 6 种蛋糕胚、6 种夹心和 6 种奶油颜色。支持手动涂抹、不同花嘴裱花、撒碎料和手作音效。
- 自选水果、蜡烛、字母和贴纸。物件可拖动、缩放、旋转、复制、删除，支持撤销和重做。
- 上传照片、选择撕纸／复古爱心／三连照片卡或自己的相框；展示时可继续添加和移动照片，照片不跟随蛋糕旋转。布置横幅，点击信封写祝福。
- 编辑时保持静止，拖空白处调整视角，托盘不翻转；预览时自动旋转并播放生日歌曲。
- 关灯后显示暖烛光，蜡烛越多越亮；可吹灭或重新点亮。

「成品展示」与「重新制作」分别保存示例和草稿；「保存展示示例」保存到本机，「下载工坊」把当前成品和所有材料打包到完整 HTML。首次打开成品时点击「生日歌」播放。

点击「预览生日」→「保存这份生日礼物」，下载包含照片、信件和音乐的独立 HTML，发给朋友后用浏览器打开。页面没有上传照片的后端；草稿保存在当前浏览器，也可以用「备份作品」导出 JSON。分享礼物文件会包含你添加的照片和祝福。不同设备不会自动同步草稿。

## 让 AI 做同款

把 **[复刻提示词](PROMPT.md)** 发给豆包工作、WorkBuddy、Codex 或其他具备读取文件与运行网页能力的 AI 工具。无需重新生成素材，先运行本仓库，再修改名字、祝福或配色。

## 运行与修改

需要 Node.js 20 或更新版本及 npm。

```sh
git clone https://github.com/XshuiAi/shui-birthday-cake.git
cd shui-birthday-cake
npm ci
npm run build
npm start
```

浏览器打开 `http://127.0.0.1:5188/`。

```sh
npm test
npm run build
npm run release
```

`npm run release` 生成固定名称的「手作生日蛋糕.html」与兼容名称「一点甜-成品工坊.html」。仅覆盖可识别的本项目生成文件，替换前保留上一版备份；不接受自定义路径或清理参数。

| 文件 | 用途 |
| --- | --- |
| app.js | 材料选择、照片、信件、保存和导出 |
| scene.js | 3D 蛋糕、裱花、物件与烛光 |
| model.mjs | 配方状态、数据校验、撤销与重做 |
| demo.mjs / cards.mjs | 三层成品示例与照片卡模板 |
| audio.mjs | 生日音乐与手作音效 |
| assets/c-style/ | 插画素材 |
| assets/audio/ | 本地生日录音 |
| scripts/build-release.mjs | 独立 HTML 打包 |

纯静态站点，可将本仓库 main 分支根目录发布到 GitHub Pages；修改源码后先构建并提交 dist/app.js。

## 署名与来源

项目代码由 Sherry小水发起并与 AI 协作制作；插画由用户提供的 AI 生图素材整理而成。Three.js、Helvetiker 字体及两首生日录音的来源、署名与许可见 [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt)。第三方资源保留各自许可。

原始代码与项目自有素材采用 [PolyForm Noncommercial 1.0.0](LICENSE)：允许非商业使用、修改与分享，须保留署名和许可；商业使用需另行授权。第三方资源不改用这一许可。
