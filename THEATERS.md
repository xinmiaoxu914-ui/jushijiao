# 剧视角 · 剧院数据维护手册

## 项目概述

面向剧迷的座位视角分享小程序（H5），用户可以按城市浏览剧院、查看座位视角图、上传自拍视角、撰写评价。

**技术栈**：Taro 4.1.5 + Vue 3 + TailwindCSS → 编译至 H5（千岛平台）

---

## 目录结构

```
src/
├── app.config.js              # 全局页面注册、导航栏配置
├── components/
│   └── tab-bar.vue            # 底部两 tab（剧场视野 / 我的视野）
├── data/
│   └── theaters.js            # ⭐ 所有剧院数据（修改图片在这里）
└── pages/
    ├── index/                 # Tab1：剧场视野（城市选择 + 搜索）
    ├── theater-list/          # 城市剧院列表（2列网格 + 城市下拉弹窗）
    ├── theater-detail/        # 剧院详情（座位图 / 信息 / 评价三个 tab）
    ├── seat-view/             # 单个座位视角页（查看 + 上传照片）
    ├── review-write/          # 写评价
    └── profile/               # Tab2：我的视野（收藏剧院 + 上传记录）
```

---

## 修改剧院封面图

### 文件位置

```
src/data/theaters.js
```

### 每条剧院数据结构

```js
{
  id: 'theater_id',          // 唯一标识，不要修改
  name: '剧院名称',
  cityId: 'shanghai',        // 城市 ID
  cover: 'https://...',      // ← 封面图 URL，改这里
  address: '地址',
  rating: 4.8,
  reviewCount: 520,
  tags: ['标签1', '标签2'],
  description: '简介...',
  transport: '交通信息',
  phone: '021-XXXXXXXX',
  halls: [ ... ],            // 大厅 & 座位区段（一般不需要改）
}
```

### 图片 URL 格式说明

| 来源 | 格式示例 | 说明 |
|------|---------|------|
| **百度百科 CDN（pic）** | `https://bkimg.cdn.bcebos.com/pic/{40位hash}` | 直接用，无需参数，**最稳定推荐** |
| **百度百科 CDN（smart）** | `https://bkimg.cdn.bcebos.com/smart/{hash}-bkimg-process,v_1,rw_600,rh_400,maxl_800` | 带裁剪参数，可调整 rw/rh/maxl |
| **Unsplash** | `https://images.unsplash.com/photo-{id}?w=800&q=80` | 调整 `w=` 控制宽度 |
| **携程图片（c-ctrip）** | `https://dimg04.c-ctrip.com/images/{path}.jpg` | 注意去掉末尾的 `_D_180_180` 缩略图后缀 |

> **推荐做法**：在百度百科搜索剧院名称，点击页面中的图片，从浏览器地址栏复制以 `bkimg.cdn.bcebos.com` 开头的 URL，粘贴到 `cover:` 字段。`pic/` 格式的 URL 最稳定，无需添加任何参数。

### 快速替换步骤

1. 打开 `src/data/theaters.js`
2. `Cmd+F` 搜索剧院的 `id`（如 `sh_wanping`）
3. 找到 `cover:` 那一行，替换引号内的 URL
4. 保存文件，刷新预览即可

**示例：**
```js
// 修改前
id: 'sh_wanping', name: '宛平剧院', cityId: 'shanghai',
cover: 'https://bkimg.cdn.bcebos.com/smart/b8014a90...',

// 修改后
id: 'sh_wanping', name: '宛平剧院', cityId: 'shanghai',
cover: 'https://bkimg.cdn.bcebos.com/pic/替换为真实hash',
```

---

## 全部剧院图片速查表（共 47 家）

### 北京 `beijing`（4 家）

