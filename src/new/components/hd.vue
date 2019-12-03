<template>
  <div class="title">
    <div class="norm" v-show="!large">
      <!-- <b>云市场</b> -->
      <img src="/assets/logo/云市场.png" alt="">
      <br>
      <!-- <span>cloud ecosystem</span> -->
    </div>
    <div class="superlarge" v-show="large">Logo
      <br>Wall
      <div style="height:50px;"></div>
      <div style="font-size:70px; font-weight:400">标志墙</div>
      <!-- <img
        src="/assets/专利墙.png"
        style="display:block;  position:fixed; left:2302px; top:864px; height:108px; width:108px;"
        alt
      > -->
    </div>
  </div>
</template>

<script>
export default {
  props: ["large"]
};
</script>

<style lang="less" scoped>
.superlarge {
  position: fixed;
  top: 108px;
  left: 108px;
  line-height: 210px/2;
  font-size: 250px/2;
  font-weight: 600;
}
.title {
  position: fixed;
  color: white;
  position: fixed;
  top: 50px;
  left: 40px;
  font-weight: lighter;
  font-size: 1.5rem;
  line-height: 2.2rem;
  b {
    font-weight: 600;
    font-size: 2.4rem;
  }
}
</style>

