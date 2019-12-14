<template>
  <div class='pin' v-if='viz > 0.1'>
      TEST
  </div>
</template>

<script>
export default {
    props: ['viz', 'x', 'y']
}
</script>

<style scoped>
    .pin {
        color: white;
        position: absolute;
    }
</style>