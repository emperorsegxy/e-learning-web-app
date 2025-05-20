<script setup lang="ts">
import {z} from "zod";

const fields = ref([
  {
    label: 'Email',
    value: '',
    name: 'email',
    type: 'email'
  },
  {
    label: 'Password',
    value: '',
    name: 'password',
    type: 'password'
  }
])
const schema = z.object({
  email: z.string().email('Email is invalid'),
  password: z.string()
      .min(8, 'Enter at least 8 characters')
      .refine(
          (val) => /[a-zA-Z0-9]/.test(val),
          { message: "Password must contain alphanumeric characters" }
      )
      .refine(
          (val) => /[^a-zA-Z0-9]/.test(val),
          { message: "Password must contain at least one special character" }
      ),
})

type LoginPayload = z.output<typeof schema>

const loginPayload = ref<LoginPayload>({
  email: '',
  password: '',
})

const {$fetch} = useNuxtApp()
const toast = useToast()
const token = useCookie('token')

const onSubmit = async (): Promise<void> => {
  console.log(loginPayload.value)
  try {
    const res = await $fetch('/login', {
      method: 'POST',
      body: loginPayload.value,
    })
    console.log(res, 'response');
    token.value = res.token
    toast.add({title: 'Successfully logged in!'})
    navigateTo('/dashboard')
  } catch (e: any) {
    console.error(e)
    toast.add({title: 'Error logging in!'})
  }
}
</script>

<template>
  <div class="flex items-center justify-center login-wrap">
    <div>
      <h3 class="text-xl">Sign In</h3>
      <UForm class="w-80 form-wrap mt-10" @submit.prevent="onSubmit" :schema="schema" :state="loginPayload">
        <UFormField
            v-for="(field, index) in fields"
            :key="index"
            :label="field.label"
            class="mb-4"
            :name="field.name"
        >
          <UInput class="form-input" v-model="loginPayload[field.name]" :type="field.type" />
        </UFormField>
        <div class="my-3 flex justify-end">
          <nuxt-link class="text-sm text-black-200" to="/forgot-password">Forgot password?</nuxt-link>
        </div>
        <div class="my-4">
          <UButton loading-auto size="xl" block type="submit">Log in</UButton>
        </div>
        <p>
          <small>Don't have an account? <NuxtLink class="text-primary font-semibold" to="/register">Sign up</NuxtLink></small>
        </p>
      </UForm>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-wrap {
  min-height: 100vh;
}

.form-wrap {
  & > div {
    width: 100%;

    .form-input {
      width: 100%;

      :deep(input) {
        min-height: 48px;
      }
    }
  }
}
</style>