| id | 剧院名称 | 当前图片来源 | 状态 |
|----|---------|------------|------|
| `ncpa_opera` | 国家大剧院·歌剧院 | Unsplash 占位 | ⚠️ 需替换 |
| `ncpa_theater` | 国家大剧院·戏剧场 | Unsplash 占位 | ⚠️ 需替换 |
| `tianqiao` | 天桥艺术中心·大剧场 | Unsplash 占位 | ⚠️ 需替换 |
| `capital_theater` | 首都剧场 | Unsplash 占位 | ⚠️ 需替换 |

### 上海 `shanghai`（35 家）

| id | 剧院名称 | 当前图片来源 | 状态 |
|----|---------|------------|------|
| `shanghai_theater` | 上海大剧院·大剧场 | 百度百科 pic | ✅ |
| `shcs` | 上海文化广场·主剧场 | 文化广场官网 CDN | ✅ |
| `meiki` | 美琪大戏院 | 携程 | ✅ |
| `lanxin` | 兰心大戏院 | 百度百科 pic | ✅ |
| `shangju` | 上剧场 | 百度百科 pic | ✅ |
| `sh_dongfang` | 上海东方艺术中心·歌剧厅 | 百度百科 smart | 待确认 |
| `sh_renmin` | 人民大舞台 | 百度百科 pic | ✅ |
| `sh_yihai` | 艺海剧院·大剧场 | 百度百科 pic | ✅ |
| `sh_beiwaitan` | 北外滩友邦大剧院 | 百度百科 pic | ✅ |
| `sh_shuyuanlu` | 上海音乐学院·上音歌剧院 | 百度百科 pic | ⚠️ 当前为上音校园图，可换歌剧院实景 |
| `sh_poly` | 上海保利大剧院 | 百度百科 pic | 待确认 |
| `sh_qianjiao` | 前滩31演艺中心·大剧场 | 携程 | ✅ |
| `sh_wanping` | 宛平剧院 | 百度百科 smart | 待确认 |
| `sh_changjiang` | 长江剧场 | 百度百科 pic | ✅ |
| `sh_jiuketree` | 九棵树未来艺术中心 | 百度百科 smart | ✅ |
| `sh_huaju_art` | 上海话剧艺术中心·艺术剧院 | 百度百科 smart | ✅ |
| `sh_huangpu` | 黄浦剧场 | 携程 | ✅ |
| `sh_1933` | 1933老场坊·空中剧院 | 百度百科 pic | ✅ |
| `sh_dance` | 上海舞蹈中心·大剧场 | 百度百科 smart | ✅ |
| `sh_asia_star` | 亚洲大厦·Star Theatre | 腾讯新闻图片 | ⚠️ 链接可能失效，建议替换 |
| `sh_jiucheng` | 久事·上海商城剧院 | 携程 | ✅ |
| `sh_tianchang` | 天蟾逸夫舞台 | 百度百科 pic | ✅ |
| `sh_shanghai_da` | 上海大剧院·中剧场 | 百度百科 pic | ⚠️ 与 `shanghai_theater` 图片相同，建议替换 |
| `sh_music_hall` | 凯迪拉克·上海音乐厅 | 百度百科 smart | 待确认 |
| `sh_yifu` | 上海逸夫舞台 | 百度百科 pic | ✅ |
| `sh_daning` | 大宁剧院·大剧场 | 百度百科 smart | ✅ |
| `sh_gongwutai` | 共舞台 | 百度百科 pic | 待确认 |
| `sh_hongqiao_art` | 虹桥艺术中心·大剧场 | 携程 | ✅ |
| `sh_dongfang_music` | 上海东方艺术中心·音乐厅 | 百度百科 smart | ✅ |
| `sh_intl_dance` | 上海国际舞蹈中心·大剧场 | 百度百科 smart | ✅ |
| `sh_capa` | 上海儿童艺术剧场（CAPA） | 百度百科 smart | 待确认 |
| `sh_poly_songjiang` | 松江保利大剧院 | 携程 | ✅ |
| `sh_shtx` | 上海戏剧学院·端钧剧场 | 百度百科 pic | ✅ |
| `sh_xintiandi_art` | 新天地·壹号美术馆剧场 | 腾讯新闻图片 | ⚠️ 链接可能失效，建议替换 |
| `sh_xuhui_theater` | 徐汇艺术馆·大剧场 | 携程 | ✅ |

