// Animates two existing product photos into 5-second clips with Kling 2.6 on Kie.
// Usage: KIE_API_KEY in .env.local, then `node scripts/generate-videos.mjs [--only name]`.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const API = 'https://api.kie.ai/api/v1'
const UPLOAD = 'https://kieai.redpandaai.co/api/file-stream-upload'
const DIR = new URL('../video-sources/', import.meta.url)

const envFile = new URL('../.env.local', import.meta.url)
const KEY =
  process.env.KIE_API_KEY ??
  (existsSync(envFile) ? readFileSync(envFile, 'utf8').match(/^KIE_API_KEY\s*=\s*"?([^"\n]+)"?/m)?.[1].trim() : null)
if (!KEY) throw new Error('KIE_API_KEY is missing from .env.local')
const auth = { Authorization: `Bearer ${KEY}` }

const JOBS = [
  {
    name: 'kitten-hug',
    prompt:
      'Locked-off overhead camera, no camera movement. The fluffy white kitten lying on its back breathes slowly and peacefully, its chest rising and falling, whiskers and ear tips twitching slightly, back paws flexing gently, the tip of its tail curling softly. It keeps hugging the pink bag, eyes closed and content. The kibble and pink background stay completely still. Calm, cozy, subtle, realistic motion.',
  },
  {
    name: 'pouch-float',
    prompt:
      'Locked-off camera, no zoom or pan. The pink cat food bag floats and bobs gently in mid-air, rotating a few degrees back and forth. The heart-shaped kibble pieces drift slowly upward and tumble in slow motion at different depths. The fluffy white cat paw reaches in playfully and taps toward the bag. Dreamy, smooth, slow, premium advertising motion. Keep the bag label unchanged.',
  },
]

const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null

async function json(response) {
  const body = await response.json().catch(() => ({}))
  if (!response.ok || (body.code && body.code !== 200)) throw new Error(`${response.status} ${body.msg ?? JSON.stringify(body)}`)
  return body
}

async function upload(name) {
  const form = new FormData()
  form.append('file', new Blob([readFileSync(new URL(`${name}.jpg`, DIR))], { type: 'image/jpeg' }), `${name}.jpg`)
  form.append('uploadPath', 'mochi')
  form.append('fileName', `${name}.jpg`)
  const body = await json(await fetch(UPLOAD, { method: 'POST', headers: auth, body: form }))
  return body.data.fileUrl ?? body.data.downloadUrl
}

async function run(job) {
  const target = new URL(`${job.name}.mp4`, DIR)
  if (existsSync(target) && only !== job.name) return console.log(`✓ ${job.name} (already generated)`)
  console.log(`→ ${job.name}`)
  const imageUrl = await upload(job.name)
  const created = await json(
    await fetch(`${API}/jobs/createTask`, {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'kling-2.6/image-to-video',
        input: { prompt: job.prompt, image_urls: [imageUrl], sound: false, duration: '5' },
      }),
    }),
  )
  const taskId = created.data.taskId
  for (let attempt = 0; attempt < 180; attempt++) {
    await new Promise((r) => setTimeout(r, 6000))
    const body = await json(await fetch(`${API}/jobs/recordInfo?taskId=${taskId}`, { headers: auth }))
    const { state, resultJson, failMsg } = body.data
    if (state === 'fail') throw new Error(`${job.name} failed: ${failMsg}`)
    if (state === 'success') {
      const url = JSON.parse(resultJson).resultUrls[0]
      writeFileSync(target, Buffer.from(await (await fetch(url)).arrayBuffer()))
      return console.log(`✓ ${job.name}`)
    }
    if (attempt % 10 === 0) console.log(`  ${job.name}: ${state}…`)
  }
  throw new Error(`${job.name} timed out`)
}

const results = await Promise.allSettled(JOBS.filter((j) => !only || j.name === only).map(run))
results.forEach((r) => r.status === 'rejected' && console.error('✗', r.reason.message))
