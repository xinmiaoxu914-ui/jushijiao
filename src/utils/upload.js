const CLOUD_NAME = process.env.TARO_APP_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.TARO_APP_CLOUDINARY_UPLOAD_PRESET
const SUPABASE_URL = process.env.TARO_APP_SUPABASE_URL
const SUPABASE_KEY = process.env.TARO_APP_SUPABASE_ANON_KEY

const supabaseHeaders = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
}

/**
 * 把本地图片（blob URL 或 base64）上传到 Cloudinary，返回可访问的 https URL
 */
export async function uploadImage(filePath) {
  const res = await fetch(filePath)
  const blob = await res.blob()

  const formData = new FormData()
  formData.append('file', blob)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'jushijiao')

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )
  if (!uploadRes.ok) throw new Error('图片上传失败，请检查网络')
  const data = await uploadRes.json()
  return data.secure_url
}

/**
 * 保存一条座位视角记录到 Supabase
 */
export async function saveSeatPhoto({ seatId, theaterId, imageUrl, quality }) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/seat_photos`, {
    method: 'POST',
    headers: { ...supabaseHeaders, 'Prefer': 'return=minimal' },
    body: JSON.stringify({
      seat_id: seatId,
      theater_id: theaterId,
      image_url: imageUrl,
      quality,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error('记录保存失败：' + err)
  }
}

/**
 * 查询某个座位的所有视角图
 */
export async function fetchSeatPhotos(seatId) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/seat_photos?seat_id=eq.${encodeURIComponent(seatId)}&order=created_at.desc`,
    { headers: supabaseHeaders }
  )
  if (!res.ok) return []
  const rows = await res.json()
  return rows.map(r => ({
    imageUrl: r.image_url,
    quality: r.quality,
    date: r.created_at ? r.created_at.split('T')[0] : '',
  }))
}
