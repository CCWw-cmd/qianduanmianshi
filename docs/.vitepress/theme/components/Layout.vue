<template>
  <Layout> </Layout>
</template>

<script setup>
import { Content } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { ref, provide } from "vue";

const isLoggedIn = ref(false);

provide("isLoggedIn", isLoggedIn);

const { Layout } = DefaultTheme;
</script>
