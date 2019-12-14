<template>
  <div class="fixed">
    <div class="logo">
      <img v-bind:src="'/assets/logo/云市场.png'" alt />
    </div>
    <div
      v-bind:style="{transform: `translateX(-50%) translateY(${-100 * (hover_indicator == 'timeline' ? 0 : 1)}px)`}"
      class="prompt up"
    >发展历程大事记</div>
    <div
      v-bind:style="{transform: `translateX(-50%) translateY(${100 * (hover_indicator == 'norm' ? 0 : 1)}px)`}"
      class="prompt down"
    >关键成就</div>

    <div v-if='sub_scenes' class="sub_sel" v-bind:style="{opacity: sub_scenes == 2 ? 1 : 0.5}">
        <div v-bind:class='{active: scene == "idle"}'>全域合作</div>
        <div v-bind:class='{active: scene == "big_main"}'>行业地位</div>
        <div v-bind:class='{active: scene == "big_vendor"}'>数量 / 2000+</div>
        <div v-bind:class='{active: scene == "big_sku"}'>数量 / 3000+</div>
    </div>

    <!-- bigmain -->

    <div v-bind:style="{opacity: scene == 'big_main' ? 1 : 0}" class="panel">
        <div class='left-panel'>
            <h1 style='font-size: 3rem;
                        padding-left: 40px;
                        padding-right: 60px;
                        color: black;
                        background: white;
                        padding-top: 25px;
                        padding-bottom: 20px;'
    ><span style='font-weight: lighter; font-size: 2rem'>AI 商品数量</span><br>行业排名No.1</h1>
        </div>

        <div class='right-panel' style='padding-right: 100px'>
            <span style='
                margin-bottom: 30px;
                display: block;
                font-weight: lighter; font-size: 1.8rem'>覆盖品类</span>
            <br>
            <b class='q'>建站</b><br>
            <b class='q'>人工智能</b><br>
            <b class='q'>安全</b><br>
            <b class='q'>泛机器人</b><br>
            <b class='q'>公司服务</b><br>
            <b class='q'>镜像</b><br>
            <b class='q'>企业应用</b><br>
            <b class='q'>API服务</b><br>
            <b class='q'>数据应用</b><br>
            <b class='q'>泛机器人</b><br>
        </div>
    </div>


    <!-- domains -->


    <div v-bind:style="{opacity: scene == 'idle' ? 1 : 0}" class="panel">
        <div class='left-panel'>
            <h1 style='font-size: 3rem;
                        padding-left: 40px;
                        padding-right: 60px;
                        color: black;
                        background: white;
                        padding-top: 25px;
                        padding-bottom: 20px;'
    ><span style='font-weight: lighter; font-size: 2rem'>云市场</span><br>知名服务商</h1>
        </div>

        <div class='right-panel' style='padding-right: 300px'>
            <b class='q'>金蝶</b><br>
            <b class='q'>安恒信息</b><br>
            <b class='q'>A5</b><br>
            <b class='q'>犀思云</b><br>
            <b class='q'>猪八戒</b><br>
            <b class='q'>飞思达</b><br>
            <b class='q'>用友</b><br>
        </div>
         <div class='right-panel' style='padding-right: 100px'>
            <b class='q'>金蝶</b><br>
            <b class='q'>安恒信息</b><br>
            <b class='q'>A5</b><br>
            <b class='q'>犀思云</b><br>
            <b class='q'>猪八戒</b><br>
            <b class='q'>飞思达</b><br>
            <b class='q'>用友</b><br>
        </div>
    </div>




    <div v-bind:style="{opacity: scene == 'big_vendor' ? 1 : 0}" class="panel">
        <div class='left-panel'>
            <h1 style='font-size: 3rem;
                        padding-left: 40px;
                        padding-right: 60px;
                        color: black;
                        background: white;
                        padding-top: 25px;
                        padding-bottom: 20px;'
    ><span style='font-weight: lighter; font-size: 2rem'>入驻服务提供商</span><br>2000+</h1>
        </div>

        <div class='right-panel' style='padding-right: 100px; text-align:left;'>
            <span style='
                margin-bottom: 30px;
                display: block;
                font-weight: lighter; font-size: 1.8rem'>平台产品功能</span>
            <br>
            <span style='line-height: 2rem; display:inline-block;'>	支持交付形式：人工交付、SaaS交付、镜像交付、BCH交付、线下交付、API交付<br>
	服务商管理：入驻服务商提交入驻申请，并管理入驻信息<br>
	店铺管理：服务商可完善店铺及客服信息<br>
	商品管理：服务商商品发布与管理<br>
	交易管理：管理用户订单及交付<br>
	财务对账：对云市场产品的交易进行对账<br>
	自动化结算：服务商可线上申请结算，百度云与财务系统对接进行线上按月打款<br>
	代金券发票管理：服务商对代金券购买，可进行发票查询、提交与管理<br>
	佣金佣金发票：对佣金发票进行提交与管理，提交发票邮寄信息等<br>
