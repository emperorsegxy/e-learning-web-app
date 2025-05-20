<script setup lang="ts">
import {z} from "zod";

enum FormSteps {
  USER_TYPE,
  FORM
}

const step = ref<FormSteps>(FormSteps.USER_TYPE)

const userTypes = [
  {
    icon: 'i-lucide-graduation-cap',
    title: 'I want to learn',
    message: 'Access curated courses',
    value: 'learner'
  },
  {
    icon: 'i-lucide-presentation',
    title: 'I want to create',
    message: 'Earn by teaching what you know',
    value: 'creator'
  }
]

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
  userType: z.string()
})

type RegisterPayload = z.output<typeof schema>

const registerPayload = ref<RegisterPayload>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  userType: ''
})

const {$fetch} = useNuxtApp()

const toast = useToast()

const onSubmit = async (): Promise<void> => {
  try {
    const res = await $fetch('/register', {
      method: 'POST',
      body: registerPayload.value,
    })
    console.log(res)
    navigateTo('/')
  } catch (e: any) {
    console.error(e)
  }
}

const onClickUserType = (item: any) => {
  registerPayload.value.userType = item.value
}
</script>

<template>
  <div class="flex items-center justify-center login-wrap">
    <template v-if="step === FormSteps.USER_TYPE">
      <div>
        <h3>Get Started</h3>
        <div class="flex gap-4 mt-10">
          <div
              @click="onClickUserType(_item)"
              v-for="(_item, i) in userTypes"
              :key="i"
              class="user-type-card p-10 cursor-pointer"
              :class="{'user-type-card--chosen': _item.value === registerPayload.userType}"
          >
            <u-icon :name="_item.icon" class="size-5" size="60" />
            <h5 class="font-semibold text-2xl text-gray-300">{{_item.title}}</h5>
            <p class="text-gray-400 text-xs">{{_item.message}}</p>
          </div>
        </div>
        <div class="my-4">
          <div class="continue-button-wrap mx-auto">
            <u-button @click="step = FormSteps.FORM" :disabled="!registerPayload.userType" block size="xl">Continue</u-button>
          </div>
        </div>
      </div>
    </template>
    <template v-if="step === FormSteps.FORM">
      <div>
        <u-button @click="step = FormSteps.USER_TYPE" icon="i-lucide-arrow-left" variant="outline" class="mb-6">back</u-button>
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
    </template>
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

.user-type-card {
  border: 1px solid #333;
  border-radius: 8px;
  transition: all .2s;

  &--chosen {
    border: 1px solid var(--color-primary);
  }
}

.continue-button-wrap {
  max-width: 80%;
}
</style>