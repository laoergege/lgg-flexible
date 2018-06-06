
const docEl = document.documentElement;

/**
 * 设置页面缩放
 */
function scaled(scale) {
    let meta = document.querySelector("meta[name=viewport]") || document.createElement('meta');
    //设置viewport，进行缩放，达到高清效果
    meta.setAttribute('content', 'initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

    if (!document.querySelector("meta[name=viewport]")) {
        meta.setAttribute('name', 'viewport');
        docEl.firstElementChild.appendChild(meta);
    }
}

/**
 * body 标签添加 data-dpr = dpr 属性
 */
function setfontSizeProp(dpr) {
    let data_dpr = document.createAttribute('data-dpr');
    data_dpr.value = parseInt(dpr);
    document.body.setAttributeNode(data_dpr);

    let data_mobile = document.createAttribute('data-mobile');
    data_mobile.value = mobileDetect();
    document.body.setAttributeNode(data_mobile);
}


/**
 * 设置 rem 大小
 */
function setUnitRem(rem) {
    if (rem) {
        docEl.style.fontSize = rem + 'px';
    } else {
        docEl.style.fontSize = window.innerWidth / 10 + 'px';
    }
}

/**
 * 检查设备是否为 PC 端
 */
function mobileDetect() {
    let _userAgent = window.navigator.userAgent;

    return /mobile/.test(_userAgent.toLocaleLowerCase());
}

export default class flexible {

    constructor(params) {
        let { isHD, pcREM } = Object.assign({ isHD: true, pcREM: undefined }, params);

        this._isHD = isHD; //默认高清适配
        this._pcREM = pcREM;

        this.init.call(this);
    }

    change() {
        let dpr = window.devicePixelRatio;
        setfontSizeProp(dpr);

        // 移动端设备且开启高清适配
        if (mobileDetect() && this._isHD) {
            let scale = 1 / dpr;
            scaled(scale);
        }

        // 当设备为pc时，设置固定 rem 
        if (!mobileDetect() && this._pcREM) {
            setUnitRem(this._pcREM);
        } else {
            setUnitRem();
        }

    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {

            // 初始化设置
            this.change();

            // 防止执行多次回调
            window.onresize = () => {
                this.change();
            };
        })
    }
}