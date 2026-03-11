<template>
  <view class="min-h-screen bg-[ #F9F5F0]">
    <!-- 座位信息头 -->
    <view style="background: linear-gradient(160deg, #2B263B 0%, #4b3e71d9 100%)" class="px-4 pt-10 pb-5">
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
      <text class="block text-lg font-black text-white mb-1">{{ sectionName }} · {{ rowLabel }} · {{ num }}号</text>
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

    <!-- 加载中 -->
    <view v-if="loading" class="flex justify-center pt-12">
      <text class="text-sm text-gray-400">加载中...</text>
    </view>

    <!-- 照片网格 -->
    <view v-else-if="photos.length">
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
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-else class="flex flex-col items-center px-8 pt-10 pb-16">
      <text class="text-8xl mb-4">🎭</text>
      <text class="text-base font-bold text-gray-800 mb-2 text-center">这个座位还没有视角图</text>
      <text class="text-sm text-gray-500 text-center leading-relaxed mb-6">成为第一个分享视角的剧迷，帮助大家做出更好的选座决定</text>
      <view class="bg-[#6957D0] text-white rounded-full px-8 py-3 text-sm font-bold" @tap="showModal = true">
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
          :class="previewUrl && uploadQuality && !uploading ? 'bg-[#6B1A2E]' : 'bg-gray-300'"
          @tap="submitUpload"
        >{{ uploading ? '上传中...' : '提交视角' }}</view>
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
import { ref, computed, onMounted } from 'vue'
import Taro, { useRouter } from '@tarojs/taro'
import { uploadImage, saveSeatPhoto, fetchSeatPhotos } from '@/utils/upload'

const router = useRouter()
const { seatId, section, row, num, theater, theaterId } = router.params
const theaterName = decodeURIComponent(theater || '')
const sectionName = decodeURIComponent(section || '')
const rowLabel = decodeURIComponent(row || '')

const photos = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    photos.value = await fetchSeatPhotos(seatId)
  } finally {
    loading.value = false
  }
})

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
const uploading = ref(false)
const fullscreen = ref(null)

function goBack() { Taro.navigateBack() }
function closeModal() {
  if (uploading.value) return
  showModal.value = false
  previewUrl.value = ''
  uploadQuality.value = ''
}

function pickPhoto() {
  Taro.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
    success(res) { previewUrl.value = res.tempFilePaths[0] },
  })
}

async function submitUpload() {
  if (!previewUrl.value || !uploadQuality.value || uploading.value) return
  uploading.value = true
  Taro.showLoading({ title: '上传中...' })
  try {
    const imageUrl = await uploadImage(previewUrl.value)
    await saveSeatPhoto({ seatId, theaterId, imageUrl, quality: uploadQuality.value })
    photos.value = [
      { imageUrl, quality: uploadQuality.value, date: new Date().toLocaleDateString('zh-CN') },
      ...photos.value,
    ]
    closeModal()
    Taro.showToast({ title: '上传成功！感谢分享', icon: 'success', duration: 2000 })
  } catch (e) {
    Taro.showToast({ title: e.message || '上传失败，请重试', icon: 'none', duration: 2500 })
  } finally {
    Taro.hideLoading()
    uploading.value = false
  }
}
</script>
