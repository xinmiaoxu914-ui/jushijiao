import { getPackageId, parseParams } from "../utils/index";
import { CLIENT_PACKAGE_ID } from "../constants";
import effuse from "echco-effuse";

import { generateFly } from "../utils/fly";

export const createFly = ({ baseURL, header = {} }) => {
  const fly = generateFly();

  fly.config.baseURL = baseURL;
  fly.config.showError = true;

  fly.interceptors.request.use(async (request) => {
    request.headers["X-Client-Package-Id"] = CLIENT_PACKAGE_ID.toString();
    request.headers["X-Request-Package-Id"] = getPackageId()?.toString() ?? "";
    request.headers["accept"] = "application/json";
    if (effuse.isApp()) {
      request.headers["authorization"] = `Bearer ${effuse.tokenSync("TOKEN")}`;
    } else if (parseParams("token")) {
      request.headers["authorization"] = `Bearer ${parseParams("token")}`;
      window.localStorage.setItem("TOKEN", parseParams("token")!);
    } else if (window.localStorage.getItem("TOKEN")) {
      request.headers["authorization"] = `Bearer ${window.localStorage.getItem(
        "TOKEN"
      )}`;
    }

    if (parseParams("_version")) {
      request.headers["x-echoing-env"] = parseParams("_version")!;
    }

    if (request.method === "GET") {
      request.params = request.body;
    }

    return request;
  });

  fly.interceptors.response.use(
    (response, promise) => {
      return response.data;
    },
    (err, promise) => {
      return err;
    }
  );

  return fly;
};

export const apiFetch = createFly({
  baseURL: getApiHost(),
});

export function getCurrentHostname() {
  return location.host;
}

export function getEnvName() {
  const hostname = getCurrentHostname();

  let isProdDeploy = false;

  const env = parseParams("_env");
  const name = hostname.split(".")[0];
  if (
    !hostname.includes("localhost") &&
    !name.includes("dev") &&
    !name.includes("local")
  ) {
    isProdDeploy = true;
  }

  let envName: "dev" | "prod" = isProdDeploy ? "prod" : "dev";

  if (env === "prod" || env === "dev") {
    envName = env;
  }

  return envName;
}

export function getApiHost() {
  const envName = getEnvName();
  const hostname = getCurrentHostname();

  let domain = "qiandao.com";

  if (hostname.includes("qiandao.com")) {
    domain = "qiandao.com";
  }

  // return envName === "dev"
  //   ? `https://dev-api.${domain}`
  //   : `https://api.${domain}`;
  return "https://internal-api.qiandao.com";
}
