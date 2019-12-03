<template>
  <div class="tinyPin" v-bind:style="style">
    <div class="dot"></div>
    <div class="txt">
      <div class="title">{{title}}</div>
      <div class="desc">PATENT</div>
      <!-- <div class="desc">申请号 / {{patent.id}}</div> -->
    </div>
  </div>
</template>

<script>
import * as updatable from "../lib/updatable";
export default {
  props: ["index"],
  data: function() {
    return {
      show: false,
      x: 0,
      y: 0,
      dist: 0,
      title: ""
    };
  },
  computed: {
    style: function() {
      //   var o = 0;
      //   if (window.control.mode == 2) {
      //     if (this.z > 0) {
      //       o = (this.z / window.topMostPatent.world_position[2]) * 0.2;
      //       if (this.topMost) {
      //         o = 1;
      //       }
      //     }
      //   }

      return {
        display: this.show ? "block" : "none",
        opacity: this.dist,
        transform: `translate(${this.x}px, ${this.y}px)`
      };
    }
    // textStyle: function() {
    //   return {
    //     opacity: this.topMost && this.z > 0 ? 1 : 0
    //   };
    // }
  },
  mounted: function() {
    updatable.enable(() => {
      if (window.control.mode == -1) {
        this.show =
          control.idleVisibility > 0.9 && this.index < window.rand_picks.length;
        if (this.show) {
          var pt = window.rand_picks[this.index].pt;
          this.x = (pt[0] * window.data.width) / 2 + window.data.width / 2;
          this.y = -(pt[1] * window.data.height) / 2 + window.data.height / 2;
          this.dist = Math.min(
            1,
            Math.max(0, 1 - (Math.abs(pt[0]) + Math.abs(pt[1])) / 2)
          );
          this.title = "#" + window.rand_picks[this.index].id;
        }
      }
    });
  }
};
</script>

<style lang="less" scoped>
@sz: 10px;

.tinyPin {
  position: fixed;
  color: white;
  font-size: 20px;
  font-weight: 600;
  transform: translate(300px, 300px);
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
  background: white;
}

.title {
  font-size: 1.3rem;
  max-width: 200px;
  min-width: 300px;
  margin-bottom: 3px;
}

.desc {
  font-size: 0.9rem;
}
</style>