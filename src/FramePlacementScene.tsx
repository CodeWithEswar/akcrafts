import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useLanguage } from './i18n'

type Placement = 'wall' | 'shelf'
type Props = {
  scale: number
  placement: Placement
  explore: boolean
  rotation: number
  tilt: number
  onRotate: (horizontal: number, vertical: number) => void
}

function canvasTexture(width: number, height: number, draw: (context: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')!
  draw(context)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

function makeWallTexture() {
  return canvasTexture(320, 320, (context) => {
    context.fillStyle = '#d8d3c6'
    context.fillRect(0, 0, 320, 320)
    const image = context.getImageData(0, 0, 320, 320)
    let seed = 31337
    for (let i = 0; i < image.data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0
      const grain = (seed % 17) - 8
      image.data[i] += grain
      image.data[i + 1] += grain
      image.data[i + 2] += grain
    }
    context.putImageData(image, 0, 0)
    for (let i = 0; i < 80; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0
      const x = seed % 320
      seed = (seed * 1664525 + 1013904223) >>> 0
      const y = seed % 320
      const radius = 5 + (seed % 16)
      const spot = context.createRadialGradient(x, y, 0, x, y, radius)
      spot.addColorStop(0, 'rgba(121,114,97,.025)')
      spot.addColorStop(1, 'rgba(121,114,97,0)')
      context.fillStyle = spot
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
    }
  })
}

function makeWoodTexture() {
  return canvasTexture(512, 128, (context) => {
    context.fillStyle = '#69523d'
    context.fillRect(0, 0, 512, 128)
    let seed = 8291
    for (let i = 0; i < 180; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0
      const y = seed % 128
      const alpha = .025 + (seed % 9) / 300
      context.strokeStyle = `rgba(32,19,10,${alpha})`
      context.lineWidth = (seed % 3) / 2 + .4
      context.beginPath()
      context.moveTo(0, y)
      context.bezierCurveTo(130, y + (seed % 5) - 2, 330, y - (seed % 7) + 3, 512, y + (seed % 4) - 2)
      context.stroke()
    }
  })
}

function makeFrame(photo: THREE.Texture) {
  const group = new THREE.Group()
  const darkWood = new THREE.MeshPhysicalMaterial({ color: 0x28241e, roughness: .42, metalness: .05, clearcoat: .22, clearcoatRoughness: .35 })
  const edge = new THREE.MeshStandardMaterial({ color: 0x9a805b, roughness: .3, metalness: .58 })
  const mat = new THREE.MeshStandardMaterial({ color: 0xe8e3d6, roughness: .97 })
  const photoMaterial = new THREE.MeshStandardMaterial({ map: photo, roughness: .9, metalness: 0, side: THREE.DoubleSide })
  const back = new THREE.Mesh(new THREE.BoxGeometry(3.04, 4.04, .2), darkWood)
  back.castShadow = true
  group.add(back)
  const matBoard = new THREE.Mesh(new THREE.PlaneGeometry(2.73, 3.73), mat)
  matBoard.position.z = .12
  group.add(matBoard)
  const picture = new THREE.Mesh(new THREE.PlaneGeometry(2.44, 3.44), photoMaterial)
  picture.position.z = .132
  group.add(picture)
  const rail = .17
  const rails = [
    [3.04, rail, 0, 1.94], [3.04, rail, 0, -1.94],
    [rail, 3.71, -1.435, 0], [rail, 3.71, 1.435, 0],
  ]
  for (const [width, height, x, y] of rails) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, .22), darkWood)
    mesh.position.set(x, y, .13)
    mesh.castShadow = true
    group.add(mesh)
  }
  const trim = [
    [2.72, .017, 0, 1.855], [2.72, .017, 0, -1.855],
    [.017, 3.70, -1.35, 0], [.017, 3.70, 1.35, 0],
  ]
  for (const [width, height, x, y] of trim) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, .012), edge)
    mesh.position.set(x, y, .245)
    group.add(mesh)
  }
  const backing = new THREE.Mesh(new THREE.PlaneGeometry(2.7, 3.7), new THREE.MeshStandardMaterial({ color: 0x9b8970, roughness: 1, side: THREE.DoubleSide }))
  backing.position.z = -.106
  group.add(backing)
  const hanger = new THREE.Mesh(new THREE.BoxGeometry(.56, .10, .045), edge)
  hanger.position.set(0, 1.45, -.147)
  group.add(hanger)
  const stand = new THREE.Mesh(new THREE.BoxGeometry(.32, 2.15, .12), darkWood)
  stand.position.set(0, -.55, -.42)
  stand.rotation.x = -.29
  stand.castShadow = true
  group.add(stand)
  return group
}

