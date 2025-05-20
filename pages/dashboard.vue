<script setup lang="ts">
const user = useCookie<any>('user')
</script>

<template>
  <div>
    <h4>Welcome, {{user?.firstName}}</h4>
  </div>
</template>

<style scoped lang="scss">

</style>