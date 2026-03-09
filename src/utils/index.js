import jb from "echco-effuse";
import omitBy from "lodash/omitBy";
import isNil from "lodash/isNil";
import { CLIENT_PACKAGE_ID } from "../constants";
const ENV_MAP = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
};

/**
 * 延时函数
 */
export const sleep = (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

/**
 * 生成UUID
 */
export function uuid(len, radix) {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
  const result = [];
  let i;
  radix = radix || chars.length;

  if (len) {
    for (i = 0; i < len; i++) {
      result[i] = chars[0 | (Math.random() * radix)];
    }
  } else {
    let r;
    result[8] = result[13] = result[18] = result[23] = "-";
    result[14] = "4";

    for (i = 0; i < 36; i++) {
      if (!result[i]) {
        r = 0 | (Math.random() * 16);
        result[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return result.join("");
}

/**
 * 过滤对象中的 null/undefined 值
 */
export const filterBy = (obj) => omitBy(obj, isNil);

/**
 * 判断是否QQ小程序环境
 */
export const isQQMp = () => {
  return (
    typeof window !== "undefined" && window.__qqjs_environment === "miniprogram"
  );
};

/**
 * 判断是否微信小程序环境
 */
export const isWxMp = () => {
  return (
    typeof window !== "undefined" && window.__wxjs_environment === "miniprogram"
  );
};

/**
 * 判断是否微信浏览器
 */
export const isWxBrowserFn = () => {
  return (
    typeof window !== "undefined" &&
    /MicroMessenger/i.test(window.navigator.userAgent)
  );
};

/**
 * 判断是否小程序环境
 */
export const isMp = () => {
  return isWxMp() || isQQMp();
};

/**
 * 判断是否 App 环境
 */
export const isApp = () => {
  return jb.isApp();
};

/**
 * 判断是否H5环境
 */
export const isH5 = () => {
  return !isApp() && !isWxMp();
};

/**
 * 获取当前环境
 */
export function getEnv() {
  if (typeof location !== "undefined") {
    if (location.hash?.includes("_env=prod")) return ENV_MAP.PRODUCTION;
    if (location.hash?.includes("_env=dev")) return ENV_MAP.DEVELOPMENT;
  }
  if (process.env.NODE_ENV === ENV_MAP.DEVELOPMENT) return ENV_MAP.DEVELOPMENT;
  if (process.env.NODE_ENV === ENV_MAP.PRODUCTION) return ENV_MAP.PRODUCTION;
  return ENV_MAP.DEVELOPMENT;
}

export const isProd = getEnv() === ENV_MAP.PRODUCTION;
export const parseParams = (t) => {
  if (document.location.search.length > 1) {
    const params = new URLSearchParams(document.location.search);
    return params.get(t);
  } else if (document.location.hash.length > 1) {
    const query = document.location.hash.split("?")[1];
    if (query && query.length > 0) {
      const params = new URLSearchParams(query);
      return params.get(t);
    }
  }
  return null;
};
export function getPackageId() {
  const params = new URLSearchParams();

  if (params.get("pkg")) {
    return params.get("pkg");
  }

  if (params.get("packageId")) {
    return params.get("packageId");
  }

  return CLIENT_PACKAGE_ID;
}
