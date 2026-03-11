<template>
  <view style="min-height:100vh; background:#F5F5F7; padding-bottom:72px">
    <!-- 顶部渐变 header -->
    <view style="background:linear-gradient(160deg, #2B263B 0%, #373246 100%); padding:52px 20px 28px">
      <view style="display:flex; align-items:center; gap:16px; margin-bottom:20px">
        <!-- 默认头像 -->
        <view style="width:64px; height:64px; border-radius:50%; background:rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:32px">
          🎭
        </view>
        <view>
          <text style="display:block; font-size:18px; font-weight:900; color: #fff; margin-bottom:4px">剧韭</text>
          <view style="display:inline-flex; align-items:center; gap:4px; background:rgba(50, 33, 52, 0.2); border:1px solid rgba(174, 110, 201, 0.4); border-radius:20px; padding:2px 10px">
            <text style="font-size:11px; color:#6957D0; font-weight:600">{{ level.icon }} {{ level.name }}</text>
          </view>
        </view>
      </view>
      <!-- 统计数字 -->
      <view style="display:flex; background:rgba(255,255,255,0.08); border-radius:16px; padding:14px 0">
        <view style="flex:1; display:flex; flex-direction:column; align-items:center; gap:2px">
          <text style="font-size:22px; font-weight:900; color:#fff">{{ theaterCount }}</text>
          <text style="font-size:11px; color:rgba(255,255,255,0.5)">去过剧院</text>
        </view>
        <view style="width:1px; background:rgba(255,255,255,0.12)"></view>
        <view style="flex:1; display:flex; flex-direction:column; align-items:center; gap:2px">
          <text style="font-size:22px; font-weight:900; color:#fff">{{ cityCount }}</text>
          <text style="font-size:11px; color:rgba(255,255,255,0.5)">覆盖城市</text>
        </view>
        <view style="width:1px; background:rgba(255,255,255,0.12)"></view>
        <view style="flex:1; display:flex; flex-direction:column; align-items:center; gap:2px">
          <text style="font-size:22px; font-weight:900; color:#fff">{{ reviewCount }}</text>
          <text style="font-size:11px; color:rgba(255,255,255,0.5)">发布评价</text>
        </view>
      </view>
    </view>

    <!-- Sub tab 切换 -->
    <view style="background:#fff; display:flex; border-bottom:1px solid #F0F0F0">
      <view
        v-for="(tab, i) in subTabs" :key="i"
        style="flex:1; padding:13px 0; text-align:center"
        @click="activeTab = i"
      >
        <text
          style="font-size:13px; font-weight:600"
          :style="{ color: activeTab === i ? '#6957D0' : '#9CA3AF' }"
        >{{ tab }}</text>
        <view
          v-if="activeTab === i"
          style="height:2px; background:#6B1A2E; border-radius:2px; margin:6px auto 0; width:24px"
        ></view>
      </view>
    </view>

    <!-- Tab 0: 我去过的剧场 -->
    <view v-if="activeTab === 0">
      <view v-if="visits.length === 0" style="display:flex; flex-direction:column; align-items:center; padding:60px 32px; text-align:center">
        <text style="font-size:48px; margin-bottom:12px">🎭</text>
        <text style="font-size:15px; font-weight:700; color:#374151; margin-bottom:6px">还没有观剧记录</text>
        <text style="font-size:13px; color: #9CA3AF">去剧院详情页留下你的视角吧</text>
      </view>
      <view v-else style="padding:12px 16px; display:grid; grid-template-columns:1fr 1fr; gap:12px">
        <view
          v-for="v in visits" :key="v.id"
          style="background: #fff; border-radius:16px; overflow:hidden; box-shadow:0 1px 6px rgba(0,0,0,0.06)"
        >
          <image :src="v.cover" mode="aspectFill" style="width:100%; height:90px; display:block" />
          <view style="padding:10px">
            <text style="display:block; font-size:12px; font-weight:700; color:#111; margin-bottom:4px; line-height:1.4">{{ v.name }}</text>
            <text style="font-size:11px; color: #9CA3AF">{{ v.date }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Tab 1: 我的评价 -->
    <view v-if="activeTab === 1">
      <view v-if="reviews.length === 0" style="display:flex; flex-direction:column; align-items:center; padding:60px 32px; text-align:center">
        <text style="font-size:48px; margin-bottom:12px">✍️</text>
        <text style="font-size:15px; font-weight:700; color:#374151; margin-bottom:6px">还没有发布评价</text>
        <text style="font-size:13px; color: #9CA3AF">观演后去写下你的感受吧</text>
      </view>
      <view v-else style="padding:12px 16px; display:flex; flex-direction:column; gap:10px">
        <view
          v-for="r in reviews" :key="r.id"
          style="background:#fff; border-radius:16px; padding:14px; box-shadow:0 1px 6px rgba(0,0,0,0.06)"
        >
          <view style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px">
            <text style="font-size:13px; font-weight:700; color:#111">{{ r.theaterName }}</text>
            <text style="font-size:12px; color:#F59E0B; font-weight:700">{{ '★'.repeat(r.rating) }}</text>
          </view>
          <text style="display:block; font-size:13px; color:#374151; line-height:1.6; margin-bottom:6px">{{ r.content }}</text>
          <text style="font-size:11px; color:#C4C4C4">{{ r.date }}</text>
        </view>
      </view>
    </view>

    <tab-bar />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import TabBar from '@/components/tab-bar.vue'

const activeTab = ref(0)
const subTabs = ['我去过的剧场', '我的评价']

const visits = ref([])
const reviews = ref([])

onMounted(() => {
  try {
    reviews.value = JSON.parse(Taro.getStorageSync('my_reviews') || '[]')
    visits.value = JSON.parse(Taro.getStorageSync('my_visits') || '[]')
  } catch {}
})

const reviewCount = computed(() => reviews.value.length)
const theaterCount = computed(() => visits.value.length)
const cityCount = computed(() => new Set(visits.value.map(v => v.cityId)).size)

const LEVELS = [
  { min: 0,  name: '初探剧场', icon: '🌱' },
  { min: 3,  name: '剧场常客', icon: '🎭' },
  { min: 10, name: '资深剧迷', icon: '⭐' },
  { min: 20, name: '剧院达人', icon: '🏆' },
  { min: 50, name: '传奇剧迷', icon: '👑' },
]
const level = computed(() => {
  const n = theaterCount.value
  return [...LEVELS].reverse().find(l => n >= l.min) || LEVELS[0]
})
</script>
