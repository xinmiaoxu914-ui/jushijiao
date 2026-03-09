<template>
  <view class="min-h-screen bg-[#F9F5F0]">
    <!-- 座位信息头 -->
    <view class="bg-gradient-to-br from-[#1A0A0F] to-[#4A1225] px-4 pt-10 pb-5">
      <view class="flex items-center gap-3 mb-3">
        <view
          class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style="background: rgba(255,255,255,0.12)"
          @tap="goBack"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </view>
        <view class="inline-flex items-center bg-[#C9A96E]/20 border border-[#C9A96E]/40 rounded-full px-3 py-1">
          <text class="text-xs text-[#E8D5A8]">{{ theaterName }}</text>
        </view>
      </view>
      <text class="block text-2xl font-black text-white mb-1">{{ sectionName }} · {{ rowLabel }} · {{ num }}号</text>
      <text class="block text-xs text-white/60 mb-3">点击座位后的实际视角</text>
      <view v-if="photos.length" class="flex gap-4">
        <view v-if="qCounts.full" class="flex items-center gap-1.5 text-xs text-white/80">
          <view class="w-2.5 h-2.5 rounded-full bg-green-500" />全景 {{ qCounts.full }}
        </view>
        <view v-if="qCounts.partial" class="flex items-center gap-1.5 text-xs text-white/80">
          <view class="w-2.5 h-2.5 rounded-full bg-yellow-400" />部分 {{ qCounts.partial }}
        </view>
        <view v-if="qCounts.obstructed" class="flex items-center gap-1.5 text-xs text-white/80">
          <view class="w-2.5 h-2.5 rounded-full bg-red-500" />遮挡 {{ qCounts.obstructed }}
        </view>
      </view>
    </view>

    <!-- 上传入口 -->
    <view class="px-4 py-3">
      <view class="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border-2 border-dashed border-[#6B1A2E]" @tap="showModal = true">
        <text class="text-3xl">📸</text>
        <view class="flex-1">
          <text class="block text-sm font-bold text-[#6B1A2E]">上传你的座位视角</text>
          <text class="block text-xs text-gray-400 mt-0.5">帮助其他剧迷了解这个位置</text>
        </view>
        <text class="text-xl text-[#6B1A2E]">›</text>
      </view>
    </view>

    <!-- 照片网格 -->
    <view v-if="photos.length">
      <text class="block px-4 text-xs text-gray-400 mb-2">共 {{ photos.length }} 张视角图</text>
      <view class="grid grid-cols-2 gap-3 px-4 pb-8">
        <view
          v-for="(p, i) in photos" :key="i"
          class="relative rounded-xl overflow-hidden aspect-[4/3] shadow-sm"
          @tap="fullscreen = p"
        >
          <image :src="p.imageUrl" mode="aspectFill" class="w-full h-full block" lazyLoad />
          <view class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 flex items-end justify-between">
            <view class="text-xs px-2 py-0.5 rounded-full font-semibold" :class="qualityBadge(p.quality)">
              {{ qualityLabel(p.quality) }}
            </view>
            <text class="text-xs text-white/60">{{ p.date }}</text>
          </view>
          <view v-if="p.uploaderName" class="absolute top-2 right-2 bg-black/40 rounded-full px-2 py-0.5">
            <text class="text-white text-xs">by {{ p.uploaderName }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex flex-col items-center px-8 pt-10 pb-16">
      <text class="text-8xl mb-4">🎭</text>
      <text class="text-base font-bold text-gray-800 mb-2 text-center">这个座位还没有视角图</text>
      <text class="text-sm text-gray-500 text-center leading-relaxed mb-6">成为第一个分享视角的剧迷，帮助大家做出更好的选座决定</text>
      <view class="bg-[#6B1A2E] text-white rounded-full px-8 py-3 text-sm font-bold" @tap="showModal = true">
        📸 立即上传视角
      </view>
    </view>

    <!-- 上传弹窗 -->
    <view v-if="showModal" class="fixed inset-0 z-50 flex items-end">
      <view class="absolute inset-0 bg-black/50" @tap="closeModal" />
      <view class="relative z-10 w-full bg-white rounded-t-3xl p-5 pb-safe">
        <view class="flex items-center justify-between mb-4">
          <text class="text-base font-bold text-gray-900">上传座位视角</text>
          <view class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center" @tap="closeModal">
            <text class="text-gray-500 text-sm">✕</text>
          </view>
        </view>
        <view class="bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-500 mb-4">
          {{ sectionName }} · {{ rowLabel }} · {{ num }}号
        </view>

        <!-- 图片选择/预览 -->
        <view
          v-if="!previewUrl"
          class="h-44 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 mb-4"
          @tap="pickPhoto"
        >
          <text class="text-4xl">📷</text>
          <text class="text-sm text-gray-400">选择或拍摄照片</text>
        </view>
        <view v-else class="relative h-44 rounded-xl overflow-hidden mb-4">
          <image :src="previewUrl" mode="aspectFill" class="w-full h-full" />
          <view class="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center" @tap="previewUrl = ''">
            <text class="text-white text-sm">✕</text>
          </view>
        </view>

        <!-- 视角质量 -->
        <text class="block text-xs text-gray-500 mb-2">视角类型</text>
        <view class="grid grid-cols-3 gap-2 mb-5">
          <view
            v-for="q in qualityOptions" :key="q.val"
            class="flex flex-col items-center gap-1 py-3 rounded-xl border text-xs text-center transition-all"
            :class="uploadQuality === q.val ? 'border-[#6B1A2E] bg-[#FFF0F4] text-[#6B1A2E] font-semibold' : 'border-gray-200 text-gray-500'"
            @tap="uploadQuality = q.val"
          >
            <text class="text-2xl">{{ q.icon }}</text>
            {{ q.label }}
          </view>
        </view>

        <view
          class="rounded-full py-3.5 text-center text-sm font-bold text-white"
          :class="previewUrl && uploadQuality ? 'bg-[#6B1A2E]' : 'bg-gray-300'"
          @tap="submitUpload"
        >提交视角</view>
      </view>
    </view>

    <!-- 全屏预览 -->
    <view v-if="fullscreen" class="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center" @tap="fullscreen = null">
      <image :src="fullscreen.imageUrl" mode="aspectFit" class="w-full" style="max-height:80vh" />
      <view class="flex items-center gap-3 mt-4">
        <view class="text-xs px-3 py-1 rounded-full font-semibold" :class="qualityBadge(fullscreen.quality)">
          {{ qualityLabel(fullscreen.quality) }}
        </view>
        <text class="text-white/60 text-xs">{{ fullscreen.date }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro, { useRouter } from '@tarojs/taro'

const router = useRouter()
const { seatId, section, row, num, theater: theaterName } = router.params
const sectionName = decodeURIComponent(section || '')
const rowLabel = decodeURIComponent(row || '')

// 模拟已有视角数据
const DEMO = {
  'A_A_5': [
    { imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600', quality: 'full', date: '2025-12-10', uploaderName: '剧迷小鱼' },
    { imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600', quality: 'full', date: '2025-11-20', uploaderName: 'Luna' },
  ],
}

const localPhotos = ref(JSON.parse(Taro.getStorageSync('views_' + seatId) || '[]'))
const allPhotos = computed(() => [...(DEMO[seatId] || []), ...localPhotos.value])

const photos = computed(() => allPhotos.value.map(p => ({ ...p })))
const qCounts = computed(() => {
  const c = { full: 0, partial: 0, obstructed: 0 }
  photos.value.forEach(p => { if (c[p.quality] !== undefined) c[p.quality]++ })
  return c
})

const qualityOptions = [
  { val: 'full', icon: '👁️', label: '全景无遮' },
  { val: 'partial', icon: '🔭', label: '部分遮挡' },
  { val: 'obstructed', icon: '🚧', label: '严重遮挡' },
]

function qualityLabel(q) {
  return { full: '全景', partial: '部分遮', obstructed: '遮挡' }[q] || q
}
function qualityBadge(q) {
  return { full: 'bg-green-500 text-white', partial: 'bg-yellow-400 text-gray-800', obstructed: 'bg-red-500 text-white' }[q] || ''
}

const showModal = ref(false)
const previewUrl = ref('')
const uploadQuality = ref('')
const fullscreen = ref(null)

function goBack() { Taro.navigateBack() }

function closeModal() { showModal.value = false; previewUrl.value = ''; uploadQuality.value = '' }

function pickPhoto() {
  Taro.chooseMedia({
    count: 1, mediaType: ['image'], sourceType: ['album', 'camera'],
    success(res) { previewUrl.value = res.tempFiles[0].tempFilePath }
  })
}

function submitUpload() {
  if (!previewUrl.value || !uploadQuality.value) return
  Taro.showLoading({ title: '上传中...' })
  setTimeout(() => {
    Taro.hideLoading()
    const newPhoto = { imageUrl: previewUrl.value, quality: uploadQuality.value, date: new Date().toLocaleDateString('zh-CN') }
    localPhotos.value = [...localPhotos.value, newPhoto]
    Taro.setStorageSync('views_' + seatId, JSON.stringify(localPhotos.value))
    closeModal()
    Taro.showToast({ title: '上传成功！感谢分享', icon: 'success', duration: 2000 })
  }, 1200)
}
</script>
