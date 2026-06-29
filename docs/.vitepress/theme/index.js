import DefaultTheme from "vitepress/theme";
import { ref } from "vue";
import ContentControl from "./components/ContentControl.vue";
import UserInfo from "./components/UserInfo.vue";
import Layout from "./components/Layout.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app, router, siteData }) {
    if (!import.meta.env.SSR) {
      app.component("ContentControl", ContentControl);
      app.component("UserInfo", UserInfo);

      const isLogin = ref(false);
      app.provide("isLogin", isLogin);
      const token = localStorage.getItem("token");
      if (token) {
        isLogin.value = true;
      } else {
        isLogin.value = false;
      }
    }
  },
};