export default function FramePlacementScene({ scale, placement, explore, rotation, tilt, onRotate }: Props) {
  const { t } = useLanguage()
  const host = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, x: 0, y: 0 })
  const target = useRef({ scale, placement, explore, rotation, tilt })
  target.current = { scale, placement, explore, rotation, tilt }

  useEffect(() => {
    const element = host.current
    if (!element) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.62
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.domElement.setAttribute('aria-hidden', 'true')
    element.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xd4d0c4)
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 100)
    camera.position.set(0, .15, 10.4)
    let alive = true
    const wallTexture = makeWallTexture()
    wallTexture.repeat.set(4, 2.5)
    const woodTexture = makeWoodTexture()
    woodTexture.repeat.set(2.5, 1)
    const photoTexture = new THREE.TextureLoader().load('/images/family-sunset.jpg', (texture) => {
      if (!alive) { texture.dispose(); return }
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = 8
      const image = texture.image as HTMLImageElement
      const sourceAspect = image.naturalWidth / image.naturalHeight
      const targetAspect = 2.44 / 3.44
      texture.repeat.x = targetAspect / sourceAspect
      texture.offset.x = (1 - texture.repeat.x) / 2
      texture.needsUpdate = true
    })
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(20, 12), new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 1 }))
    wall.position.set(0, 0, -2.25)
    wall.receiveShadow = true
    scene.add(wall)

    const wood = new THREE.MeshStandardMaterial({ map: woodTexture, roughness: .72, metalness: 0 })
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(11.2, 2.5, 1.25), wood)
    cabinet.position.set(0, -3.64, -.05)
    cabinet.receiveShadow = true
    cabinet.castShadow = true
    scene.add(cabinet)
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(11.4, .18, 1.5), wood)
    shelf.position.set(0, -2.32, .12)
    shelf.receiveShadow = true
    shelf.castShadow = true
    scene.add(shelf)
    const shelfEdge = new THREE.Mesh(new THREE.BoxGeometry(11.4, .018, 1.52), new THREE.MeshStandardMaterial({ color: 0xa88c6a, metalness: .16, roughness: .65 }))
    shelfEdge.position.set(0, -2.215, .12)
    scene.add(shelfEdge)

    const vaseMaterial = new THREE.MeshStandardMaterial({ color: 0xbdb7a5, roughness: .93 })
    const vase = new THREE.Mesh(new THREE.LatheGeometry([
      new THREE.Vector2(0, 0), new THREE.Vector2(.31, .02), new THREE.Vector2(.38, .16),
      new THREE.Vector2(.34, .42), new THREE.Vector2(.25, .67), new THREE.Vector2(.21, .81),
    ], 32), vaseMaterial)
    vase.position.set(-3.6, -2.22, .38)
    vase.castShadow = true
    scene.add(vase)
    const branchMaterial = new THREE.MeshStandardMaterial({ color: 0x77765c, roughness: 1 })
    for (let i = 0; i < 4; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.6, -1.49, .38),
        new THREE.Vector3(-3.6 + (i - 1.5) * .13, -.92, .34),
        new THREE.Vector3(-3.63 + (i - 1.5) * .35, -.35 + (i % 2) * .22, .3),
      ])
      const branch = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, .012, 5, false), branchMaterial)
      branch.castShadow = true
      scene.add(branch)
    }
    const bookMaterials = [0xbbb3a0, 0x3e4b3f, 0x8d7760]
    bookMaterials.forEach((color, index) => {
      const book = new THREE.Mesh(new THREE.BoxGeometry(1.28, .12, .77), new THREE.MeshStandardMaterial({ color, roughness: .85 }))
      book.position.set(3.45, -2.13 + index * .13, .35)
      book.rotation.y = -.12
      book.castShadow = true
      book.receiveShadow = true
      scene.add(book)
    })

    const frame = makeFrame(photoTexture)
    scene.add(frame)
    const ambient = new THREE.AmbientLight(0xffffff, 1.4)
    scene.add(ambient)
    const key = new THREE.DirectionalLight(0xffecd5, 3.1)
    key.position.set(-4, 5, 7)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.left = -8
    key.shadow.camera.right = 8
    key.shadow.camera.top = 8
    key.shadow.camera.bottom = -8
    key.shadow.normalBias = .03
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xe5edff, .7)
    fill.position.set(5, 1, 4)
    scene.add(fill)

    let visible = true
    let raf = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const resize = () => {
      const bounds = element.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      camera.aspect = bounds.width / bounds.height
      camera.position.z = camera.aspect < .85 ? 11.6 : 10.4
      camera.updateProjectionMatrix()
      renderer.setSize(bounds.width, bounds.height, false)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)
    resize()
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0 })
    visibilityObserver.observe(element)
    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!visible) return
      const latest = target.current
      const onShelf = latest.placement === 'shelf'
      const follow = reducedMotion ? 1 : .075
      const goalScale = latest.explore ? Math.min(latest.scale, 1.08) : latest.scale
      const goalY = latest.explore ? .05 : onShelf ? -2.2 + 2 * goalScale : .4 + (goalScale - .94) * .9
      const goalZ = latest.explore ? 1.35 : onShelf ? -.12 : -1.52
      frame.scale.setScalar(THREE.MathUtils.lerp(frame.scale.x, goalScale, follow))
      frame.position.y = THREE.MathUtils.lerp(frame.position.y, goalY, follow)
      frame.position.z = THREE.MathUtils.lerp(frame.position.z, goalZ, follow)
      frame.rotation.x = THREE.MathUtils.lerp(frame.rotation.x, latest.explore ? latest.tilt : onShelf ? -.095 : 0, follow)
      frame.rotation.y = THREE.MathUtils.lerp(frame.rotation.y, latest.explore ? latest.rotation : onShelf ? -.055 : 0, follow)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, latest.explore ? .15 : onShelf ? -.34 : .15, follow)
      camera.lookAt(0, latest.explore ? 0 : onShelf ? -.3 : 0, 0)
      renderer.render(scene, camera)
      element.dataset.ready = 'true'
    }
    frame.scale.setScalar(scale)
    frame.position.set(0, .4 + (scale - .94) * .9, -1.52)
    animate()

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
      wallTexture.dispose()
      woodTexture.dispose()
      photoTexture.dispose()
      renderer.dispose()
      renderer.domElement.remove()
      delete element.dataset.ready
    }
  }, [])

  return <div className={`placement-scene${explore ? ' is-exploring' : ''}`} ref={host} tabIndex={explore ? 0 : undefined} aria-label={t(explore ? 'Interactive 360 degree photo frame. Drag to rotate, or use arrow keys.' : placement === 'wall' ? 'Three dimensional wall-mounted photo frame preview' : 'Three dimensional shelf-standing photo frame preview')}
    onPointerDown={(event) => { if (!explore) return; drag.current = { active: true, x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId) }}
    onPointerMove={(event) => { if (!drag.current.active) return; const dx = event.clientX - drag.current.x; const dy = event.clientY - drag.current.y; drag.current.x = event.clientX; drag.current.y = event.clientY; onRotate(dx * .012, dy * .003) }}
    onPointerUp={(event) => { drag.current.active = false; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId) }}
    onPointerCancel={() => { drag.current.active = false }}
    onKeyDown={(event) => { if (!explore) return; if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); onRotate(event.key === 'ArrowLeft' ? -.18 : .18, 0) } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); onRotate(0, event.key === 'ArrowUp' ? -.06 : .06) } }}>
    <div className="placement-fallback" aria-hidden="true"><div className="placement-fallback-frame" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}><img src="/images/family-sunset.jpg" alt="" /></div><div className="placement-fallback-shelf" /></div>
  </div>
}
