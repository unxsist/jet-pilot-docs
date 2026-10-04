<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
const toggle = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};
</script>

<template>
  <button
    type="button"
    class="relative inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-fg/5 hover:text-fg"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <!-- Both icons are rendered; CSS picks one so SSR and client agree. -->
    <Icon name="sun" :size="17" class="hidden dark:block" />
    <Icon name="moon" :size="17" class="block dark:hidden" />
  </button>
</template>
