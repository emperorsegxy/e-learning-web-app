<script lang="ts" setup>
import {z} from "zod";

enum FormSteps {
  ENTER_EMAIL,
  ENTER_OTP,
  ENTER_PASSWORD,
  COMPLETE
}

const step = ref<FormSteps>(FormSteps.ENTER_EMAIL)

const schema = z.object({
  email: z.string().email('Email is invalid')
})

const passwordsSchema = z.object({
  newPassword: z.string()
      .min(8, 'Enter at least 8 characters')
      .refine(
          (val) => /[a-zA-Z0-9]/.test(val),
          { message: "Password must contain alphanumeric characters" }
      )
      .refine(
          (val) => /[^a-zA-Z0-9]/.test(val),
          { message: "Password must contain at least one special character" }
      ),
  confirmPassword: z.string()
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

type Passwords = z.output<typeof passwordsSchema>

type Email = z.output<typeof schema>

const {$fetch} = useNuxtApp()

const route = useRoute()

const emailField = ref<Email>({email: ''})
const onSubmit = async () => {
  console.log(emailField.value)
  try {
    const res = await $fetch('/forgot-password', {
      method: 'POST',
      body: {
        email: emailField.value.email
      }
    })
    console.log(res)
    navigateTo({query: {email: emailField.value.email}})
    step.value = FormSteps.ENTER_OTP
  } catch (error) {
    console.error(error)
  }
}

const userEmail = computed(() => route.query.email)

const pinSchema = z.object({
  pin: z.array(z.string().regex(/^\d$/, 'Each digit must be a single number'))
      .length(4, 'OTP must be exactly 4')
})

type Pin = z.output<typeof pinSchema>

const pinField = ref<Pin>({pin: []})

const sessionToken = ref('')

const submitOTP = async () => {
  const otp = pinField.value.pin.join('')
  try {
    const res = await $fetch('/forgot-password/confirm-otp', {
      method: 'POST',
      body: {otp, email: userEmail.value}
    })
    console.log(res)
    sessionToken.value = res.data.sessionToken
    step.value = FormSteps.ENTER_PASSWORD
  } catch (error) {
    console.error(error)
  }
}

const passwordsFields = ref<Passwords>({
  newPassword: '',
  confirmPassword: '',
})

const passwordFormFields = [
  {
    label: 'New Password',
    value: '',
    name: 'newPassword',
  },
  {
    label: 'Confirm Password',
    value: '',
    name: 'confirmPassword',
  }
]

const changePassword = async () => {
  console.log(passwordsFields.value, 'pass')
  // if (passwordsFields.value.newPassword !== passwordsFields.value.confirmPassword) return
  try {
    const res = await $fetch('/forgot-password/reset-password', {
      method: 'POST',
      body: {
        password: passwordsFields.value.confirmPassword,
        sessionToken: sessionToken.value,
      }
    })
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <UForm v-if="step === FormSteps.ENTER_EMAIL" @submit.prevent="onSubmit" :schema="schema" :state="emailField">
      <UFormField label="Email">
        <UInput v-model="emailField.email" type="email" />
        <div class="my-4">
          <UButton loading-auto type="submit">Send Code</UButton>
        </div>
      </UFormField>
    </UForm>
    <div v-if="step === FormSteps.ENTER_OTP">
      <div class="text-center">
        <h3 class="font-bold text-2xl mb-2">Enter received OTP</h3>
        <p class="text-[#aaa]">A One-Time PIN has been sent to <br /> <strong>{{userEmail}}</strong></p>
      </div>
      <div class="flex justify-center my-4">
        <u-form @submit.prevent="submitOTP" class="w-full" :schema="pinSchema" :state="pinField">
          <div class="flex justify-center">
            <u-pin-input v-model="pinField.pin" otp size="lg" type="number" length="4" />
          </div>
          <div class="my-3">
            <u-button block loading-auto type="submit">Submit</u-button>
          </div>
        </u-form>
      </div>
    </div>
    <div v-if="step === FormSteps.ENTER_PASSWORD">
      <u-form @submit.prevent="changePassword" :schema="passwordsSchema" :state="passwordsFields">
        <u-form-field
          v-for="passwordField in passwordFormFields"
          :label="passwordField.label"
          class="my-4"
          >
          <u-input v-model="passwordsFields[passwordField.name as keyof typeof passwordsFields]" type="password" />
        </u-form-field>
        <div class="my-3">
          <u-button block loading-auto type="submit">Change Passwords</u-button>
        </div>
      </u-form>
    </div>
  </div>
</template>