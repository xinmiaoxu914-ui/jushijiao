<template>
  <view class="min-h-screen bg-[#F9F5F0]">
    <view v-if="theater">
      <!-- 封面 -->
      <view class="relative h-56">
        <image :src="theater.cover" mode="aspectFill" class="w-full h-full block" />
        <view class="absolute inset-0 bg-gradient-to-t from-black/75 to-black/10" />
        <!-- 返回按钮 -->
        <view
          class="absolute top-10 left-4 w-8 h-8 rounded-full flex items-center justify-center"
          style="background: rgba(0,0,0,0.35)"
          @tap="goBack"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </view>
        <view class="absolute bottom-0 left-0 right-0 p-4">
          <text class="block text-xl font-black text-white mb-2 leading-snug">{{ theater.name }}</text>
          <view class="flex items-center gap-2">
            <text v-for="tag in theater.tags" :key="tag" class="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{{ tag }}</text>
          </view>
        </view>
      </view>

      <!-- Tab 导航 -->
      <view class="sticky top-0 z-50 bg-white flex border-b border-gray-100">
        <view
          v-for="tab in tabs" :key="tab.id"
          class="flex-1 text-center py-3 text-sm relative"
          :class="activeTab === tab.id ? 'text-[#6B1A2E] font-bold' : 'text-gray-500'"
          @tap="activeTab = tab.id"
        >
          {{ tab.label }}
          <view v-if="activeTab === tab.id" class="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#6B1A2E] rounded-full" />
        </view>
      </view>

      <!-- TAB: 座位图 -->
      <view v-if="activeTab === 'seat'">
        <!-- 大厅切换 -->
        <view v-if="theater.halls.length > 1" class="bg-white px-4 py-3 border-b border-gray-100">
          <scroll-view scroll-x>
            <view class="inline-flex gap-2">
              <view
                v-for="h in theater.halls" :key="h.id"
                class="inline-flex flex-col items-center px-4 py-2 rounded-xl border text-sm transition-all"
                :class="selectedHall === h.id ? 'bg-[#6B1A2E] border-[#6B1A2E] text-white' : 'bg-white border-gray-200 text-gray-600'"
                @tap="selectedHall = h.id"
              >
                {{ h.name }}
                <text class="text-xs opacity-70 mt-0.5">{{ h.capacity }}座</text>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 图例 -->
        <view class="flex justify-center gap-6 py-2.5 bg-[#F9F5F0]">
          <view v-for="l in legend" :key="l.label" class="flex items-center gap-1.5 text-xs text-gray-500">
            <view class="w-3.5 h-3.5 rounded" :class="l.cls" />
            {{ l.label }}
          </view>
        </view>

        <!-- 舞台 -->
        <view class="px-4 mb-3">
          <view class="bg-gradient-to-r from-[#2C1340] to-[#4A1225] rounded py-2.5 text-center">
            <text class="text-[#E8D5A8] text-xs font-semibold tracking-widest">STAGE · 舞台</text>
          </view>
        </view>

        <!-- 区段列表 -->
        <view class="px-4 flex flex-col gap-3 pb-8">
          <view
            v-for="sec in currentSections" :key="sec.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm"
          >
            <!-- 区段头 -->
            <view class="flex items-center justify-between px-4 py-3" @tap="toggleSection(sec.id)">
              <view class="flex items-center gap-2.5">
                <view class="w-3 h-3 rounded-full" :class="sectionDot(sec.type)" />
                <text class="text-sm font-semibold text-gray-900">{{ sec.name }}</text>
              </view>
              <view class="flex items-center gap-2">
                <text class="text-xs text-gray-400">{{ sectionCoverage(sec) }}</text>
                <text class="text-xs text-gray-400">{{ openSection === sec.id ? '▲' : '▼' }}</text>
              </view>
            </view>

            <!-- 座位格子 -->
            <view v-if="openSection === sec.id" class="border-t border-gray-100 py-3">
              <scroll-view scroll-x class="w-full">
                <view class="inline-flex flex-col gap-1.5 px-3">
                  <!-- 列号头 -->
                  <view class="flex gap-1">
                    <view class="w-8 flex-shrink-0" />
                    <view
                      v-for="s in sec.seats[0].seats" :key="s.num"
                      class="w-7 text-center text-gray-300 flex-shrink-0"
                      style="font-size:10px"
                    >{{ s.num }}</view>
                  </view>
                  <!-- 每排 -->
                  <view v-for="row in sec.seats" :key="row.row" class="flex gap-1">
                    <view class="w-8 flex-shrink-0 text-right text-gray-400 pr-1" style="font-size:10px;line-height:28px">{{ row.row }}</view>
                    <view
                      v-for="s in row.seats" :key="s.seatId"
                      class="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 transition-transform active:scale-90"
                      :class="s.seatId === selectedSeat ? 'bg-[#C9A96E] scale-110' : s.photoCount > 0 ? 'bg-green-500' : 'bg-gray-200'"
                      @tap="onSeatTap(sec, row, s)"
                    >
                      <text v-if="s.photoCount > 0" class="text-white font-bold" style="font-size:10px">{{ s.photoCount }}</text>
                    </view>
                  </view>
                </view>
              </scroll-view>
              <text class="block text-center text-xs text-gray-400 mt-2 px-4">左右滑动查看全部 · 点击座位查看视角</text>
            </view>
          </view>
        </view>
      </view>

      <!-- TAB: 信息 -->
      <view v-if="activeTab === 'info'" class="p-4 flex flex-col gap-4 pb-8">
        <view class="bg-white rounded-2xl p-4 shadow-sm">
          <text class="block text-sm font-bold text-gray-900 mb-2">剧院简介</text>
          <text class="text-sm text-gray-600 leading-relaxed">{{ theater.description }}</text>
        </view>
        <view class="bg-white rounded-2xl p-4 shadow-sm">
          <text class="block text-sm font-bold text-gray-900 mb-3">交通 & 联系</text>
          <view v-for="row in infoRows" :key="row.label" class="flex gap-2 mb-3 last:mb-0">
            <text class="text-base mt-0.5">{{ row.icon }}</text>
            <text class="text-sm text-gray-600 leading-relaxed flex-1">{{ row.val }}</text>
          </view>
        </view>
        <view class="bg-white rounded-2xl p-4 shadow-sm">
          <text class="block text-sm font-bold text-gray-900 mb-3">场馆信息</text>
          <view v-for="h in theater.halls" :key="h.id" class="flex justify-between py-2.5 border-b border-gray-100 last:border-0">
            <text class="text-sm text-gray-800">{{ h.name }}</text>
            <text class="text-sm text-gray-400">{{ h.capacity }} 座</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro, { useRouter } from '@tarojs/taro'
