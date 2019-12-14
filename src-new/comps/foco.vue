<template>
  <div class='foco' v-if='viz > 0.1' v-bind:style="{opacity: viz}">
  </div>
</template>

<script>
export default {
    props: ['viz']
}
</script>

<style>
    .foco {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .foco:before, .foco:after {
        content: " ";
        display: block;
        height: 80px;
        width: 2px;
        mix-blend-mode: screen;
        opacity: 0.4;
        background: white;
        position: absolute;
        transform-origin: 50% 50%;
        transform: translate(-50%, -50%);
    }
    .foco:before {
        position: absolute;
        transform: translate(-50%, -50%) rotate(90deg);
    }
    
</style>