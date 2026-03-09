import { createApp } from "vue";
import effuse from "echco-effuse";
import "./app.css";
const App = createApp({
  onShow(options) {
    console.log("App onShow.");
  },
});
// effuse bridge 初始化（仅在千岛平台 App 内运行，浏览器调试时跳过）
console.log("effuse.isApp():", effuse.isApp());
if (effuse.isApp()) {
  effuse.init();
}
export default App;
