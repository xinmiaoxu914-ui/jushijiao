import Fly from "flyio/dist/npm/fly";
import effuse from "echco-effuse";

const adapter = effuse.adapter;

import EngineWrapper from "flyio/dist/npm/engine-wrapper";
const dsEngine = EngineWrapper(adapter);

export const isFileMode = () => {
  return !location.href.includes("http") && effuse.isApp();
};

export const generateFly = () => {
  if (isFileMode()) {
    console.log("using dsEngine fetch");
  } else {
    console.log("using normal fetch");
  }
  const fly = isFileMode() ? new Fly(dsEngine) : new Fly();
  return fly;
};
