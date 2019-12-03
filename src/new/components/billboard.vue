<template>
  <div class="billboard" ref="billboard">
    <!-- <div class="title">{{k}}</div> -->
    <div class="desc">
      <div v-for="q in billboard.desc.split('\n')" v-if="q.trim()">{{q}}</div>
    </div>
    <div v-if="tag" class="tags">
      <div
        v-if="name"
        v-for="i,name in tag.data"
        v-bind:class="{tag: true, selected: billboard.selected == name}"
      >
        <div class="tag_name">{{name}}</div>
        <div class="tag_num">{{i}}</div>
      </div>
    </div>

    <div v-if="tag" class="pins">
      <div
        v-if="name"
        v-for="i,name in tag.data"
        v-bind:class="{pin: true, bar:billboard.kind == 'bar' || billboard.kind  == 'mesh', selected: billboard.selected == name}"
        v-bind:style="{opacity: 1 , transform: `translate(${billboard.pins[name].x}px,${billboard.pins[name].y}px)`}"
      >
        <div class="dot"></div>
        <div class="pin_name">{{name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
//Math.max(0, billboard.pins[name].z / 2)
import * as updatable from "../lib/updatable.js";
export default {
  props: ["billboard", "k", "tag"],
  data: function() {
    return {
      visibility: 0,
      visibility_t: 0
    };
  },
  mounted: function() {
    updatable.enable(() => {
      this.visibility_t =
        control.mode == 1 && control.billboard == this.k ? 1 : 0;
      this.visibility = updatable.ease(
        this.visibility,
        this.visibility_t,
        0.1,
        0.00001
      );
      this.$refs.billboard.style.opacity = this.visibility;
      if (this.visibility > 0.1) {
        this.$refs.billboard.style.transform = `translate(${(window.control.x -
          0.5) *
          30}px, ${(window.control.y - 0.5) * 30}px)`;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.pin {
  position: fixed;
  top: 0;
  left: 0;
}

@sz: 20px;
.dot {
  width: @sz;
  height: @sz;
  border: 3px solid rgba(255, 100, 20, 0.5);
  transform: translate(-50%, -50%);
  background: transparent; //rgba(255, 100, 20, 1);
  border-radius: 10000px;
  transition: all 0.5s ease;
}
.pin_name {
  color: black;
  background: white;
  padding: 3px 5px;
  font-weight: 600;
  font-size: 1.2rem;
  display: inline-block;
}

.mesh.selected {
  .dot {
    border: 2px solid rgba(255, 100, 20, 1);
    transform: translate(-50%, -50%) scale(1.3);
    // background: rgba(255, 100, 20, 1);
  }
}

.bar {
  .pin_name {
    background: black;
    color: white;
  }
  .dot {
    height: 10px;
    width: 10px;
    background: white;
    border: none;
  }
}

.billboard {
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  height: 1080px;
  width: 2560px;
  .desc {
    position: absolute;
    color: white;
    font-size: 1.3rem;
    top: 50%;
    transform: translateY(-50%);
    left: 70px;
    font-weight: 600;
    > div {
      margin: 50px;
      max-width: 300px;
    }
  }
  .tag.selected {
    background: white;
    color: black;
  }
  .tags {
    position: absolute;
    right: 130px;
    top: 50%;
    transform: translateY(-50%);
    text-align: right;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    grid-auto-flow: column;
    grid-gap: 20px;

    .tag {
      transition: all 0.5s ease;
      padding: 5px 30px;
    }
    .tag_name {
      font-size: 1.2rem;
    }

    .tag_num {
      font-size: 2rem;
      font-weight: 600;
    }
  }
}
</style>
