<template>
  <view style="background: #F5F5F7; min-height: 100vh; padding-bottom: 72px">

    <!-- ══ 剧场视野 tab ══ -->
    <view v-show="activeTab === 0">
    <!-- 顶部品牌 + 搜索 -->
    <view style="background: linear-gradient(160deg, #1A0A0F 0%, #3A0E1F 100%); padding: 52px 16px 16px">
      <view style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px">
        <view>
          <text style="display:block; font-size:10px; color:#C9A96E; letter-spacing:3px; font-weight:600">THEATERVIEW</text>
          <text style="display:block; font-size:20px; color:#fff; font-weight:900; letter-spacing:1px; margin-top:1px">剧视角</text>
        </view>
      </view>
      <view style="background:#fff; border-radius:12px; padding:10px 14px; display:flex; align-items:center; gap:8px">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          style="flex:1; font-size:14px; color:#111; background:transparent"
          placeholder="搜索剧院名称、城市..."
          placeholder-style="color:#C4C4C4"
          :value="keyword"
          @input="keyword = $event.detail.value"
        />
        <text v-if="keyword" style="color:#C4C4C4; font-size:14px; padding:0 2px" @tap="keyword = ''">✕</text>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view v-if="keyword.trim()">
      <view style="padding:12px 16px 8px">
        <text style="font-size:12px; color:#9CA3AF">{{ searchResults.length ? `找到 ${searchResults.length} 个剧院` : '暂无结果' }}</text>
      </view>
      <view v-if="searchResults.length" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:0 16px 24px">
        <view
          v-for="t in searchResults" :key="t.id"
          style="background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 1px 6px rgba(0,0,0,0.06)"
          @tap="goTheater(t.id)"
        >
          <image :src="t.cover" mode="aspectFill" style="width:100%; height:110px; display:block" lazyLoad />
          <view style="padding:10px 10px 12px">
            <text style="display:block; font-size:13px; font-weight:700; color:#111; line-height:1.4; margin-bottom:5px">{{ t.name }}</text>
            <view style="display:flex; align-items:center; justify-content:space-between">
              <text style="font-size:11px; color:#9CA3AF">{{ cityName(t.cityId) }}</text>
              <text style="font-size:11px; font-weight:700; color:#F59E0B">★ {{ t.rating }}</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else style="display:flex; flex-direction:column; align-items:center; padding:48px 32px">
        <text style="font-size:44px; margin-bottom:10px">🔍</text>
        <text style="font-size:14px; color:#6B7280">没有找到"{{ keyword }}"</text>
      </view>
    </view>

    <!-- 默认：城市选择 -->
    <view v-else>
      <view style="padding:16px 16px 10px; display:flex; align-items:center; justify-content:space-between">
        <text style="font-size:15px; font-weight:800; color:#111">选择城市</text>
        <text style="font-size:13px; color:#6B1A2E; font-weight:500" @tap="goAllTheaters">全部城市 ›</text>
      </view>
      <view style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; padding:0 16px">
        <view
          v-for="city in citiesWithCount" :key="city.id"
          style="border-radius:14px; overflow:hidden; position:relative"
          :style="{ background: getCityStyle(city.id).gradient }"
          @tap="goCity(city)"
        >
          <view style="padding:12px 10px 10px; min-height:72px; position:relative; display:flex; flex-direction:column; justify-content:flex-end">
            <text style="position:absolute; right:4px; top:-2px; font-size:44px; font-weight:900; color:rgba(255,255,255,0.12); line-height:1; pointer-events:none; user-select:none">{{ getCityStyle(city.id).char }}</text>
            <text style="display:block; font-size:14px; font-weight:800; color:#fff; letter-spacing:0.5px">{{ city.name }}</text>
            <text style="display:block; font-size:10px; color:rgba(255,255,255,0.6); margin-top:2px">{{ city.count }}个剧院</text>
          </view>
        </view>
      </view>

      <view
        style="margin:10px 16px 0; background:#fff; border-radius:12px; padding:11px 16px; display:flex; align-items:center; justify-content:center; gap:6px"
        @tap="goAllTheaters"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>
        <text style="font-size:13px; color:#6B7280">更多城市</text>
        <text style="font-size:13px; color:#D1D5DB">›</text>
      </view>

      <!-- 热门剧院 -->
      <view style="padding:16px 16px 10px; display:flex; align-items:center; justify-content:space-between">
        <text style="font-size:15px; font-weight:800; color:#111">热门剧院</text>
        <text style="font-size:13px; color:#6B1A2E; font-weight:500" @tap="goAllTheaters">查看全部 ›</text>
      </view>
      <scroll-view scroll-x style="padding:0 16px 4px; white-space:nowrap">
        <view style="display:inline-flex; gap:10px">
          <view
            v-for="t in hotTheaters" :key="t.id"
            style="display:inline-block; width:140px; background:#fff; border-radius:14px; overflow:hidden; box-shadow:0 1px 6px rgba(0,0,0,0.07); vertical-align:top"
            @tap="goTheater(t.id)"
          >
            <image :src="t.cover" mode="aspectFill" style="width:100%; height:96px; display:block" lazyLoad />
            <view style="padding:8px 10px 10px">
              <text style="display:block; font-size:12px; font-weight:700; color:#111; line-height:1.4; margin-bottom:4px">{{ t.name }}</text>
              <view style="display:flex; align-items:center; justify-content:space-between">
                <text style="font-size:11px; color:#9CA3AF">{{ t.cityName }}</text>
                <text style="font-size:11px; font-weight:700; color:#F59E0B">★ {{ t.rating }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    </view>

    <!-- ══ 我的视野 tab ══ -->
    <view v-show="activeTab === 1">
      <!-- 顶部渐变 header -->
      <view style="background:linear-gradient(160deg,#1A0A0F 0%,#3A0E1F 100%); padding:52px 20px 28px">
        <view style="display:flex; align-items:center; gap:16px; margin-bottom:20px">
          <view style="width:64px; height:64px; border-radius:50%; background:rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:32px">
            🎭
          </view>
          <view>
            <text style="display:block; font-size:18px; font-weight:900; color:#fff; margin-bottom:4px">剧迷用户</text>
            <view style="display:inline-flex; align-items:center; gap:4px; background:rgba(201,169,110,0.2); border:1px solid rgba(201,169,110,0.4); border-radius:20px; padding:2px 10px">
              <text style="font-size:11px; color:#C9A96E; font-weight:600">{{ myLevel.icon }} {{ myLevel.name }}</text>
            </view>
          </view>
        </view>
        <!-- 统计 -->
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

      <!-- Sub-tab 切换 -->
      <view style="background:#fff; display:flex; border-bottom:1px solid #F0F0F0">
        <view
          v-for="(t, i) in ['我去过的剧场', '我的评价']" :key="i"
          style="flex:1; padding:13px 0; text-align:center"
          @click="profileSubTab = i"
        >
          <text style="font-size:13px; font-weight:600" :style="{ color: profileSubTab === i ? '#6B1A2E' : '#9CA3AF' }">{{ t }}</text>
          <view v-if="profileSubTab === i" style="height:2px; background:#6B1A2E; border-radius:2px; margin:6px auto 0; width:24px"></view>
        </view>
      </view>

      <!-- 我去过的剧场 -->
      <view v-if="profileSubTab === 0">
        <view v-if="myVisits.length === 0" style="display:flex; flex-direction:column; align-items:center; padding:60px 32px; text-align:center">
          <text style="font-size:48px; margin-bottom:12px">🎭</text>
          <text style="font-size:15px; font-weight:700; color:#374151; margin-bottom:6px">还没有观剧记录</text>
          <text style="font-size:13px; color:#9CA3AF">去剧院详情页留下你的视角吧</text>
        </view>
        <view v-else style="padding:12px 16px; display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <view v-for="v in myVisits" :key="v.id" style="background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 1px 6px rgba(0,0,0,0.06)">
            <image :src="v.cover" mode="aspectFill" style="width:100%; height:90px; display:block" />
            <view style="padding:10px">
              <text style="display:block; font-size:12px; font-weight:700; color:#111; margin-bottom:4px; line-height:1.4">{{ v.name }}</text>
              <text style="font-size:11px; color:#9CA3AF">{{ v.date }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 我的评价 -->
      <view v-if="profileSubTab === 1">
        <view v-if="myReviews.length === 0" style="display:flex; flex-direction:column; align-items:center; padding:60px 32px; text-align:center">
          <text style="font-size:48px; margin-bottom:12px">✍️</text>
          <text style="font-size:15px; font-weight:700; color:#374151; margin-bottom:6px">还没有发布评价</text>
          <text style="font-size:13px; color:#9CA3AF">观演后去写下你的感受吧</text>
        </view>
        <view v-else style="padding:12px 16px; display:flex; flex-direction:column; gap:10px">
          <view v-for="r in myReviews" :key="r.id" style="background:#fff; border-radius:16px; padding:14px; box-shadow:0 1px 6px rgba(0,0,0,0.06)">
            <view style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px">
              <text style="font-size:13px; font-weight:700; color:#111">{{ r.theaterName }}</text>
              <text style="font-size:12px; color:#F59E0B; font-weight:700">{{ '★'.repeat(r.rating) }}</text>
            </view>
            <text style="display:block; font-size:13px; color:#374151; line-height:1.6; margin-bottom:6px">{{ r.content }}</text>
            <text style="font-size:11px; color:#C4C4C4">{{ r.date }}</text>
          </view>
        </view>
      </view>
    </view>

    <tab-bar />
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Taro from '@tarojs/taro'
import { CITIES, THEATERS } from '@/data/theaters'
import TabBar from '@/components/tab-bar.vue'
import { activeTab } from '@/store/tab'

// ── Profile tab data ──────────────────────────────────────────────
const profileSubTab = ref(0)
const myVisits = ref([])
const myReviews = ref([])

function loadProfileData() {
  try {
    myReviews.value = JSON.parse(Taro.getStorageSync('my_reviews') || '[]')
    myVisits.value = JSON.parse(Taro.getStorageSync('my_visits') || '[]')
  } catch {}
}

watch(activeTab, val => { if (val === 1) loadProfileData() })

const reviewCount = computed(() => myReviews.value.length)
const theaterCount = computed(() => myVisits.value.length)
const cityCount = computed(() => new Set(myVisits.value.map(v => v.cityId)).size)

const LEVELS = [
  { min: 0,  name: '初探剧场', icon: '🌱' },
  { min: 3,  name: '剧场常客', icon: '🎭' },
  { min: 10, name: '资深剧迷', icon: '⭐' },
  { min: 20, name: '剧院达人', icon: '🏆' },
  { min: 50, name: '传奇剧迷', icon: '👑' },
]
const myLevel = computed(() => {
  const n = theaterCount.value
  return [...LEVELS].reverse().find(l => n >= l.min) || LEVELS[0]
})

const keyword = ref('')

const CITY_STYLE = {
  beijing:   { gradient: 'linear-gradient(140deg, #1A2E6B, #2D56B0)', char: '京' },
  shanghai:  { gradient: 'linear-gradient(140deg, #7B1A2E, #C43858)', char: '沪' },
  guangzhou: { gradient: 'linear-gradient(140deg, #0D5A3C, #1A9060)', char: '穗' },
  shenzhen:  { gradient: 'linear-gradient(140deg, #0D3D5C, #1A6590)', char: '深' },
  hangzhou:  { gradient: 'linear-gradient(140deg, #1A4A2D, #2D7A4A)', char: '杭' },
  suzhou:    { gradient: 'linear-gradient(140deg, #3D2A14, #6B4A28)', char: '苏' },
}
const FALLBACK = { gradient: 'linear-gradient(140deg, #3D3D3D, #6B6B6B)', char: '地' }
function getCityStyle(id) { return CITY_STYLE[id] || FALLBACK }

const citiesWithCount = computed(() =>
  CITIES.map(c => ({ ...c, count: THEATERS.filter(t => t.cityId === c.id).length }))
)

const hotTheaters = computed(() =>
  [...THEATERS]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8)
    .map(t => ({ ...t, halls: undefined, cityName: CITIES.find(c => c.id === t.cityId)?.name || '' }))
)

const searchResults = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return []
  return THEATERS.map(t => ({ ...t, halls: undefined })).filter(t =>
    t.name.toLowerCase().includes(kw) ||
    (t.tags || []).some(g => g.includes(kw)) ||
    (CITIES.find(c => c.id === t.cityId)?.name || '').includes(kw)
  )
})

function cityName(cityId) { return CITIES.find(c => c.id === cityId)?.name || '' }
function goCity(city) {
  Taro.navigateTo({ url: `/pages/theater-list/index?cityId=${city.id}&cityName=${encodeURIComponent(city.name)}` })
}
function goAllTheaters() { Taro.navigateTo({ url: '/pages/theater-list/index' }) }
function goTheater(id) { Taro.navigateTo({ url: `/pages/theater-detail/index?id=${id}` }) }
</script>
