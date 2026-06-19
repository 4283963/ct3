import type { FormSchema } from '@/types'

export interface FormPortPackage {
  version: string
  schema: FormSchema
  data: Record<string, unknown>
  exportedAt: number
}

const CURRENT_VERSION = '1.0.0'
const FILE_MAGIC = 'FORM_PORT'
const FILE_EXT = '.formpkg'

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export async function exportFormPackage(
  schema: FormSchema,
  data: Record<string, unknown>
): Promise<Blob> {
  const pkg: FormPortPackage = {
    version: CURRENT_VERSION,
    schema,
    data,
    exportedAt: Date.now()
  }
  const jsonStr = JSON.stringify(pkg)
  const encoder = new TextEncoder()
  const inputBytes = encoder.encode(jsonStr)

  if ('CompressionStream' in window) {
    const stream = new Blob([inputBytes] as BlobPart[]).stream().pipeThrough(new CompressionStream('gzip'))
    const reader = stream.getReader()
    const chunks: Uint8Array[] = []
    let result: ReadableStreamReadResult<Uint8Array>
    do {
      result = await reader.read()
      if (result.value) chunks.push(result.value)
    } while (!result.done)

    const totalLen = chunks.reduce((sum, c) => sum + c.length, 0)
    const compressed = new Uint8Array(totalLen)
    let offset = 0
    chunks.forEach(c => {
      compressed.set(c, offset)
      offset += c.length
    })
    const base64 = uint8ArrayToBase64(compressed)
    const content = `${FILE_MAGIC}:${CURRENT_VERSION}:${base64}`
    return new Blob([content], { type: 'application/x-form-package' })
  } else {
    const base64 = uint8ArrayToBase64(inputBytes)
    const content = `${FILE_MAGIC}:${CURRENT_VERSION}:${base64}`
    return new Blob([content], { type: 'application/x-form-package' })
  }
}

export async function importFormPackage(file: File | Blob): Promise<FormPortPackage> {
  const text = await file.text()
  const parts = text.split(':')
  if (parts.length !== 3 || parts[0] !== FILE_MAGIC) {
    throw new Error('无效的表单配置文件格式')
  }
  const [, version, base64] = parts
  const bytes = base64ToUint8Array(base64)

  let jsonStr: string
  if ('DecompressionStream' in window && version === CURRENT_VERSION) {
    try {
      const stream = new Blob([bytes] as BlobPart[]).stream().pipeThrough(new DecompressionStream('gzip'))
      const reader = stream.getReader()
      const chunks: Uint8Array[] = []
      let result: ReadableStreamReadResult<Uint8Array>
      do {
        result = await reader.read()
        if (result.value) chunks.push(result.value)
      } while (!result.done)

      const totalLen = chunks.reduce((sum, c) => sum + c.length, 0)
      const decompressed = new Uint8Array(totalLen)
      let offset = 0
      chunks.forEach(c => {
        decompressed.set(c, offset)
        offset += c.length
      })
      const decoder = new TextDecoder()
      jsonStr = decoder.decode(decompressed)
    } catch {
      const decoder = new TextDecoder()
      jsonStr = decoder.decode(bytes)
    }
  } else {
    const decoder = new TextDecoder()
    jsonStr = decoder.decode(bytes)
  }

  const pkg = JSON.parse(jsonStr) as FormPortPackage;

  if (!pkg.schema || !pkg.data) {
    throw new Error('配置文件格式不正确')
  }
  return pkg
}

export function downloadFormPackage(blob: Blob, fileName?: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName || `form-${Date.now()}${FILE_EXT}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function triggerFileInput(accept = '.formpkg'): Promise<File> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.style.display = 'none'
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) {
        resolve(file)
      } else {
        reject(new Error('未选择文件'))
      }
      document.body.removeChild(input)
    }
    input.oncancel = () => {
      reject(new Error('取消选择'))
      document.body.removeChild(input)
    }
    document.body.appendChild(input)
    input.click()
  })
}

export function validateFormPackage(pkg: FormPortPackage): boolean {
  return !!(
    pkg.version &&
    pkg.schema &&
    pkg.schema.fields &&
    Array.isArray(pkg.schema.fields) &&
    pkg.data &&
    typeof pkg.data === 'object'
  )
}
