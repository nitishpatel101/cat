// Generates the site's product imagery with Kie's GPT Image 2 API.
// Usage: KIE_API_KEY in .env.local, then `node scripts/generate-images.mjs [--only name] [--force]`.
// The pouch packshot is made first and uploaded, then used as a reference so every scene shows the same pouch.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const API = 'https://api.kie.ai/api/v1'
const UPLOAD = 'https://kieai.redpandaai.co/api/file-stream-upload'
const OUT = new URL('../image-sources/', import.meta.url)
mkdirSync(OUT, { recursive: true })

function apiKey() {
  if (process.env.KIE_API_KEY) return process.env.KIE_API_KEY
  const envFile = new URL('../.env.local', import.meta.url)
  if (existsSync(envFile)) {
    const match = readFileSync(envFile, 'utf8').match(/^KIE_API_KEY\s*=\s*"?([^"\n]+)"?/m)
    if (match) return match[1].trim()
  }
  throw new Error('KIE_API_KEY is missing. Add it to .env.local as KIE_API_KEY=your-key')
}
const KEY = apiKey()
const auth = { Authorization: `Bearer ${KEY}` }

const POUCH = `a matte hot-pink stand-up pouch of premium dry cat food with a white zip top and rounded corners. The front shows a large white lowercase wordmark "mochi" in a bold, condensed, friendly grotesque typeface. Below it, a simple flat illustration of a fluffy white kitten face with big round brown eyes and a tiny smile. Small white text at the bottom reads "Salmon & Chicken Crunch" and "1.5 kg". Clean, modern, premium packaging design`

const PINK = 'a seamless hot pink studio backdrop (#EC2F69) with soft, even light and a gentle vignette'

const JOBS = [
  {
    name: 'pouch',
    model: 'gpt-image-2-text-to-image',
    input: {
      prompt: `Studio product photograph of ${POUCH}. The pouch stands upright, facing the camera straight on, softly lit, crisp label, realistic material texture. Isolated on a transparent background, no shadow.`,
      aspect_ratio: '2:3',
      resolution: '1K',
      background: 'transparent',
    },
  },
  {
    name: 'kitten-hug',
    usesPouch: true,
    model: 'gpt-image-2-image-to-image',
    input: {
      prompt: `Top-down photograph, shot from directly above. A fluffy white kitten lies on its back, eyes closed in a blissful sleepy smile, hugging the pink cat food pouch from the reference image to its chest with both front paws; its pink toe beans on the back paws face the camera and its tail curls to one side. Heart-shaped brown kibble is scattered in a loose halo around the kitten. Background: ${PINK}. Photorealistic, soft natural fur detail, shallow depth of field, advertising photography. Keep the pouch design exactly as in the reference.`,
      aspect_ratio: '3:4',
      resolution: '2K',
    },
  },
  {
    name: 'pouch-float',
    usesPouch: true,
    model: 'gpt-image-2-image-to-image',
    input: {
      prompt: `Dynamic advertising photograph. The pink cat food pouch from the reference image floats in mid-air, tilted about 12 degrees, centred. Heart-shaped brown kibble pieces fly around it at different depths: some sharp, some large and blurred in the foreground corners. A fluffy white cat paw reaches in from the top right corner toward the pouch. Background: a rich magenta-to-deep-plum gradient (#EC2F69 fading to #5A0B3A) with soft rim light. Photorealistic, high-end pet food campaign. Keep the pouch design exactly as in the reference.`,
      aspect_ratio: '3:4',
      resolution: '2K',
    },
  },
  {
    name: 'cat-bowl',
    usesPouch: true,
    model: 'gpt-image-2-image-to-image',
    input: {
      prompt: `Photograph of a fluffy white cat with big brown eyes happily eating heart-shaped brown kibble from a glossy pale-pink ceramic bowl on the floor. The pink cat food pouch from the reference image stands just behind the bowl, slightly out of focus. A few kibble pieces are scattered on the floor. Background: ${PINK}. Eye-level camera, warm soft light, photorealistic, advertising photography. Keep the pouch design exactly as in the reference.`,
      aspect_ratio: '3:2',
      resolution: '2K',
    },
  },
  {
    name: 'kibble',
    model: 'gpt-image-2-text-to-image',
    input: {
      prompt: 'Three pieces of heart-shaped brown dry cat food kibble, photographed close up, crisp and realistic, slightly different angles, arranged loosely apart from each other. Isolated on a transparent background, no shadow.',
      aspect_ratio: '1:1',
      resolution: '1K',
      background: 'transparent',
    },
  },
]

const args = process.argv.slice(2)
const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null
const force = args.includes('--force')

async function json(response) {
  const body = await response.json().catch(() => ({}))
  if (!response.ok || (body.code && body.code !== 200)) {
    throw new Error(`${response.status} ${body.msg ?? JSON.stringify(body)}`)
  }
  return body
}

async function createTask(job, inputUrls) {
  const input = { ...job.input }
  if (inputUrls) input.input_urls = inputUrls
  const body = await json(
    await fetch(`${API}/jobs/createTask`, {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: job.model, input }),
    }),
  )
  return body.data.taskId
}

async function waitFor(taskId, name) {
  for (let attempt = 0; attempt < 120; attempt++) {
    await new Promise((r) => setTimeout(r, 5000))
    const body = await json(await fetch(`${API}/jobs/recordInfo?taskId=${taskId}`, { headers: auth }))
    const { state, resultJson, failMsg } = body.data
    if (state === 'success') return JSON.parse(resultJson).resultUrls[0]
    if (state === 'fail') throw new Error(`${name} failed: ${failMsg}`)
    if (attempt % 6 === 0) console.log(`  ${name}: ${state}…`)
  }
  throw new Error(`${name} timed out`)
}

async function download(url, name) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`download ${name}: ${response.status}`)
  const file = new URL(`${name}.png`, OUT)
  writeFileSync(file, Buffer.from(await response.arrayBuffer()))
  return file
}

async function upload(file) {
  const form = new FormData()
  form.append('file', new Blob([readFileSync(file)], { type: 'image/png' }), 'mochi-pouch.png')
  form.append('uploadPath', 'mochi')
  form.append('fileName', 'mochi-pouch.png')
  const body = await json(await fetch(UPLOAD, { method: 'POST', headers: auth, body: form }))
  return body.data.fileUrl ?? body.data.downloadUrl
}

async function run(job, pouchUrl) {
  const target = new URL(`${job.name}.png`, OUT)
  if (existsSync(target) && !force && only !== job.name) {
    console.log(`✓ ${job.name} (already generated)`)
    return
  }
  console.log(`→ ${job.name}`)
  const taskId = await createTask(job, job.usesPouch ? [pouchUrl] : null)
  const url = await waitFor(taskId, job.name)
  await download(url, job.name)
  console.log(`✓ ${job.name}`)
}

const selected = JOBS.filter((job) => !only || job.name === only)
const pouchJob = JOBS[0]
const pouchFile = new URL('pouch.png', OUT)
if (selected.some((job) => job.name === 'pouch') || !existsSync(pouchFile)) await run(pouchJob)

const needsPouch = selected.some((job) => job.usesPouch)
const pouchUrl = needsPouch ? await upload(pouchFile) : null
const results = await Promise.allSettled(selected.filter((job) => job.name !== 'pouch').map((job) => run(job, pouchUrl)))
results.forEach((r) => r.status === 'rejected' && console.error('✗', r.reason.message))
