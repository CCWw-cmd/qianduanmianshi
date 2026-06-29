<template>
  <slot v-if="isLogin"></slot>
  <template v-else>
    <slot name="p"></slot>
    <div style="text-align: center; margin-top: 20px">
      <button
        @click="isLogin = !isLogin"
        style="padding: 10px 20px; font-size: 16px; cursor: pointer"
      >
        登录阅读全文
      </button>
    </div>
  </template>
</template>

<script setup>
import { useAuth } from "/auth";
const { isLogin, login, logout } = useAuth();
</script>
