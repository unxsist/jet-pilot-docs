<script setup lang="ts">
const containerElement = ref(null);
const tabElements = ref([]);
const activeTab = ref(0);

const props = defineProps<{
  tabs: string[];
}>();

const emit = defineEmits<{
  changeTab: (tab: string) => void;
}>();

const setActiveTab = (tab: string) => {
  activeTab.value = props.tabs.indexOf(tab);
  emit("changeTab", tab);
};

const getContainerBounds = () => {
  if (!containerElement.value) return null;
  return containerElement.value.getBoundingClientRect();
};

const getActiveTabBounds = () => {
  const tab = tabElements.value[activeTab.value];
  if (!tab) return null;

  console.log(tab.getBoundingClientRect());
  return tab.getBoundingClientRect();
};
</script>
<template>
  <div class="relative flex" ref="containerElement">
    <button
      class="py-1.5 px-2.5 text-xs font-semibold z-20 mx-2 transition-colors duration-500"
      :class="{ 'text-white dark:text-black': activeTab === index }"
      v-for="(tab, index) in tabs"
      :key="index"
      ref="tabElements"
      @click="setActiveTab(tab)"
    >
      {{ tab }}
    </button>
    <div
      class="absolute bg-black text-white dark:bg-white dark:text-black h-full z-10 rounded-full transition-all duration-300 ease-in-out"
      :style="{
        width: `${getActiveTabBounds()?.width + 10}px`,
        transform: `translateX(${
          getActiveTabBounds()?.left - getContainerBounds()?.left - 5
        }px)`,
      }"
    ></div>
  </div>
</template>
