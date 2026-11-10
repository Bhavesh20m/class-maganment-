import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Radio,
  Eye,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Zap,
  Users,
  Compass,
} from 'lucide-react';

export const Campus3DView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { students, automations, automationLogs } = useApp();

  const [activePreset, setActivePreset] = useState<'front' | 'aerial' | 'tower' | 'gate'>('front');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [showDataPulses, setShowDataPulses] = useState<boolean>(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [selectedZone, setSelectedZone] = useState<string>('Main Academic Block');

  // References for render loop and camera damping
  const targetCamPos = useRef(new THREE.Vector3(26, 18, 30));
  const targetLookAt = useRef(new THREE.Vector3(0, 4, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 4, 0));
  const animTime = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightMode ? 0x070b19 : 0xf1f5f9);
    scene.fog = new THREE.FogExp2(isNightMode ? 0x070b19 : 0xf1f5f9, 0.008);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 200);
    camera.position.set(26, 18, 30);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isNightMode ? 1.0 : 1.35;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // 3. Environment Map (RoomEnvironment via PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig (Warm key light, cool hemisphere fill, accents)
    const hemiLight = new THREE.HemisphereLight(
      isNightMode ? 0x334466 : 0xffffff,
      isNightMode ? 0x111622 : 0xe2e8f0,
      isNightMode ? 0.6 : 1.2
    );
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(isNightMode ? 0x6366f1 : 0xffffff, isNightMode ? 1.2 : 2.2);
    dirLight.position.set(24, 35, 18);
    dirLight.castShadow = !isSoftwareGl;
    if (dirLight.shadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 90;
      const d = 28;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0004;
    }
    scene.add(dirLight);

    // Automation Glow Light
    const towerLight = new THREE.PointLight(0x06b6d4, isNightMode ? 4 : 2, 25);
    towerLight.position.set(-14, 15, -6);
    scene.add(towerLight);

    // 5. Procedural Ground, Courtyard & Roads
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x0c1322 : 0xe2e8f0,
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    // Courtyard Pavers with procedural canvas texture
    const plazaCanvas = document.createElement('canvas');
    plazaCanvas.width = 256;
    plazaCanvas.height = 256;
    const pctx = plazaCanvas.getContext('2d')!;
    pctx.fillStyle = isNightMode ? '#1e293b' : '#ffffff';
    pctx.fillRect(0, 0, 256, 256);
    pctx.strokeStyle = isNightMode ? '#334155' : '#cbd5e1';
    pctx.lineWidth = 4;
    for (let x = 0; x <= 256; x += 32) {
      pctx.beginPath();
      pctx.moveTo(x, 0);
      pctx.lineTo(x, 256);
      pctx.stroke();
      pctx.beginPath();
      pctx.moveTo(0, x);
      pctx.lineTo(256, x);
      pctx.stroke();
    }
    const plazaTex = new THREE.CanvasTexture(plazaCanvas);
    plazaTex.colorSpace = THREE.SRGBColorSpace;
    plazaTex.wrapS = THREE.RepeatWrapping;
    plazaTex.wrapT = THREE.RepeatWrapping;
    plazaTex.repeat.set(6, 6);

    const plazaGeo = new THREE.PlaneGeometry(36, 36);
    const plazaMat = new THREE.MeshStandardMaterial({
      map: plazaTex,
      roughness: 0.6,
      metalness: 0.2,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(0, 0.02, 4);
    plaza.receiveShadow = !isSoftwareGl;
    scene.add(plaza);

    // 6. COMPOSITE PROCEDURAL MODEL 1: Main Academy Building (Group with 9 parts)
    const academyGroup = new THREE.Group();
    academyGroup.position.set(0, 0, -8);

    // Part A: Main Wing (Extruded Base Silhouette)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.25,
    });
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(22, 9, 12), baseMat);
    mainBody.position.y = 4.5;
    mainBody.castShadow = !isSoftwareGl;
    mainBody.receiveShadow = !isSoftwareGl;
    academyGroup.add(mainBody);

    // Part B: Upper Executive Floor
    const upperBody = new THREE.Mesh(
      new THREE.BoxGeometry(16, 4.5, 9),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.4 })
    );
    upperBody.position.y = 11.25;
    upperBody.castShadow = !isSoftwareGl;
    academyGroup.add(upperBody);

    // Part C: Modern Slanted Canopy Roof
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.6, 11),
      new THREE.MeshStandardMaterial({ color: 0x4338ca, roughness: 0.25, metalness: 0.7 })
    );
    roof.position.set(0, 13.8, 0);
    roof.rotation.x = 0.05;
    roof.castShadow = !isSoftwareGl;
    academyGroup.add(roof);

    // Part D: Glazed Entrance Atrium
    const atriumMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x0284c7,
      emissiveIntensity: isNightMode ? 0.8 : 0.2,
      transparent: true,
      opacity: 0.85,
    });
    const atrium = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 2.5), atriumMat);
    atrium.position.set(0, 3, 6.2);
    academyGroup.add(atrium);

    // Part E: Entrance Pillars
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.2, metalness: 0.8 });
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 6, 16), pillarMat);
    p1.position.set(-2.6, 3, 7.2);
    p1.castShadow = !isSoftwareGl;
    academyGroup.add(p1);

    const p2 = p1.clone();
    p2.position.set(2.6, 3, 7.2);
    academyGroup.add(p2);

    // Part F: Entrance Overhang
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(7, 0.4, 3),
      new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3, metalness: 0.6 })
    );
    canopy.position.set(0, 6.2, 7.2);
    canopy.castShadow = !isSoftwareGl;
    academyGroup.add(canopy);

    // Part G: AUTOMEXA Crest Tower & Clock / Bell Accent
    const towerGeo = new THREE.BoxGeometry(3, 8, 3);
    const tower = new THREE.Mesh(
      towerGeo,
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.3 })
    );
    tower.position.set(-7.5, 12, 2);
    tower.castShadow = !isSoftwareGl;
    academyGroup.add(tower);

    // Crest emblem
    const crest = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 0.3, 24),
      new THREE.MeshStandardMaterial({ color: 0x6366f1, emissive: 0x4f46e5, emissiveIntensity: 0.6, metalness: 0.8 })
    );
    crest.rotation.x = Math.PI / 2;
    crest.position.set(-7.5, 14, 3.6);
    academyGroup.add(crest);

    // Part H: Illuminated Classroom Window Ribbons
    const winCanvas = document.createElement('canvas');
    winCanvas.width = 128;
    winCanvas.height = 64;
    const wctx = winCanvas.getContext('2d')!;
    wctx.fillStyle = '#0f172a';
    wctx.fillRect(0, 0, 128, 64);
    wctx.fillStyle = isNightMode ? '#38bdf8' : '#e0f2fe';
    for (let x = 8; x < 120; x += 18) {
      wctx.fillRect(x, 10, 12, 44);
    }
    const winTex = new THREE.CanvasTexture(winCanvas);
    winTex.colorSpace = THREE.SRGBColorSpace;
    winTex.repeat.set(4, 1);
    winTex.wrapS = THREE.RepeatWrapping;

    const windowStrips = new THREE.Mesh(
      new THREE.PlaneGeometry(21.8, 2.5),
      new THREE.MeshStandardMaterial({
        map: winTex,
        roughness: 0.2,
        metalness: 0.5,
        emissive: 0x38bdf8,
        emissiveIntensity: isNightMode ? 0.9 : 0.15,
      })
    );
    windowStrips.position.set(0, 6, 6.02);
    academyGroup.add(windowStrips);

    // Part I: Soft Contact Shadow Plane beneath building
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(26, 16), shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, 0.01, 0);
    academyGroup.add(shadowPlane);

    scene.add(academyGroup);

    // 7. COMPOSITE PROCEDURAL MODEL 2: Smart Automation Telemetry Tower (Group with 7 parts)
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-14, 0, -6);

    // Mast
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.7, 16, 8),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.2 })
    );
    mast.position.y = 8;
    mast.castShadow = !isSoftwareGl;
    towerGroup.add(mast);

    // Base Pylon
    const basePylon = new THREE.Mesh(
      new THREE.ConeGeometry(2, 4, 4),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.4 })
    );
    basePylon.position.y = 2;
    towerGroup.add(basePylon);

    // Rotating Telemetry Ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.12, 16, 32),
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.9,
        metalness: 0.9,
      })
    );
    ring.position.y = 13;
    ring.rotation.x = Math.PI / 2;
    towerGroup.add(ring);

    // Data Beacon Pulse Sphere
    const beacon = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x22d3ee,
        emissive: 0x06b6d4,
        emissiveIntensity: 1.5,
      })
    );
    beacon.position.y = 16.2;
    towerGroup.add(beacon);

    scene.add(towerGroup);

    // 8. PROCEDURAL TREES & CAMPUS GREENERY (Composite trunk + faceted crown)
    const treeCoords = [
      [-12, 10], [-10, 15], [-6, 18], [6, 18], [10, 15], [12, 10],
      [14, -2], [14, -8], [-14, -12], [12, -14],
    ];

    treeCoords.forEach(([tx, tz], i) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);

      // Trunk
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.35, 2.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x5b3a29, roughness: 0.9, metalness: 0.05 })
      );
      trunk.position.y = 1.1;
      trunk.castShadow = !isSoftwareGl;
      tree.add(trunk);

      // Crown
      const crown = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.4 + (i % 3) * 0.2),
        new THREE.MeshStandardMaterial({
          color: isNightMode ? 0x064e3b : 0x047857,
          roughness: 0.8,
          metalness: 0.1,
          flatShading: true,
        })
      );
      crown.position.y = 2.8 + (i % 3) * 0.15;
      crown.castShadow = !isSoftwareGl;
      tree.add(crown);

      // Soft contact shadow
      const ts = new THREE.Mesh(new THREE.CircleGeometry(1.2, 12), shadowMat);
      ts.rotation.x = -Math.PI / 2;
      ts.position.y = 0.01;
      tree.add(ts);

      scene.add(tree);
    });

    // 9. Pulsing Data Packets (Automation transmission lines)
    const packets: THREE.Mesh[] = [];
    if (showDataPulses) {
      const packetGeo = new THREE.SphereGeometry(0.2, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      for (let p = 0; p < 8; p++) {
        const mesh = new THREE.Mesh(packetGeo, packetMat);
        scene.add(mesh);
        packets.push(mesh);
      }
    }

    // 10. ANIMATION & LOSSLESS RENDER LOOP WITH SOFTWARE-GL SAFE PACING
    let frameId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    let lastTime = performance.now();

    function tick() {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      animTime.current += delta;

      // Rotate telemetry ring on tower
      ring.rotation.z += 0.8 * delta;

      // Animate automation data packets between tower and academy building
      if (showDataPulses && packets.length > 0) {
        packets.forEach((pkt, idx) => {
          const t = (animTime.current * 0.4 + idx * 0.125) % 1;
          // Interpolate curve from Tower (-14, 15, -6) to Atrium (0, 4, -2) to Gate (0, 1, 14)
          const pX = THREE.MathUtils.lerp(-14, 0, t);
          const pY = 14 * Math.sin(t * Math.PI) + 3;
          const pZ = THREE.MathUtils.lerp(-6, 2, t);
          pkt.position.set(pX, pY, pZ);
        });
      }

      // Smooth camera interpolation with exponential damping (1 - Math.exp(-k * dt))
      const dampFactor = 1 - Math.exp(-4 * delta);
      camera.position.lerp(targetCamPos.current, dampFactor);
      currentLookAt.current.lerp(targetLookAt.current, dampFactor);
      camera.lookAt(currentLookAt.current);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) {
        clearTimeout(frameId);
      } else {
        cancelAnimationFrame(frameId);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [isNightMode, showDataPulses]);

  // Update target camera positions when preset changes
  useEffect(() => {
    if (activePreset === 'front') {
      targetCamPos.current.set(22, 15, 26);
      targetLookAt.current.set(0, 5, -2);
      setSelectedZone('Main Academic Block');
    } else if (activePreset === 'aerial') {
      targetCamPos.current.set(3, 42, 38);
      targetLookAt.current.set(0, 2, 0);
      setSelectedZone('Complete Academy Campus Overview');
    } else if (activePreset === 'tower') {
      targetCamPos.current.set(-18, 18, 12);
      targetLookAt.current.set(-14, 12, -6);
      setSelectedZone('Automation Signal Hub & Telemetry Tower');
    } else if (activePreset === 'gate') {
      targetCamPos.current.set(0, 4, 28);
      targetLookAt.current.set(0, 6, -6);
      setSelectedZone('Entrance Plaza & Parent Reception Atrium');
    }
  }, [activePreset]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-slate-100 select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Minimal Top-Left Title (Clean single surface, no decorative badge) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
          <Building2 className="w-4 h-4 text-slate-900" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-xs font-semibold text-slate-900 tracking-wide uppercase">Bright Future Academy</h1>
          <p className="text-xs text-slate-500 mt-0.5">Focus: <span className="text-slate-800 font-medium">{selectedZone}</span></p>
        </div>
      </div>

      {/* Top-Right Highlights */}
      <div className="absolute top-4 right-4 z-10 hidden md:flex items-center gap-2">
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-right shadow-sm">
          <div className="text-[11px] text-slate-500">Total Enrolled</div>
          <div className="text-xs font-medium text-slate-900 flex items-center justify-end gap-1.5 mt-0.5">
            <Users className="w-3.5 h-3.5 text-slate-700" strokeWidth={1.75} />
            {students.length} Students
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-right shadow-sm">
          <div className="text-[11px] text-slate-500">Active Automations</div>
          <div className="text-xs font-medium text-slate-900 flex items-center justify-end gap-1.5 mt-0.5">
            <Zap className="w-3.5 h-3.5 text-slate-700" strokeWidth={1.75} />
            {automations.filter((a) => a.enabled).length} Workflows
          </div>
        </div>
      </div>

      {/* Unified Ergonomic Bottom Control Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-3xl px-4 pointer-events-none">
        <div className="pointer-events-auto bg-white border border-slate-200 rounded-xl shadow-lg p-3 transition-all duration-200">
          {/* Header Bar with Collapse Toggle */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2.5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-900" strokeWidth={1.75} />
              <span className="font-medium text-slate-900">Campus Perspective</span>
            </div>
            <button
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-100 transition cursor-pointer"
            >
              {isDockCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" strokeWidth={1.75} /> Show Controls
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.75} /> Minimize Dock
                </>
              )}
            </button>
          </div>

          {!isDockCollapsed && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Camera Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500 mr-1">Views:</span>
                <button
                  onClick={() => setActivePreset('front')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activePreset === 'front'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Academic Front
                </button>
                <button
                  onClick={() => setActivePreset('aerial')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activePreset === 'aerial'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Aerial View
                </button>
                <button
                  onClick={() => setActivePreset('tower')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activePreset === 'tower'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Automation Tower
                </button>
                <button
                  onClick={() => setActivePreset('gate')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    activePreset === 'gate'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Reception Atrium
                </button>
              </div>

              {/* Atmosphere & Visual Toggles */}
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <button
                  onClick={() => setIsNightMode(!isNightMode)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition cursor-pointer ${
                    isNightMode
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  title={isNightMode ? 'Switch to Day Light' : 'Switch to Evening Illumination'}
                >
                  {isNightMode ? <Moon className="w-3.5 h-3.5" strokeWidth={1.75} /> : <Sun className="w-3.5 h-3.5" strokeWidth={1.75} />}
                  <span className="text-[11px]">{isNightMode ? 'Night Mode' : 'Day Mode'}</span>
                </button>

                <button
                  onClick={() => setShowDataPulses(!showDataPulses)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition cursor-pointer ${
                    showDataPulses
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Telemetry Pulses</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
