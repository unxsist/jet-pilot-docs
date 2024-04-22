<script setup lang="ts">
const { isMacOS, isWindows } = useDevice();
const activeImage = ref("Object Browser");
const latestVersion = ref("v1.0.0");

const getOperatingSystem = () => {
  if (isMacOS) {
    return "Mac";
  } else if (isWindows) {
    return "Windows";
  }

  return "Linux";
};

onMounted(() => {
  fetch("https://api.github.com/repos/unxsist/jet-pilot/releases/latest")
    .then((response) => response.json())
    .then((data) => {
      latestVersion.value = data.tag_name;
    });
});
</script>
<template>
  <div class="text-center my-5">
    <h1 class="text-lg sm:text-xl lg:text-2xl font-medium mb-3">
      Manage Kubernetes in style
    </h1>
    <h2
      class="lg:text-lg font-normal w-5/6 lg:w-1/2 mx-auto text-dark-gray dark:text-gray"
    >
      JET Pilot is an open-source Kubernetes desktop client that focuses on less
      clutter, speed and good looks.
    </h2>
    <div class="flex justify-center mt-14 mb-8">
      <Tabs
        :tabs="[
          'Object Browser',
          'Object Editor',
          'Log Viewer',
          'Shell Access',
        ]"
        @changeTab="activeImage = $event"
      />
    </div>
    <div class="flex justify-center">
      <img
        src="~/assets/images/dark-object-browser.png"
        v-show="activeImage === 'Object Browser'"
        :title="activeImage"
        :alt="activeImage"
        class="w-[1000px] hidden dark:block"
      />
      <img
        src="~/assets/images/light-object-browser.png"
        v-show="activeImage === 'Object Browser'"
        title="Object Browser"
        alt="Object Browser"
        class="w-[1000px] block dark:hidden"
      />
      <img
        src="~/assets/images/dark-object-editor.png"
        v-show="activeImage === 'Object Editor'"
        :title="activeImage"
        :alt="activeImage"
        class="w-[1000px] hidden dark:block"
      />
      <img
        src="~/assets/images/light-object-editor.png"
        v-show="activeImage === 'Object Editor'"
        title="Object Browser"
        alt="Object Browser"
        class="w-[1000px] block dark:hidden"
      />
      <img
        src="~/assets/images/dark-log-viewer.png"
        v-show="activeImage === 'Log Viewer'"
        :title="activeImage"
        :alt="activeImage"
        class="w-[1000px] hidden dark:block"
      />
      <img
        src="~/assets/images/light-log-viewer.png"
        v-show="activeImage === 'Log Viewer'"
        title="Object Browser"
        alt="Object Browser"
        class="w-[1000px] block dark:hidden"
      />
      <img
        src="~/assets/images/dark-shell-access.png"
        v-show="activeImage === 'Shell Access'"
        :title="activeImage"
        :alt="activeImage"
        class="w-[1000px] hidden dark:block"
      />
      <img
        src="~/assets/images/light-shell-access.png"
        v-show="activeImage === 'Shell Access'"
        title="Object Browser"
        alt="Object Browser"
        class="w-[1000px] block dark:hidden"
      />
    </div>
    <div
      class="flex flex-col items-center relative bg-white dark:bg-black -mt-[100px] min-h-[100px] sm:-mt-[250px] sm:min-h-[250px] z-10"
    >
      <div
        class="flex justify-center absolute mx-auto max-w-full overflow-hidden sm:overflow-visible"
      >
        <img
          src="~/assets/images/line-dark.svg"
          class="min-w-[1000px] sm:min-w-full hidden dark:block"
        />
        <img
          src="~/assets/images/line-light.svg"
          class="min-w-[1000px] sm:min-w-full dark:hidden"
        />
      </div>
      <a
        href="https://www.github.com/unxsist/jet-pilot/releases/latest"
        target="_blank"
        class="mt-14 flex items-baseline space-x-2 font-semibold bg-black dark:bg-white text-white dark:text-black rounded py-3 px-5 z-50"
      >
        <span>Download for {{ getOperatingSystem() }}</span>
        <span class="text-gray text-xs">{{ latestVersion }}</span>
      </a>
    </div>
  </div>
</template>
