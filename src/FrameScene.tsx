import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useLanguage } from './i18n'

type FrameSpec = {
  image: string
  width: number
  height: number
  x: number
  y: number
  z: number
  turn: number
  roll: number
  finish: 'walnut' | 'black'
}

const specs: FrameSpec[] = [
  { image: '/images/wedding-hands.jpg', width: 2.45, height: 3.12, x: -2.48, y: -0.75, z: -1.25, turn: 0.22, roll: -0.09, finish: 'black' },
  { image: '/images/ak-demo-collage.jpg', width: 2.37, height: 3.08, x: 2.67, y: 0.79, z: -1.5, turn: -0.19, roll: 0.1, finish: 'walnut' },
  { image: '/images/family-sunset.jpg', width: 4.55, height: 3.27, x: 0.25, y: 0.02, z: 0.65, turn: -0.08, roll: 0.025, finish: 'walnut' },
]

function addFrame(scene: THREE.Group, spec: FrameSpec, textures: THREE.Texture[]) {
  const frame = new THREE.Group()
  frame.position.set(spec.x, spec.y, spec.z)
  frame.rotation.set(-0.025, spec.turn, spec.roll)
  scene.add(frame)

  const wood = new THREE.MeshStandardMaterial({
    color: spec.finish === 'black' ? 0x22221e : 0x32271e,
    roughness: 0.68,
    metalness: 0.05,
  })
  const edge = new THREE.MeshStandardMaterial({ color: 0x9b8057, roughness: 0.36, metalness: 0.55 })
  const mat = new THREE.MeshStandardMaterial({ color: 0xd6d0c1, roughness: 0.95 })
  const darkBack = new THREE.MeshStandardMaterial({ color: 0x171715, roughness: 0.8 })
  const outerW = spec.width + 0.48
  const outerH = spec.height + 0.48

  const backing = new THREE.Mesh(new THREE.BoxGeometry(outerW, outerH, 0.18), darkBack)
  backing.position.z = -0.09
  frame.add(backing)

  const matBoard = new THREE.Mesh(new THREE.BoxGeometry(spec.width, spec.height, 0.026), mat)
  matBoard.position.z = 0.015
  frame.add(matBoard)

  const photoW = spec.width - 0.33
  const photoH = spec.height - 0.33
  const photoMaterial = new THREE.MeshBasicMaterial({ color: 0xf2ece0 })
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(photoW, photoH), photoMaterial)
  photo.position.z = 0.033
  frame.add(photo)

  new THREE.TextureLoader().load(spec.image, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    const image = texture.image as HTMLImageElement
    const sourceAspect = image.naturalWidth / image.naturalHeight
    const targetAspect = photoW / photoH
    if (sourceAspect > targetAspect) {
      texture.repeat.x = targetAspect / sourceAspect
      texture.offset.x = (1 - texture.repeat.x) / 2
    } else {
      texture.repeat.y = sourceAspect / targetAspect
      texture.offset.y = (1 - texture.repeat.y) / 2
    }
    photoMaterial.map = texture
    photoMaterial.needsUpdate = true
    textures.push(texture)
  })

  const rail = 0.24
  const depth = 0.29
  const addRail = (width: number, height: number, x: number, y: number, material: THREE.Material, z = 0.12) => {
    const piece = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)
    piece.position.set(x, y, z)
    frame.add(piece)
  }
  addRail(outerW, rail, 0, outerH / 2 - rail / 2, wood)
  addRail(outerW, rail, 0, -outerH / 2 + rail / 2, wood)
  addRail(rail, outerH - rail * 2, -outerW / 2 + rail / 2, 0, wood)
  addRail(rail, outerH - rail * 2, outerW / 2 - rail / 2, 0, wood)

  const line = 0.018
  const insetW = outerW - rail * 2 + line
  const insetH = outerH - rail * 2 + line
  const addEdge = (width: number, height: number, x: number, y: number) => {
    const piece = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.016), edge)
    piece.position.set(x, y, 0.275)
    frame.add(piece)
  }
  addEdge(insetW, line, 0, insetH / 2)
  addEdge(insetW, line, 0, -insetH / 2)
  addEdge(line, insetH, -insetW / 2, 0)
  addEdge(line, insetH, insetW / 2, 0)
  return frame
}

export default function FrameScene() {
  const { t } = useLanguage()
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = host.current
    if (!element || window.matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)').matches) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.55
    renderer.domElement.setAttribute('aria-hidden', 'true')
    element.appendChild(renderer.domElement)
    element.dataset.ready = 'true'

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-4.9, 4.9, 3.8, -3.8, 0.1, 100)
    camera.position.set(0, 0, 12)
    camera.lookAt(0, 0, 0)
    const gallery = new THREE.Group()
    scene.add(gallery)
    scene.add(new THREE.AmbientLight(0xffffff, 2.15))
    const key = new THREE.DirectionalLight(0xffe7c5, 3.3)
    key.position.set(-3, 5, 9)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 1.1)
    fill.position.set(4, -2, 6)
    scene.add(fill)

    const textures: THREE.Texture[] = []
    const frames = specs.map((spec) => addFrame(gallery, spec, textures))
    let pointerX = 0
    let pointerY = 0
    let scroll = 0
    let raf = 0
    let visible = true
    const clock = new THREE.Clock()

    const resize = () => {
      const { width, height } = element.getBoundingClientRect()
      if (!width || !height) return
      const aspect = width / height
      const vertical = 7.5
      camera.left = -vertical * aspect / 2
      camera.right = vertical * aspect / 2
      camera.top = vertical / 2
      camera.bottom = -vertical / 2
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    resize()

    const onPointer = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 2
      pointerY = (event.clientY / window.innerHeight - 0.5) * 2
    }
    const onScroll = () => { scroll = Math.min(window.scrollY / window.innerHeight, 1.5) }
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0 })
    visibility.observe(element)
    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!visible) return
      const elapsed = clock.getElapsedTime()
      gallery.rotation.y += ((pointerX * 0.045 + scroll * 0.09) - gallery.rotation.y) * 0.035
      gallery.rotation.x += ((-pointerY * 0.025 - scroll * 0.035) - gallery.rotation.x) * 0.035
      gallery.position.y += ((scroll * 0.38) - gallery.position.y) * 0.035
      frames[0].position.y = specs[0].y + Math.sin(elapsed * 0.62) * 0.055
      frames[1].position.y = specs[1].y + Math.sin(elapsed * 0.55 + 1.7) * 0.06
      frames[2].position.y = specs[2].y + Math.sin(elapsed * 0.7 + 0.6) * 0.045
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      visibility.disconnect()
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('scroll', onScroll)
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
      textures.forEach((texture) => texture.dispose())
      renderer.dispose()
      renderer.domElement.remove()
      delete element.dataset.ready
    }
  }, [])

  return (
    <div className="frame-scene" ref={host} aria-label={t('Three dimensional arrangement of custom photo frames')}>
      <div className="frame-scene-fallback" aria-hidden="true">
        <div className="fallback-frame fallback-frame-back"><img src="/images/wedding-hands.jpg" alt="" /></div>
        <div className="fallback-frame fallback-frame-front"><img src="/images/family-sunset.jpg" alt="" /></div>
      </div>
    </div>
  )
}
