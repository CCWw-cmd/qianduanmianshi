<template>
  <div class="user-wrapper">
    <div class="info" v-if="isLogin">
      <img src="/avatar.jpg" class="avatar" title="点击退出登录" @click="logout">
    </div>
    <div @click="login" v-else>
      <span>登录</span>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from "/auth";
const { isLogin, login, logout } = useAuth();
</script>

<style>
.user-wrapper {
  display: flex;
  align-items: center;
  padding: 0 12px;
  line-height: var(--vp-nav-height);
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  font-weight: bold;
}
.user-wrapper .info {
  display: flex;
  align-items: center;
}

.user-wrapper:hover {
  color: var(--vp-c-brand-1);
}

.avatar {
  width: 36px;
  height: 36px;
  margin-right: 4px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
