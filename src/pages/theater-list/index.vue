<template>
  <view style="background: #F5F5F7; min-height: 100vh; padding-bottom: 88px">
    <!-- 顶部 -->
    <view style="background: linear-gradient(160deg, #1A0A0F 0%, #3A0E1F 100%); padding: 48px 16px 14px">
      <view style="display:flex; align-items:center; gap:12px; margin-bottom:14px">
        <view
          style="width:32px; height:32px; border-radius:16px; background:rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; flex-shrink:0"
          @tap="goBack"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </view>

        <!-- 城市选择按钮 -->
        <view
          style="flex:1; display:flex; align-items:center; gap:6px"
          @tap="showCityPicker = true"
        >
          <text style="font-size:20px; font-weight:900; color:#fff">{{ selectedCityName }}</text>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </view>

        <text style="font-size:13px; color:rgba(255,255,255,0.4)">{{ filtered.length }}家</text>
      </view>

      <!-- 搜索框 -->
      <view style="background:#fff; border-radius:12px; padding:9px 14px; display:flex; align-items:center; gap:8px">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          style="flex:1; font-size:14px; color:#111; background:transparent"
          :placeholder="`在${selectedCityName}中搜索...`"
          placeholder-style="color:#C4C4C4"
          :value="keyword"
          @input="keyword = $event.detail.value"
        />
        <text v-if="keyword" style="color:#C4C4C4; font-size:14px" @tap="keyword = ''">✕</text>
      </view>
    </view>

    <!-- 2列剧院网格 -->
    <view v-if="filtered.length" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:14px 14px 24px">
      <view
        v-for="t in filtered" :key="t.id"
        style="background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 1px 8px rgba(0,0,0,0.06)"
        @tap="goDetail(t.id)"
      >
        <view style="position:relative">
          <image :src="t.cover" mode="aspectFill" style="width:100%; height:120px; display:block" lazyLoad />
          <view style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.5); border-radius:8px; padding:2px 7px; display:flex; align-items:center; gap:2px">
            <text style="font-size:10px; color:#F59E0B">★</text>
            <text style="font-size:11px; font-weight:700; color:#fff">{{ t.rating }}</text>
          </view>
          <view
            style="position:absolute; top:8px; left:8px; width:28px; height:28px; border-radius:14px; background:rgba(255,255,255,0.92); display:flex; align-items:center; justify-content:center"
            @tap.stop="toggleSave(t.id)"
          >
            <text style="font-size:14px; line-height:1">{{ isSaved(t.id) ? '❤️' : '🤍' }}</text>
          </view>
        </view>
        <view style="padding:10px 10px 12px">
          <text style="display:block; font-size:13px; font-weight:700; color:#111; line-height:1.4; margin-bottom:6px">{{ t.name }}</text>
          <view style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:5px">
            <text
              v-for="tag in (t.tags || []).slice(0, 2)" :key="tag"
              style="font-size:10px; background:#FEF0F3; color:#6B1A2E; padding:2px 7px; border-radius:6px"
            >{{ tag }}</text>
          </view>
          <text style="display:block; font-size:11px; color:#AAAAAA; line-height:1.4">{{ t.address }}</text>
        </view>
      </view>
    </view>

    <!-- 无数据空态 -->
    <view v-else style="display:flex; flex-direction:column; align-items:center; padding:64px 32px">
      <text style="font-size:52px; margin-bottom:14px">🎭</text>
      <text style="font-size:15px; font-weight:700; color:#374151; margin-bottom:6px">
        {{ keyword ? '没有找到匹配的剧院' : `${selectedCityName}暂无数据` }}
      </text>
      <text style="font-size:13px; color:#9CA3AF">{{ keyword ? '换个关键词试试' : '数据持续更新中，敬请期待' }}</text>
    </view>

    <!-- 城市选择弹窗 -->
    <view v-if="showCityPicker" style="position:fixed; inset:0; z-index:100; display:flex; flex-direction:column; justify-content:flex-end">
      <!-- 遮罩 -->
      <view
        style="position:absolute; inset:0; background:rgba(0,0,0,0.45)"
        @tap="showCityPicker = false"
      />
      <!-- 弹窗主体 -->
      <view style="position:relative; background:#fff; border-radius:24px 24px 0 0; padding-bottom:env(safe-area-inset-bottom, 0px); max-height:75vh; display:flex; flex-direction:column">
        <!-- 顶部把手 + 标题 -->
        <view style="padding:12px 20px 0; flex-shrink:0">
          <view style="width:36px; height:4px; background:#E5E5E5; border-radius:2px; margin:0 auto 14px"/>
          <view style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px">
            <text style="font-size:16px; font-weight:800; color:#111">选择城市</text>
            <view
              style="width:28px; height:28px; border-radius:14px; background:#F5F5F5; display:flex; align-items:center; justify-content:center"
              @tap="showCityPicker = false"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </view>
          </view>
        </view>

        <!-- 城市网格 -->
        <scroll-view scroll-y style="flex:1; overflow:hidden">
          <view style="padding:4px 16px 24px">
            <!-- 有数据的城市 -->
            <text style="display:block; font-size:11px; font-weight:600; color:#9CA3AF; letter-spacing:1px; margin-bottom:10px">有剧院数据</text>
            <view style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:8px; margin-bottom:20px">
              <view
                v-for="city in citiesWithData" :key="city.id"
                style="border-radius:10px; padding:9px 4px; text-align:center; border-width:1.5px; border-style:solid"
                :style="selectedCity === city.id
                  ? 'background:#6B1A2E; border-color:#6B1A2E'
                  : 'background:#fff; border-color:#E5E5E5'"
                @tap="selectCity(city.id)"
              >
                <text
                  style="font-size:13px; font-weight:600"
                  :style="selectedCity === city.id ? 'color:#fff' : 'color:#222'"
                >{{ city.name }}</text>
              </view>
            </view>

            <!-- 其他城市 -->
            <text style="display:block; font-size:11px; font-weight:600; color:#9CA3AF; letter-spacing:1px; margin-bottom:10px">其他城市（即将上线）</text>
            <view style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:8px">
              <view
                v-for="city in citiesWithoutData" :key="city.id"
                style="border-radius:10px; padding:9px 4px; text-align:center; border:1.5px solid #F0F0F0; background:#FAFAFA"
              >
                <text style="font-size:13px; color:#C4C4C4">{{ city.name }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>

    <tab-bar />
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import Taro, { useRouter } from '@tarojs/taro'
import { THEATERS } from '@/data/theaters'
import TabBar from '@/components/tab-bar.vue'

const router = useRouter()
const { cityId } = router.params

const ALL_CITIES = [
  { id: 'beijing',      name: '北京' },
  { id: 'shanghai',     name: '上海' },
  { id: 'tianjin',      name: '天津' },
  { id: 'chongqing',    name: '重庆' },
  { id: 'guangzhou',    name: '广州' },
  { id: 'shenzhen',     name: '深圳' },
  { id: 'hangzhou',     name: '杭州' },
  { id: 'suzhou',       name: '苏州' },
  { id: 'chengdu',      name: '成都' },
  { id: 'wuhan',        name: '武汉' },
  { id: 'xian',         name: '西安' },
  { id: 'nanjing',      name: '南京' },
  { id: 'shenyang',     name: '沈阳' },
  { id: 'changchun',    name: '长春' },
  { id: 'harbin',       name: '哈尔滨' },
  { id: 'jinan',        name: '济南' },
  { id: 'zhengzhou',    name: '郑州' },
  { id: 'hefei',        name: '合肥' },
  { id: 'changsha',     name: '长沙' },
  { id: 'fuzhou',       name: '福州' },
  { id: 'nanchang',     name: '南昌' },
  { id: 'nanning',      name: '南宁' },
  { id: 'kunming',      name: '昆明' },
  { id: 'guiyang',      name: '贵阳' },
  { id: 'lanzhou',      name: '兰州' },
  { id: 'xining',       name: '西宁' },
  { id: 'yinchuan',     name: '银川' },
  { id: 'urumqi',       name: '乌鲁木齐' },
  { id: 'hohhot',       name: '呼和浩特' },
  { id: 'shijiazhuang', name: '石家庄' },
  { id: 'taiyuan',      name: '太原' },
  { id: 'haikou',       name: '海口' },
  { id: 'qingdao',      name: '青岛' },
]

const citiesWithData = computed(() => ALL_CITIES.filter(c => THEATERS.some(t => t.cityId === c.id)))
const citiesWithoutData = computed(() => ALL_CITIES.filter(c => !THEATERS.some(t => t.cityId === c.id)))

const firstWithData = ALL_CITIES.find(c => THEATERS.some(t => t.cityId === c.id))?.id || ALL_CITIES[0].id
const selectedCity = ref(cityId || firstWithData)
const keyword = ref('')
const showCityPicker = ref(false)

const selectedCityName = computed(() => ALL_CITIES.find(c => c.id === selectedCity.value)?.name || '选择城市')

function selectCity(id) {
  selectedCity.value = id
  keyword.value = ''
  showCityPicker.value = false
}

const saved = ref(JSON.parse(Taro.getStorageSync('saved_theaters') || '[]'))
function isSaved(id) { return saved.value.includes(id) }
function toggleSave(id) {
  if (isSaved(id)) {
    saved.value = saved.value.filter(x => x !== id)
    Taro.showToast({ title: '已取消收藏', icon: 'none', duration: 1000 })
  } else {
    saved.value = [...saved.value, id]
    Taro.showToast({ title: '已收藏', icon: 'none', duration: 1000 })
  }
  Taro.setStorageSync('saved_theaters', JSON.stringify(saved.value))
}

const filtered = computed(() => {
  let list = THEATERS.filter(t => t.cityId === selectedCity.value).map(t => ({ ...t, halls: undefined }))
  const kw = keyword.value.trim().toLowerCase()
  if (kw) list = list.filter(t => t.name.toLowerCase().includes(kw) || (t.tags || []).some(g => g.includes(kw)))
  return list
})

function goDetail(id) {
  Taro.navigateTo({ url: `/pages/theater-detail/index?id=${id}` })
}
function goBack() {
  Taro.navigateBack()
}
</script>