<span>
        </div>
    </div>



    <div v-bind:style="{opacity: scene == 'big_sku' ? 1 : 0}" class="panel">
        <div class='left-panel'>
            <h1 style='font-size: 3rem;
                        padding-left: 40px;
                        padding-right: 60px;
                        color: black;
                        background: white;
                        padding-top: 25px;
                        padding-bottom: 20px;'
    ><span style='font-weight: lighter; font-size: 2rem'>商品数量</span><br>3000+</h1>
        </div>

        <div class='right-panel' style='padding-right: 100px; text-align:left;'>
             <h1 style='font-size: 3rem;
                        padding-left: 40px;
                        padding-right: 60px;
                        color: black;
                        background: white;
                        padding-top: 25px;
                        padding-bottom: 20px;'
    ><span style='font-weight: lighter; font-size: 2rem'>商品SKU</span><br>8000+</h1>
             <h1 style='font-size: 3rem;
                        padding-left: 40px;
                        padding-right: 60px;
                        color: black;
                        background: white;
                        padding-top: 25px;
                        padding-bottom: 20px;'
    ><span style='font-weight: lighter; font-size: 2rem'>覆盖品类</span><br>80+</h1>
        </div>
    </div>









  </div>
</template>

<script>
export default {
  props: ["scene", "hover_indicator", "sub_scenes"]
};
</script>

<style>

.q {
    padding: 10px;
    font-size: 1.2rem;
    display: inline-block;
    margin-top: 5px;
    margin-bottom: 5px;
    border-bottom: 2px solid white;
}

.logo {
  position: absolute;
  top: 40px;
  left: 40px;
}
.left-panel, .right-panel
{
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
.left-panel {
    left: 50px;
}
.right-panel {
    right: 50px;
}
.panel {
    transition: all 0.5s ease;
    position: absolute;
    top: 0;
    left:0; 
    right:0;
    bottom: 0;
}
@keyframes blink {
  0% {
      opacity: 0.5;
  }
  48% {
      opacity: 1;
  }
  50% {
      opacity: 0;
  }
  51% {
      opacity: 1;
  }
  53% {
      opacity: 0;
  }
  54% {
      opacity: 1;
  }
  100% {
      opacity: 0.5;
  }
}
.sub_sel {
    transition: all 0.5s ease;
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    width: 100%;
    justify-content: center;
    display: flex;
    justify-items: center;
    align-items: center;
}
.sub_sel div.active {
    background: white;
    color: black;
}
.sub_sel div {
    color: white;
    font-size: 1.3rem;
    text-align: center;
    width: 100px;
    padding: 5px 15px 2px 15px;
    margin-left: 50px;
    margin-right: 50px;
    font-weight: bolder;
}
.prompt {
  position: absolute;
  font-weight: lighter;
  font-size: 1.2rem;
  padding: 5px 30px;
  border-bottom: 2px solid white;
  animation: blink 2s infinite;
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
}
.prompt.up {
  left: 50%;
  top: 40px;
  opacity: 1;
  transform: translateX(-50%);
}
.prompt.down {
  left: 50%;
  bottom: 40px;
  opacity: 1;
  transform: translateX(-50%);
}
.fixed {
  color: white;
  z-index: 9999999;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>