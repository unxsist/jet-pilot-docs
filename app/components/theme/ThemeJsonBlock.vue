<script setup lang="ts">
/*
 * A JSON code block with light syntax colours, inline colour swatches (as
 * VS Code shows them) and a copy button. Tokenised at render time; no
 * highlighter dependency.
 */
const props = defineProps<{ code: string; title?: string; filename?: string }>();

type Token = { text: string; kind: "key" | "string" | "number" | "constant" | "punct" | "plain"; color?: string };

const tokens = computed<Token[]>(() => {
  const out: Token[] = [];
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([{}[\],:])/g;
  let last = 0;
  for (const m of props.code.matchAll(re)) {
    if (m.index! > last) out.push({ text: props.code.slice(last, m.index), kind: "plain" });
    if (m[1] && m[2]) {
      out.push({ text: m[1], kind: "key" });
      out.push({ text: m[2], kind: "punct" });
    } else if (m[1]) {
      const hex = m[1].match(/^"(#[0-9a-fA-F]{3,8})"$/)?.[1];
      out.push({ text: m[1], kind: "string", color: hex });
    } else if (m[3]) out.push({ text: m[3], kind: "constant" });
    else if (m[4]) out.push({ text: m[4], kind: "number" });
    else out.push({ text: m[5]!, kind: "punct" });
    last = m.index! + m[0].length;
  }
  if (last < props.code.length) out.push({ text: props.code.slice(last), kind: "plain" });
  return out;
});

const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 1800);
  } catch {
    /* clipboard unavailable */
  }
}
</script>

<template>
  <figure class="overflow-hidden rounded-xl border border-line bg-code">
    <figcaption class="flex items-center gap-3 border-b border-line px-4 py-2.5">
      <span class="font-mono text-[0.72rem] text-faint">{{ filename }}</span>
      <span v-if="title" class="text-[0.78rem] font-medium text-muted">{{ title }}</span>
      <button
        type="button"
        class="ml-auto inline-flex h-7 items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2 text-[0.72rem] font-medium text-muted transition-colors hover:border-line-strong hover:text-fg"
        :aria-label="copied ? 'Copied' : `Copy ${filename ?? 'example'}`"
        @click="copy"
      >
        <Icon :name="copied ? 'check' : 'copy'" :size="12" :class="copied ? 'text-success' : ''" />
        <span aria-live="polite">{{ copied ? "Copied" : "Copy" }}</span>
      </button>
    </figcaption>
    <pre class="json overflow-x-auto px-4 py-3.5 text-[0.76rem] leading-[1.7]"><code><template v-for="(t, i) in tokens" :key="i"><span v-if="t.color" class="swatch" :style="{ background: t.color }" aria-hidden="true" /><span :class="`t-${t.kind}`">{{ t.text }}</span></template></code></pre>
  </figure>
</template>

<style scoped>
.t-key {
  color: var(--accent-text);
}
.t-string {
  color: var(--success);
}
.t-number {
  color: var(--warning);
}
.t-constant {
  color: var(--danger);
}
.t-punct {
  color: var(--faint);
}
.swatch {
  display: inline-block;
  width: 0.7rem;
  height: 0.7rem;
  margin-right: 0.3rem;
  vertical-align: -0.08rem;
  border-radius: 0.15rem;
  box-shadow: 0 0 0 1px var(--line-strong);
}
</style>
