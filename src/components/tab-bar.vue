<template>
  <view
    style="position:fixed; bottom:0; left:0; right:0; z-index:9999; background:#fff; border-top:1px solid #F0F0F0; padding-bottom:env(safe-area-inset-bottom,0px)"
  >
    <view style="display:flex; height:56px">
      <view
        v-for="(tab, i) in TABS"
        :key="i"
        style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; cursor:pointer"
        @click="go(i)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22" height="22"
          viewBox="0 0 24 24"
          fill="none"
          :stroke="activeTab === i ? '#6B1A2E' : '#BDBDBD'"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="pointer-events:none"
        >
          <path v-for="(d, j) in tab.paths" :key="j" :d="d" />
          <circle v-if="tab.circle" :cx="tab.circle.cx" :cy="tab.circle.cy" :r="tab.circle.r" />
        </svg>
        <text
          style="font-size:10px; line-height:1.4; font-weight:500; pointer-events:none"
          :style="{ color: activeTab === i ? '#6B1A2E' : '#BDBDBD' }"
        >{{ tab.label }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import Taro, { useRouter } from '@tarojs/taro'
import { activeTab } from '@/store/tab'

const router = useRouter()

const TABS = [
  {
    label: '剧场视野',
    paths: ['M3 21h18', 'M3 7l9-4 9 4v14H3V7z', 'M9 21v-10h6v10'],
  },
  {
    label: '我的视野',
    paths: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'],
    circle: { cx: 12, cy: 12, r: 3 },
  },
]

function go(i) {
  activeTab.value = i
  // If not on the index page, navigate back to it first
  const normalize = p => (p || '').replace(/^\/+/, '').split('?')[0]
  const onIndex = normalize(router.path) === 'pages/index/index'
  if (!onIndex) {
    Taro.redirectTo({ url: '/pages/index/index' })
  }
}
</script>
