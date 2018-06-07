# lgg-flexible
看来了一些关于移动端布局的资料，目前最佳的移动端移动端适配方案（flex + rem + dpr）, 自己也根据原理写了 lgg-flexible， 主要动态控制 rem 和 dpr 来适配不同移动端。增加一些特性可去调控 rem 适配带来 PC 一些问题。

## table

- [lgg-flexible](#lgg-flexible)
    - [table](#table)
    - [featrue](#featrue)
    - [Usage](#usage)
        - [Install](#install)
        - [Import](#import)
        - [use](#use)
    - [Demo](#demo)
    - [移动适配方案(flex + rem + dpr)](#flex-rem-dpr)
        - [前言](#)
        - [设备独立像素(px)](#px)
        - [位图像素](#)
        - [对于2倍大小的视觉稿,如何还原到真实屏幕](#2)
        - [字体](#)

## featrue
- rem
- dpr 高清适配
- 通过 body[data-dpr=*] css选择器控制字体大小
- PC 端会默认关闭高清适配，传入 pcREM 作为pc rem值
- 通过 body[data-mobile="false"] 调控 pc 与 mobile 样式

## Usage

### Install

```
npm i -S lgg-flexible
```

### Import

```
<script src="./node_modules/lgg-flexible/flexible.min.js"></script>
<script>
    new flexible.default();
</script>
```

### use
```
//commonjs
const flexible = require("./flexible.js").default;
// 不传参
new flexible();


// esmodule
import flexible from "../lib/flexible";
/*
* params: 默认 {isHD: true, pcREM: undefined}
* isHD 是否开启高清适配，但pc端会关闭
* pcREM 当设备为pc时，可传入固定 rem 值
*/ 
new flexible({isHD: true, pcREM: 46});
```

## Demo

```
git clone https://github.com/laoergege/lgg-flexible.git

npm intall

npm run dev // 访问 http://localhost:8080/
```

## 移动适配方案(flex + rem + dpr)

推荐阅读： 

- [移动端高清、多屏适配方案](https://div.io/topic/1092)
- [轻松掌握移动端web开发【尺寸适配】常用解决方案](https://juejin.im/post/5ad0b52d6fb9a028d82c30c1)
- [使用Flexible实现手淘H5页面的终端适配 ](https://github.com/amfe/article/issues/17)

### 前言
对移动端布局适配的认识：先针对某一移动设备进行移动端的布局，然后只要对其他不同屏幕尺寸设备进行等比缩放适应就行。百分比、媒体查询、flexbox、rem 都能做到布局上的缩放，尤其是 rem，具体 rem 是如何适配可观看上面推荐的文章。dpr 部分是让我觉得困惑的？

在前端开发之前，视觉MM会给我们一个psd文件，称之为视觉稿。

对于移动端开发而言，为了做到页面高清的效果，视觉稿的规范往往会遵循以下两点：

首先，对于一般场景，选取一款手机的屏幕宽高作为基准(以前是iphone4的320×480，现在更多的是iphone6的375×667)。保持布局视口和视觉视口同样宽度，使用 rem 作为单位，配合 flex 等相关技术来完成布局。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

但对于retina屏幕(如: dpr=2)，为了达到高清效果，视觉稿的画布大小会是基准的2倍，也就是说像素点个数是原来的4倍（对iphone6而言：原先的375×667，就会变成750×1334）。

**对于dpr=2的手机，为什么画布大小×2，就可以解决高清问题？**

### 设备独立像素(px)
设备独立像素，也就是无任何设备无关、逻辑上的像素，可以认为是计算机坐标系统中得一个点，这个点代表一个可以由程序使用的虚拟像素(比如: css像素)，然后由相关系统转换为物理像素。

**在不同的屏幕上(普通屏幕 vs retina屏幕)，css像素所呈现的大小(物理尺寸)是一致的，不同的是1个css像素所对应的物理像素个数是不一致的**。

![](https://img.alicdn.com/tps/TB1uWfJIpXXXXaoXXXXXXXXXXXX.gif)

所以说，*物理像素*和*设备独立像素*之间存在着一定的对应关系，也就是*设备像素比（dpr）*。在 javascript 中，可以通过 window.devicePixelRatio 获取到当前设备的 dpr 。

```
设备像素比 = 物理像素 / 设备独立像素 // 在某一方向上，x方向或者y方向
```
例如通过得知设备像素比，比如为 devicePixelRatio = 2，我们可以知道该设备 1px == 4 个物理像素点。

那为什么在拿到视觉稿，对于retina屏幕(如: dpr=2)，为了达到高清效果，视觉稿的画布大小会是基准的2倍，也就是说像素点个数是原来的4倍（对iphone6而言：原先的375×667，就会变成750×1334），这样说，**也就是以 1px == 1 个物理像素为基准开发** 呢？。

### 位图像素

一个位图像素是栅格图像(如：png, jpg, gif等)最小的数据单元。每一个位图像素都包含着一些自身的显示信息(如：显示位置，颜色值，透明度等)。

谈到这里，就得说一下，retina下图片的展示情况？

理论上，**1个位图像素对应于1个物理像素，图片才能得到完美清晰的展示**。

在普通屏幕下是没有问题的，但是在retina屏幕下就会出现位图像素点不够，从而导致图片模糊的情况。

用一张图来表示：

![](https://img.alicdn.com/tps/TB12ALnIpXXXXb1XVXXXXXXXXXX.jpg)

如上图：对于dpr=2的retina屏幕而言，1个位图像素对应于4个物理像素，由于单个位图像素不可以再进一步分割，所以只能就近取色，从而导致图片模糊(注意上述的几个颜色值)。

所以，对于图片高清问题，比较好的方案就是两倍图片(@2x)。

如：200×300(css pixel)img标签，就需要提供400×600的图片。

如此一来，位图像素点个数就是原来的4倍，在retina屏幕下，位图像素点个数就可以跟物理像素点个数形成 1 : 1的比例，图片自然就清晰了(这也解释了之前留下的一个问题，为啥视觉稿的画布大小要×2？)。

### 对于2倍大小的视觉稿,如何还原到真实屏幕

在设计开发上，对iphone6而言，视觉视口大小为 375×667 px，dpr 为 2，为了达到高清效果，我们会以 750x1334 px为基准。这样效果即是：

![微信截图_20180531154147](https://i.loli.net/2018/05/31/5b0fa77dbcaae.png)

我们只要把页面缩小 2 倍就刚好容进了手机屏幕，通过 meta 标签的 viwport 属性来控制缩放布局视图大小。

对于iphone5(dpr=2)，添加如下的meta标签，设置viewport(scale 0.5)：

```
<meta name="viewport" content="width=640,initial-scale=0.5,maximum-scale=0.5, minimum-scale=0.5,user-scalable=no">
```

如何做到对不同尺寸移动设备做到动态缩放设置？

- 媒体查询（需要对不同设备做媒体查询，无法做到精准设置）
- javascript 

```javascript
 /**
     * 设置页面缩放
     */
    function scaled() {
        let meta = document.querySelector("meta[name=viewport]") || document.createElement('meta');
        //设置viewport，进行缩放，达到高清效果
        meta.setAttribute('content', 'initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

        if (!document.querySelector("meta[name=viewport]")) {
            meta.setAttribute('name', 'viewport');
            docEl.firstElementChild.appendChild(meta);
        }
    }
```

页面 scale 方案可以解决：
- 高清适配问题
- retina下，border: 1px问题（其实就是设计师想要的retina下border: 1px 为 1物理像素宽，对于css而言，可以认为是border: 0.5px;，这是retina下(dpr=2)下能显示的最小单位。但并不是所有设备都能够识别 0.5px,有的会把 0.5px 会被当成为 0px 处理。）

### 字体
页面 scale 方案会导致字体大小也发生 scale，文本又将如何处理适配。是不是也通过rem来做自动适配。

显然，我们在iPhone3G和iPhone4的Retina屏下面，希望看到的文本字号是相同的。也就是说，我们不希望文本在Retina屏幕下变小，另外，我们希望在大屏手机上看到更多文本，以及，现在绝大多数的字体文件都自带一些点阵尺寸，通常是16px和24px，所以我们不希望出现13px和15px这样的奇葩尺寸。

通过在 body 标签设置字体大小，让其子元素继承其字体大小。
```javascript
document.body.style.fontSize = '16px';
```

也可以针对不同 dpr，设置倍数，或者通过 `[data-dpr]`, 通过让 css 控制不同 dpr 大小
```javascript
    /**
     * 控制字体大小
     * @param {*} basis 基础值 
     */
    function setfontSize(basis) {
        document.body.style.fontSize = basis * dpr + 'px';

        // 为 body 添加 [data-dpr], 通过让 css 控制不同 dpr 大小
        let data_dpr = document.createAttribute('data-dpr');
        data_dpr.value = parseInt(dpr);
        document.body.setAttributeNode(data_dpr);
    }

```