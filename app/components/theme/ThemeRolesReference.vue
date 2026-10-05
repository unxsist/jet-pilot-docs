<script setup lang="ts">
/* The theme roles, grouped, with the schema's own descriptions (app/data/theme-roles.json). */
import roles from "~/data/theme-roles.json";

/* `code` spans in the descriptions; everything else is escaped text. */
const parts = (text: string) => text.split("`").map((value, i) => ({ value, code: i % 2 === 1 }));
</script>

<template>
  <div class="divide-y divide-line overflow-hidden rounded-2xl border border-line">
    <details v-for="(group, i) in roles.groups" :key="group.id" class="group bg-bg" :open="i === 0">
      <summary class="flex cursor-pointer list-none items-center gap-3 px-5 py-4 transition-colors hover:bg-surface [&::-webkit-details-marker]:hidden">
        <span class="font-medium tracking-tight">{{ group.label }}</span>
        <span class="rounded-full border border-line px-2 py-0.5 font-mono text-[0.68rem] tabular-nums text-faint">{{ group.roles.length }}</span>
        <span v-if="'note' in group && group.note" class="hidden truncate text-[0.82rem] text-faint sm:block">{{ group.note }}</span>
        <Icon name="chevronDown" :size="15" class="ml-auto shrink-0 text-muted transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <table class="w-full border-t border-line text-left text-[0.85rem]">
        <caption class="sr-only">{{ group.label }} roles</caption>
        <thead class="sr-only">
          <tr><th scope="col">Key</th><th scope="col">What it paints</th></tr>
        </thead>
        <tbody>
          <tr v-for="role in group.roles" :key="role.path" class="border-b border-line last:border-0 max-sm:flex max-sm:flex-col">
            <th scope="row" class="whitespace-nowrap py-2.5 pl-5 pr-4 align-top font-mono text-[0.76rem] font-normal sm:w-[17rem]">
              <span class="text-faint">{{ role.path.slice(0, role.path.lastIndexOf(".") + 1) }}</span><span class="text-fg">{{ role.name }}</span>
            </th>
            <td class="py-2.5 pl-5 pr-5 align-top leading-relaxed text-muted max-sm:pt-0">
              <template v-for="(part, j) in parts(role.description)" :key="j"><code v-if="part.code">{{ part.value }}</code><template v-else>{{ part.value }}</template></template>
            </td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>

<style scoped>
code {
  border-radius: 0.3rem;
  background: color-mix(in srgb, var(--fg) 6%, transparent);
  padding: 0.05rem 0.3rem;
  font-size: 0.85em;
  color: var(--fg);
}
</style>
