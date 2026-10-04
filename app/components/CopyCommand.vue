<script setup lang="ts">
const props = defineProps<{ command: string; label?: string; prompt?: boolean }>();
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

async function copy() {
  try {
    await navigator.clipboard.writeText(props.command);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = props.command;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 1800);
}
</script>

<template>
  <div class="group relative flex items-center gap-3 rounded-xl border border-line bg-code py-3 pl-4 pr-2 font-mono text-[0.8rem] sm:text-[0.84rem]">
    <span v-if="prompt !== false" class="select-none text-faint" aria-hidden="true">$</span>
    <code class="min-w-0 flex-1 break-all py-0.5 sm:overflow-x-auto sm:whitespace-nowrap sm:break-normal sm:[scrollbar-width:none]">{{ command }}</code>
    <button
      type="button"
      class="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 font-sans text-[0.75rem] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg"
      :aria-label="copied ? 'Copied' : `Copy ${label ?? 'command'}`"
      @click="copy"
    >
      <Icon :name="copied ? 'check' : 'copy'" :size="13" :class="copied ? 'text-success' : ''" />
      <span aria-live="polite">{{ copied ? "Copied" : "Copy" }}</span>
    </button>
  </div>
</template>