### 广州 `guangzhou`（2 家）

| id | 剧院名称 | 当前图片来源 | 状态 |
|----|---------|------------|------|
| `gz_opera` | 广州大剧院·歌剧厅 | Unsplash 占位 | ⚠️ 需替换 |
| `youyi` | 友谊剧院 | Unsplash 占位 | ⚠️ 需替换 |

### 深圳 `shenzhen`（2 家）

| id | 剧院名称 | 当前图片来源 | 状态 |
|----|---------|------------|------|
| `sz_art` | 深圳湾艺术中心·歌剧厅 | Unsplash 占位 | ⚠️ 需替换 |
| `sz_poly` | 深圳保利剧院 | Unsplash 占位 | ⚠️ 需替换 |

### 杭州 `hangzhou`（2 家）

| id | 剧院名称 | 当前图片来源 | 状态 |
|----|---------|------------|------|
| `hz_opera` | 杭州大剧院·歌剧厅 | Unsplash 占位 | ⚠️ 需替换 |
| `meixihu` | 梅溪湖国际文化艺术中心 | Unsplash 占位 | ⚠️ 需替换 |

### 苏州 `suzhou`（2 家）

| id | 剧院名称 | 当前图片来源 | 状态 |
|----|---------|------------|------|
| `sz_culture` | 苏州文化艺术中心·大剧院 | Unsplash 占位 | ⚠️ 需替换 |
| `suzhouwan` | 苏州湾大剧院 | Unsplash 占位 | ⚠️ 需替换 |

---

## 新增剧院模板

在 `src/data/theaters.js` 对应城市区块末尾，复制以下模板：

```js
{
  id: 'sh_新剧院',                          // 全局唯一，建议：城市缩写_英文简称
  name: '剧院全称',
  cityId: 'shanghai',                       // 所属城市 ID
  cover: 'https://bkimg.cdn.bcebos.com/pic/替换为真实hash',
  address: '上海市XX区XX路XX号',
  rating: 4.5,
  reviewCount: 0,
  tags: ['标签1', '标签2'],
  description: '剧院简介，2-3句话。',
  transport: '地铁X号线XX站步行约X分钟',
  phone: '021-XXXXXXXX',
  halls: [{ id: 'h1', name: '大剧场', capacity: 1000, sections: buildSections([
    { id: 'A', name: '池座前区', type: 'orchestra', rows: 10, seatsPerRow: 30 },
    { id: 'B', name: '池座后区', type: 'orchestra', rows: 10, seatsPerRow: 32 },
    { id: 'C', name: '楼座',    type: 'mezzanine', rows:  6, seatsPerRow: 34 },
  ])}],
},
```

**`type` 可选值**：`orchestra`（池座）/ `mezzanine`（二楼/包厢）/ `balcony`（三楼/楼座）

---

## 优先需要修复的图片

| 优先级 | 涉及剧院 | 问题描述 |
|--------|---------|---------|
| 🔴 高 | 北京 4 家（`ncpa_opera` 等） | 全部为 Unsplash 随机图，与剧院无关 |
| 🔴 高 | 广深杭苏 8 家 | 全部为 Unsplash 随机图，与剧院无关 |
| 🟡 中 | `sh_shanghai_da`（中剧场） | 与大剧场图片完全相同，需换独立图片 |
| 🟡 中 | `sh_asia_star`、`sh_xintiandi_art` | 腾讯新闻图片 CDN，链接不稳定 |
| 🟢 低 | `sh_shuyuanlu`（上音歌剧院） | 当前为校园图，非歌剧院实景 |
