<script setup lang="ts">
import {z} from "zod";

const fields = ref([
  {
    label: 'First Name',
    value: '',
    name: 'firstName',
    type: 'text'
  },
  {
    label: 'Last Name',
    value: '',
    name: 'lastName',
    type: 'text'
  },
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
  firstName: z.string().min(3),
  lastName: z.string().min(3),
})

type RegisterPayload = z.output<typeof schema>

const registerPayload = ref<RegisterPayload>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
})

const onSubmit = async (): Promise<void> => {
  console.log(registerPayload.value)
}
</script>

<template>
  <div class="flex items-center justify-center login-wrap">
    <div>
      <h3 class="text-xl font-bold">Create an account</h3>
      <UForm class="w-80 form-wrap mt-10" @submit.prevent="onSubmit" :schema="schema" :state="registerPayload">
        <UFormField
            v-for="(field, index) in fields"
            :key="index"
            :label="field.label"
            class="mb-4"
            :name="field.name"
        >
          <UInput class="form-input" v-model="registerPayload[field.name]" :type="field.type" />
        </UFormField>
        <div class="my-3 flex justify-end">
<!--          <nuxt-link class="text-sm text-black-200" to="/forgot-password">Forgot password?</nuxt-link>-->
        </div>
        <div class="my-4">
          <UButton size="xl" block type="submit">Sign up</UButton>
        </div>
        <p>
          <small>Already have an account? <NuxtLink class="text-primary font-semibold" to="/">Sign in</NuxtLink></small>
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