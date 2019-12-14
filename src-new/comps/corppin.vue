<template>
  <div class="pin" v-if="viz > 0.1" v-bind:style="{opacity: viz}">
    <div class="lock" v-bind:style="{transform: `translate(${x}px, ${y}px)`}">
      <div class="scope"></div>
      <div class="words">
        <div class="cid">{{data.cid_name}}</div>
        <div class="title">{{data.title}}</div>
        <div class="vendor">{{data.vendorName}}</div>
        <div class="digest">{{data.digest}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["viz", "x", "y", "data"]
};
</script>

<style scoped>
.pin,
.lock {
  z-index: 999999;
  color: white;
  position: absolute;
}
.words {
  padding: 20px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  top: 50px;
  left: 50px;
}

.words * {
  width: 300px;
}

.digest {
    opacity: 0.8
}

.vendor {
    color: #ff6633;
    margin-top: 5px;
    margin-bottom: 5px;
    white-space: nowrap;
    font-weight: bolder;

}

.cid {
  font-size: 0.8rem;
  font-weight: bolder;
  margin-bottom: 2px;
  font-style: italic;
}

.title {
  font-weight: bolder;
  font-size: 1.5rem;
  margin-bottom: 5px;
  width: auto;
  white-space: nowrap;
}

.scope {
  position: absolute;
  top: 0px;
  left: 0px;
  transform: translate(-50%, -50%) rotate(45deg);
  height: 80px;
  width: 80px;
  border: 5px solid rgba(255, 255, 255, 0.3);
}
</style>