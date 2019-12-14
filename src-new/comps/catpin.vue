<template>
  <div class='pin' v-if='viz > 0.1' v-bind:style="{transform: `translate(${x}px, ${y}px)`, opacity: viz}">
      <div style='padding: 2px; font-weight: bolder; background: black;'>{{word}}</div>
  </div>
</template>

<script>
export default {
    props: ['viz', 'x', 'y', 'word']
}
</script>

<style scoped>
    .pin {
        color: white;
        position: absolute;
    }
</style>