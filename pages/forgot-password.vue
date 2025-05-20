<script lang="ts" setup>
import {z} from "zod";

const schema = z.string().email('Email is invalid')

type Email = z.output<typeof schema>

const email = ref<Email>('')
const onSubmit = () => {
  console.log(email.value)
}
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <UForm @submit.prevent="onSubmit" :schema="schema" :state="email">
      <UFormField label="Email">
        <UInput v-model="email" type="email" />
        <div class="my-4">
          <UButton type="submit">Send Code</UButton>
        </div>
      </UFormField>
    </UForm>
  </div>
</template>