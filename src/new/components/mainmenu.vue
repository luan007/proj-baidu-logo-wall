<template>
  <div
    class="menu"
    v-bind:style="{opacity: visibility, transform: `translateY(${(1 - visibility) * 200}px)`}"
  >
    <div ref="container" class="menu_container">
      <div
        v-for="n,name in billboards"
        v-bind:class="{item: true, active: control.billboard == name}"
        v-bind:id='name'
      >
        <b>{{name}}</b>
        <br>
        <span style='font-size: 0.7em;'>{{n.en}}</span>
      </div>
    </div>
    <div class="selection">
      <div class="selection_tool" ref="selection"></div>
    </div>
  </div>
</template>

<script>
import * as updatable from "../lib/updatable.js";
export default {
  props: ["billboards", "control"],
  data: function() {
    return {
      bounds: {},
      x: 0,
      tx: 0,
      visibility: 0,
      visibility_t: 0,
      selected: null
    };
  },
  mounted: function() {
    var items = this.$refs.container.querySelectorAll(".item");
    for (var i = 0; i < items.length; i++) {
      var id = items[i].id;
      this.bounds[id] = {
        a: items[i].getBoundingClientRect().x / (this.control.width * window.data.scale),
        b:
          (items[i].getBoundingClientRect().x +
            items[i].getBoundingClientRect().width) /
          (this.control.width * window.data.scale)
      };
    }
    updatable.enable(() => {
      this.tx = control.x;
      this.visibility_t = control.menu_shown ? 1 : 0;
      this.visibility = updatable.ease(
        this.visibility,
        this.visibility_t,
        0.1,
        0.0001
      );
      if (control.menu_shown) {
        this.$refs.selection.style.transform = `translate(${(this.tx *
          this.control.width) /
          (this.control.hdboost ? 2 : 1) }px, 0px)`;
        var found = "";
        for (var i in this.bounds) {
          if (this.bounds[i].a < this.tx && this.bounds[i].b > this.tx) {
            found = i;
            control.useLocalXY = 2;
            control.zoom_t = this.billboards[i].zoom_t;
            if (this.billboards[i].kind == "number") {
              control.localY = 0.4 + 0.1 * control.y;
              control.localX =
                ((this.tx - this.bounds[i].a) /
                  (this.bounds[i].b - this.bounds[i].a)) *
                0.1;
            } else if (this.billboards[i].kind == "mesh") {
              control.localY = control.y * 2;
              control.localX =
                ((this.tx - this.bounds[i].a) /
                  (this.bounds[i].b - this.bounds[i].a)) *
                2;
            } else {
              control.localY = control.y;
              control.localX =
                ((this.tx - this.bounds[i].a) /
                  (this.bounds[i].b - this.bounds[i].a)) *
                1;
            }
            break;
          }
        }
        if (!found && control.useLocalXY == 2) {
          control.useLocalXY = 0;
        }
        this.selected = found;
        this.control.billboard = this.selected;
        // console.log(this.selected);
      } else {
        if (control.useLocalXY == 2) {
          control.useLocalXY = 0;
        }
        this.control.billboard = null;
        this.selected = null;
      }
    });
  }
};
</script>

<style lang="less" scoped>
.menu_container {
  display: flex; /* establish flex container */
  justify-content: center; /* center items vertically, in this case */
  align-items: center; /* center items horizontally, in this case */
  color: white;
  position: absolute;
  top: 950px;
  left: 0;
  //   font-weight: 300;
  font-size: 1.2rem;
  width: 2560px;
  .item {
    text-align: center;
    padding: 5px 50px;
    margin: 5px 30px;
    // border-bottom: 3px solid transparent;
    transition: all 0.5s ease;
    opacity: 1;

    .subtitle {
      position: absolute;
      overflow:visible;
      height: 0;
      width: 0;
    }
  }
  .item.active {
    background: white;
    color: black;
    transform: scale(1.1);
    // border-bottom: 3px solid white;
    opacity: 1;
  }
  // .item:last-child {
  //   // flex: 1;
  //   width: 360px;
  // }
}

.selection {
  position: fixed;
  top: 900px;
  left: 0;
  width: 2560px;
  height: 10px;
  color: red;
  .selection_tool {
    @w: 5px;
    position: absolute;
    left: -@w / 2;
    width: @w;
    height: 30px;
    background: white;
    top: 0px;
  }
}
</style>
