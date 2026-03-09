<template>
  <view class="min-h-screen bg-[#F9F5F0] pb-20">
    <!-- Header -->
    <view class="bg-gradient-to-br from-[#1A0A0F] to-[#4A1225] px-5 pt-12 pb-5">
      <text class="block text-2xl font-black text-white mb-1">视角广场</text>
      <text class="block text-xs text-white/60 mb-4">剧迷实拍 · 真实座位视角</text>
      <view class="flex gap-4">
        <view class="flex flex-col items-center">
          <text class="text-lg font-black text-white">{{ PHOTOS.length }}</text>
          <text class="text-xs text-white/50">张视角图</text>
        </view>
        <view class="w-px bg-white/20" />
        <view class="flex flex-col items-center">
          <text class="text-lg font-black text-white">12</text>
          <text class="text-xs text-white/50">个剧院</text>
        </view>
        <view class="w-px bg-white/20" />
        <view class="flex flex-col items-center">
          <text class="text-lg font-black text-white">38</text>
          <text class="text-xs text-white/50">位贡献者</text>
        </view>
      </view>
    </view>

    <!-- 质量筛选 -->
    <view class="bg-white border-b border-gray-100 px-4 py-3">
      <scroll-view scroll-x class="whitespace-nowrap">
        <view class="inline-flex gap-2">
          <view
            v-for="f in FILTERS" :key="f.val"
            class="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs border transition-all"
            :class="filter === f.val
              ? 'bg-[#6B1A2E] border-[#6B1A2E] text-white font-semibold'
              : 'bg-white border-gray-200 text-gray-600'"
            @tap="filter = f.val"
          >
            <view
              class="w-1.5 h-1.5 rounded-full"
              :class="f.dot"
            />
            {{ f.label }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 照片网格 -->
    <view v-if="filtered.length" class="grid grid-cols-2 gap-3 p-4">
      <view
        v-for="(p, i) in filtered" :key="i"
        class="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm bg-gray-100"
        @tap="fullscreen = p"
      >
        <image :src="p.url" mode="aspectFill" class="w-full h-full block" lazyLoad />
        <view class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5">
          <view class="flex items-center justify-between mb-1">
            <view class="text-xs px-2 py-0.5 rounded-full font-semibold" :class="qualityBadge(p.quality)">
              {{ qualityLabel(p.quality) }}
            </view>
          </view>
          <text class="block text-white text-xs font-semibold leading-snug">{{ p.theater }}</text>
          <text class="block text-white/60 text-xs">{{ p.section }} · {{ p.row }}排{{ p.num }}号</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex flex-col items-center pt-20 pb-16 px-8">
      <text class="text-7xl mb-4">📷</text>
      <text class="text-base font-bold text-gray-700 mb-1">暂无此类视角图</text>
      <text class="text-sm text-gray-400">换个筛选条件试试</text>
    </view>

    <!-- 上传引导 -->
    <view class="mx-4 mb-4 bg-[#6B1A2E]/5 border border-[#6B1A2E]/20 rounded-2xl p-4 flex items-center gap-3">
      <text class="text-3xl">📸</text>
      <view class="flex-1">
        <text class="block text-sm font-bold text-[#6B1A2E]">分享你的座位视角</text>
        <text class="block text-xs text-gray-400 mt-0.5">从剧院座位图页面进入上传</text>
      </view>
    </view>

    <!-- 全屏预览 -->
    <view v-if="fullscreen" class="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center" @tap="fullscreen = null">
      <image :src="fullscreen.url" mode="aspectFit" class="w-full" style="max-height: 75vh" />
      <view class="mt-4 px-6 w-full">
        <view class="flex items-center gap-2 mb-2">
          <view class="text-xs px-3 py-1 rounded-full font-semibold" :class="qualityBadge(fullscreen.quality)">
            {{ qualityLabel(fullscreen.quality) }}
          </view>
          <text class="text-white/60 text-xs">by {{ fullscreen.uploader }}</text>
        </view>
        <text class="block text-white font-bold text-base">{{ fullscreen.theater }}</text>
        <text class="block text-white/60 text-sm mt-0.5">{{ fullscreen.section }} · {{ fullscreen.row }}排{{ fullscreen.num }}号</text>
      </view>
    </view>

    <tab-bar />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import TabBar from '@/components/tab-bar.vue'

const filter = ref('')

const FILTERS = [
  { val: '', label: '全部', dot: 'bg-gray-400' },
  { val: 'full', label: '全景无遮', dot: 'bg-green-500' },
  { val: 'partial', label: '部分遮挡', dot: 'bg-yellow-400' },
  { val: 'obstructed', label: '严重遮挡', dot: 'bg-red-500' },
]

const PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600', quality: 'full', theater: '上海大剧院', section: '池座', row: 'A', num: '5', uploader: '剧迷小鱼', date: '2025-12-10' },
  { url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600', quality: 'full', theater: '上海文化广场', section: '一层正厅', row: 'C', num: '12', uploader: 'Luna', date: '2025-11-20' },
  { url: 'https://images.unsplash.com/photo-1580130544977-284ed58d0040?w=600', quality: 'partial', theater: '上海音乐厅', section: '二层', row: 'B', num: '8', uploader: '看剧ing', date: '2025-11-05' },
  { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600', quality: 'full', theater: '东方艺术中心', section: '池座A区', row: 'E', num: '3', uploader: 'theaterLover', date: '2025-10-18' },
  { url: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600', quality: 'obstructed', theater: '天蟾逸夫舞台', section: '二楼侧厅', row: 'A', num: '1', uploader: '剧场控', date: '2025-10-02' },
  { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', quality: 'full', theater: '上海音乐厅', section: '一层', row: 'D', num: '15', uploader: '音乐迷', date: '2025-09-28' },
  { url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600', quality: 'partial', theater: '上海大剧院', section: '楼座', row: 'B', num: '20', uploader: 'Alice', date: '2025-09-10' },
  { url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600', quality: 'full', theater: '上海国际舞蹈中心', section: '池座', row: 'F', num: '7', uploader: '舞迷', date: '2025-08-15' },
]

const filtered = computed(() =>
  filter.value ? PHOTOS.filter(p => p.quality === filter.value) : PHOTOS
)

const fullscreen = ref(null)

function qualityLabel(q) {
  return { full: '全景', partial: '部分遮', obstructed: '遮挡' }[q] || q
}
function qualityBadge(q) {
  return { full: 'bg-green-500 text-white', partial: 'bg-yellow-400 text-gray-800', obstructed: 'bg-red-500 text-white' }[q] || ''
}
</script>
