import { inject, watch } from "vue";
import { useRouter } from "vitepress";

export function useAuth() {
  const router = useRouter();

  const isLogin = inject("isLogin");

  async function login() {
    localStorage.setItem("token", "test"); // 模拟登录，实际应用中应使用真实的登录逻辑
    isLogin.value = true;
  }

  async function logout() {
    localStorage.removeItem("token"); // 模拟登出，实际应用中应使用真实的登出逻辑
    isLogin.value = false;
  }

  watch(isLogin, (newValue) => {
    console.log(newValue);
  });

  return {
    isLogin,
    login,
    logout,
  };
}