import { THEATERS } from '@/data/theaters'

const router = useRouter()
const theater = computed(() => THEATERS.find(t => t.id === router.params.id))

const activeTab = ref('seat')
const tabs = [
  { id: 'seat', label: '座位图' },
  { id: 'info', label: '剧院信息' },
]

const selectedHall = ref(theater.value?.halls?.[0]?.id || '')
const openSection = ref('')
const selectedSeat = ref('')

const currentSections = computed(() => {
  const hall = theater.value?.halls?.find(h => h.id === selectedHall.value)
  return hall?.sections || []
})

const legend = [
  { label: '有视角图', cls: 'bg-green-500' },
  { label: '暂无图片', cls: 'bg-gray-200' },
  { label: '已选座位', cls: 'bg-[#C9A96E]' },
]

const infoRows = computed(() => theater.value ? [
  { icon: '🚇', val: theater.value.transport },
  { icon: '📍', val: theater.value.address },
  { icon: '📞', val: theater.value.phone },
] : [])

function sectionDot(type) {
  return { orchestra: 'bg-[#6B1A2E]', mezzanine: 'bg-[#9C4068]', balcony: 'bg-[#C27DA8]' }[type] || 'bg-gray-400'
}

function sectionCoverage(sec) {
  const total = sec.seats.reduce((s, r) => s + r.seats.length, 0)
  const has = sec.seats.reduce((s, r) => s + r.seats.filter(st => st.photoCount > 0).length, 0)
  const pct = total ? Math.round(has / total * 100) : 0
  return pct > 0 ? `${pct}% 有视角` : '暂无视角图'
}

function toggleSection(id) {
  openSection.value = openSection.value === id ? '' : id
}

function onSeatTap(sec, row, seat) {
  selectedSeat.value = seat.seatId
  setTimeout(() => {
    Taro.navigateTo({
      url: `/pages/seat-view/index?seatId=${seat.seatId}&section=${encodeURIComponent(sec.name)}&row=${encodeURIComponent(row.rowLabel)}&num=${seat.num}&theater=${encodeURIComponent(theater.value.name)}&theaterId=${theater.value.id}`
    })
  }, 150)
}

function goBack() { Taro.navigateBack() }
</script>
