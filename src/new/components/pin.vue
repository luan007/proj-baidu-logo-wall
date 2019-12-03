<template>
  <div class="pin" v-bind:style="style">
    <div class="dot"></div>
    <div class="txt" v-bind:style="{opacity: pin.visibility}">
      <div class="title">{{pin.data.title}}</div>
      <div class="desc">{{pin.data.vendorName}}</div>
      <div class="desc">{{pin.data.price}} / {{pin.data.timeUnit}}</div>
      <div class="detail">{{pin.data.digest}}</div>
    </div>
  </div>
</template>




<script>
import * as updatable from "../lib/updatable";
export default {
  props: ["pin"],
  computed: {
    style: function(){
      return {
        opacity: this.pin.visibility,
        transform: "translate(" + this.pin.x + "px," + this.pin.y + "px)"
      }
    }
  }
};
</script>

<style lang="less" scoped>
@sz: 30px;
.img {
  width: 150px;
  height: 150px;
  // text-align: center;
  background: #fff;
  position: relative;
}
img {
    width: 90%;
    background: #fff;
    display: inline-block;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
}
.detail {
  margin-top: 18px;
  width: 560px;
  font-size: 0.9rem;
  line-height: 1.5rem;
  font-weight: 200;
}
.detail_cloud {
  margin-top: 18px;
  width: 500px;
  font-size: 1rem;
  line-height: 2rem;
  font-weight: 300;
}
.pin {
  transition: 0.5s opacity ease;
  position: fixed;
  color: white;
  font-size: 20px;
  font-weight: 600;
  // transform: translate(300px, 300px);
}

.txt {
  position: absolute;
  transition: 0.5s opacity ease;
  transform: translate(40px, -20px);
}

.dot {
  width: @sz;
  height: @sz;
  transform: translate(-50%, -50%);
  // border: 5px solid white;
  border-radius: 10000px;
}

.title {
  font-size: 1.6rem;
  max-width: 200px;
  min-width: 300px;
  margin-bottom: 10px;
  color: #4ca9f1;
}

.desc {
  font-size: 0.9rem;
  opacity: 0.7;
}
</style>