<template>
  <view class="min-h-screen bg-[#F9F5F0]">
    <!-- Header -->
    <view class="bg-gradient-to-br from-[#1A0A0F] to-[#4A1225] px-4 pt-12 pb-4">
      <view class="flex items-center gap-3 mb-1">
        <view
          class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style="background: rgba(255,255,255,0.12)"
          @tap="goBack"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </view>
        <text class="text-base font-black text-white leading-tight">{{ theaterName }}</text>
      </view>
      <text class="block text-xs text-white/50 ml-11">写下你的观剧体验</text>
    </view>

    <view class="p-3 flex flex-col gap-3 pb-8">
      <!-- 综合评分 + 分项评分合并 -->
      <view class="bg-white rounded-2xl p-4 shadow-sm">
        <text class="block text-sm font-bold text-gray-900 mb-3">评分</text>
        <!-- 综合 -->
        <view class="flex items-center gap-1.5 mb-3">
          <text class="text-xs text-gray-400 w-14">综合</text>
          <view class="flex gap-1">
            <view
              v-for="n in [1,2,3,4,5]" :key="n"
              class="text-3xl"
              :class="n <= rating ? 'text-amber-400' : 'text-gray-200'"
              @tap="rating = n"
            >★</view>
          </view>
          <text class="text-xs text-gray-400 ml-1">{{ ratingDesc }}</text>
        </view>
        <!-- 分项 -->
        <view v-for="item in subRatings" :key="item.key" class="flex items-center gap-1.5 mb-2 last:mb-0">
          <text class="text-xs text-gray-400 w-14">{{ item.name }}</text>
          <view class="flex gap-1">
            <view
              v-for="n in [1,2,3,4,5]" :key="n"
              class="text-lg"
              :class="n <= item.val ? 'text-amber-400' : 'text-gray-200'"
              @tap="item.val = n"
            >★</view>
          </view>
        </view>
      </view>

      <!-- 评价内容 -->
      <view class="bg-white rounded-2xl p-4 shadow-sm">
        <view class="flex items-center justify-between mb-2">
          <text class="text-sm font-bold text-gray-900">评价内容</text>
          <text class="text-xs text-gray-400">{{ content.length }}/500</text>
        </view>
        <textarea
          class="w-full text-sm text-gray-800 bg-gray-50 rounded-xl p-3 border border-gray-100"
          style="min-height: 88px"
          placeholder="分享你的观剧感受：视野、音效、座椅舒适度..."
          :value="content"
          @input="content = $event.detail.value"
          :maxlength="500"
          auto-height
        />
      </view>

      <!-- 图片 -->
      <view class="bg-white rounded-2xl p-4 shadow-sm">
        <text class="block text-sm font-bold text-gray-900 mb-3">添加图片（选填）</text>
        <view class="flex flex-wrap gap-2">
          <view
            v-for="(img, i) in images" :key="i"
            class="relative w-16 h-16 rounded-xl overflow-hidden"
          >
            <image :src="img" mode="aspectFill" class="w-full h-full" />
            <view class="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center" @tap="images.splice(i,1)">
              <text class="text-white text-xs">✕</text>
            </view>
          </view>
          <view
            v-if="images.length < 6"
            class="w-16 h-16 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-0.5"
            @tap="addImg"
          >
            <text class="text-xl text-gray-300">+</text>
            <text class="text-xs text-gray-400">{{ images.length }}/6</text>
          </view>
        </view>
      </view>

      <!-- 提交 -->
      <view
        class="rounded-2xl py-3.5 text-center text-sm font-bold text-white"
        :class="canSubmit ? 'bg-[#6B1A2E]' : 'bg-gray-300'"
        @tap="submit"
      >提交评价</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro, { useRouter } from '@tarojs/taro'

const router = useRouter()
const theaterName = decodeURIComponent(router.params.theaterName || '')
const theaterId = router.params.theaterId || ''

const rating = ref(0)
const ratingDescs = ['', '很差', '较差', '一般', '不错', '非常棒']
const ratingDesc = computed(() => ratingDescs[rating.value] || '点击评分')

const subRatings = ref([
  { key: 'view',     name: '视野体验', val: 0 },
  { key: 'acoustic', name: '音响效果', val: 0 },
  { key: 'comfort',  name: '座椅舒适', val: 0 },
  { key: 'service',  name: '服务质量', val: 0 },
])

const content = ref('')
const images = ref([])
const canSubmit = computed(() => rating.value > 0 && content.value.trim().length >= 10)

function goBack() { Taro.navigateBack() }

function addImg() {
  Taro.chooseMedia({
    count: 6 - images.value.length, mediaType: ['image'], sourceType: ['album', 'camera'],
    success(res) { images.value = [...images.value, ...res.tempFiles.map(f => f.tempFilePath)] }
  })
}

function submit() {
  if (!canSubmit.value) {
    Taro.showToast({ title: '请填写评分和至少10字评价', icon: 'none' })
    return
  }
  Taro.showLoading({ title: '提交中...' })
  setTimeout(() => {
    Taro.hideLoading()
    const review = {
      id: Date.now(),
      theaterId,
      theaterName,
      rating: rating.value,
      content: content.value.trim(),
      date: new Date().toLocaleDateString('zh-CN'),
    }
    try {
      const existing = JSON.parse(Taro.getStorageSync('my_reviews') || '[]')
      Taro.setStorageSync('my_reviews', JSON.stringify([review, ...existing]))
    } catch {}
    Taro.showToast({ title: '评价发布成功', icon: 'success', duration: 1500 })
    setTimeout(() => Taro.navigateBack(), 1500)
  }, 1000)
}
</script>
