import React, { useState, useEffect, useRef } from 'react'
import { useCRMStore } from '../../context/CRMStore'
import { Globe as GlobeIcon, Play, Pause, RotateCw, ShieldAlert, Radio, Users, Target } from 'lucide-react'

// Enriched Telemetry Nodes matching fuse-erp-co & KKAutomotive Analytics
const INITIAL_NODES = [
  { id: '1', city: 'NAIROBI', country: 'Kenya', label: 'NAIROBI', lat: -1.286389, lng: 36.817223, hits: 91, is_bot: false },
  { id: '2', city: 'JUJA', country: 'Kenya', label: 'KIAMBU - KALIMONI WARD, JUJA TOWN', lat: -1.1025, lng: 37.0131, hits: 45, is_bot: false },
  { id: '3', city: 'MOMBASA', country: 'Kenya', label: 'MOMBASA', lat: -4.043477, lng: 39.668206, hits: 48, is_bot: false },
  { id: '4', city: 'KISUMU', country: 'Kenya', label: 'KISUMU', lat: -0.091702, lng: 34.767956, hits: 18, is_bot: false },
  { id: '5', city: 'NAKURU', country: 'Kenya', label: 'NAKURU', lat: -0.303099, lng: 36.080025, hits: 11, is_bot: false },
  { id: '6', city: 'ELDORET', country: 'Kenya', label: 'ELDORET', lat: 0.514277, lng: 35.269779, hits: 9, is_bot: false },
  { id: '7', city: 'JOHANNESBURG', country: 'South Africa', label: 'JOHANNESBURG, CITY OF JOHANNESBURG METROPOLITAN MUNICIPALITY', lat: -26.2041, lng: 28.0473, hits: 62, is_bot: false },
  { id: '8', city: 'CAPE TOWN', country: 'South Africa', label: 'CAPE TOWN', lat: -33.9249, lng: 18.4241, hits: 38, is_bot: false },
  { id: '9', city: 'MOUNTAIN VIEW', country: 'United States', label: 'MOUNTAIN VIEW', lat: 37.386051, lng: -122.083855, hits: 271, is_bot: false },
  { id: '10', city: 'PRYOR', country: 'United States', label: 'PRYOR', lat: 36.308422, lng: -95.316632, hits: 70, is_bot: false },
  { id: '11', city: 'GUANGZHOU', country: 'China', label: 'GUANGZHOU', lat: 23.12911, lng: 113.264385, hits: 66, is_bot: false },
  { id: '12', city: 'SINGAPORE', country: 'Singapore', label: 'SINGAPORE', lat: 1.352083, lng: 103.819836, hits: 88, is_bot: false },
  { id: '13', city: 'SYDNEY', country: 'Australia', label: 'SYDNEY', lat: -33.86882, lng: 151.209296, hits: 54, is_bot: false },
  { id: '14', city: 'JAKARTA', country: 'Indonesia', label: 'JAKARTA', lat: -6.2088, lng: 106.8456, hits: 31, is_bot: false },
  { id: '15', city: 'LONDON', country: 'United Kingdom', label: 'LONDON', lat: 51.507351, lng: -0.127758, hits: 42, is_bot: true },
  { id: '16', city: 'FRANKFURT', country: 'Germany', label: 'FRANKFURT', lat: 50.110922, lng: 8.682127, hits: 35, is_bot: true },
  { id: 17, city: 'MOSCOW', country: 'Russia', label: 'MOSCOW', lat: 55.755826, lng: 37.6173, hits: 128, is_bot: true },
  { id: 18, city: 'PANAMA CITY', country: 'Panama', label: 'PANAMA CITY', lat: 8.982379, lng: -79.51987, hits: 15, is_bot: true },
  { id: 19, city: 'BOGOTA', country: 'Colombia', label: 'BOGOTA', lat: 4.710989, lng: -74.072092, hits: 22, is_bot: true }
]

const TOP_VISITOR_LOCATIONS = [
  { rank: '01', source: 'United States', target: 'Mountain View', hits: 271, lat: 37.386051, lng: -122.083855, is_bot: false },
  { rank: '02', source: 'Konya', target: 'Nairobi', hits: 91, lat: -1.286389, lng: 36.817223, is_bot: false },
  { rank: '03', source: 'United States', target: 'Pryor', hits: 70, lat: 36.308422, lng: -95.316632, is_bot: false },
  { rank: '04', source: 'China', target: 'Guangzhou', hits: 66, lat: 23.12911, lng: 113.264385, is_bot: false },
  { rank: '05', source: 'Kenya', target: 'Mombasa', hits: 48, lat: -4.043477, lng: 39.668206, is_bot: false },
  { rank: '06', source: 'United Kingdom', target: 'London', hits: 42, lat: 51.507351, lng: -0.127758, is_bot: true },
  { rank: '07', source: 'Germany', target: 'Frankfurt', hits: 35, lat: 50.110922, lng: 8.682127, is_bot: true }
]

export default function VisitorMap() {
  const adminTheme = useCRMStore(state => state.adminTheme)
  const isLight = adminTheme === 'light'

  const containerRef = useRef(null)
  const globeInstanceRef = useRef(null)

  // Layer filters
  const [filterHuman, setFilterHuman] = useState(true)
  const [filterBot, setFilterBot] = useState(true)
  const [filterPulse, setFilterPulse] = useState(true)

  // Rotation controls
  const [isRotating, setIsRotating] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState(1.0)

  // Hover Overlay State
  const [hoveredNode, setHoveredNode] = useState(null)
  const [activeTargetLoc, setActiveTargetLoc] = useState(null)
  const [isGlobeReady, setIsGlobeReady] = useState(false)

  // Initialize Globe.gl WebGL Instance
  useEffect(() => {
    const Globe = window.Globe
    if (!Globe) {
      console.warn("Globe.gl script is loading...")
      return
    }

    const container = containerRef.current
    if (!container) return

    // Instantiate Globe.gl on container with exact container dimensions
    const initialWidth = container.clientWidth || 750
    const initialHeight = container.clientHeight || 680

    const globe = Globe()(container)
      .width(initialWidth)
      .height(initialHeight)
    globeInstanceRef.current = globe

    // 1. Globe Base Styling matching fuse-erp-co
    globe
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereColor('#6366f1')
      .polygonCapColor(() => 'rgba(0,0,0,0)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => 'rgba(255,255,255,0.3)')

    // 2. Fetch Natural Earth GeoJSON Country Boundaries Overlay
    fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(countries => {
        if (countries && countries.features) {
          globe.polygonsData(countries.features)
        }
      })
      .catch(err => console.error("GeoJSON countries load error:", err))

    // Initial View Position focused on Africa / Europe
    globe.pointOfView({ lat: 10, lng: 20, alt: 2.2 }, 0)
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 1.0

    // Hover tooltip interaction
    globe.onPointHover(node => {
      setHoveredNode(node)
    })

    setTimeout(() => {
      setIsGlobeReady(true)
    }, 0)

    // Handle Container & Window Resize using ResizeObserver for perfect centering
    const updateDimensions = () => {
      if (container && globe) {
        const w = container.clientWidth
        const h = container.clientHeight || 680
        if (w > 0 && h > 0) {
          globe.width(w)
          globe.height(h)
        }
      }
    }

    // Force an immediate dimension check after layout paint
    const timer = setTimeout(updateDimensions, 100)

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions()
    })
    resizeObserver.observe(container)

    window.addEventListener('resize', updateDimensions)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateDimensions)
      resizeObserver.disconnect()
      container.innerHTML = ''
    }
  }, [])

  // Sync Data Layers on Globe (Points, Rings, 3D Labels)
  useEffect(() => {
    const globe = globeInstanceRef.current
    if (!globe || !isGlobeReady) return

    // Filter nodes based on user toggles
    const filteredNodes = INITIAL_NODES.filter(n => {
      if (n.is_bot && !filterBot) return false
      if (!n.is_bot && !filterHuman) return false
      return true
    })

    // 1. Points Data Layer
    globe
      .pointsData(filteredNodes)
      .pointLat(d => parseFloat(d.lat))
      .pointLng(d => parseFloat(d.lng))
      .pointColor(d => (d.is_bot ? '#ef4444' : '#a3e635'))
      .pointAltitude(0.04)
      .pointRadius(d => 0.015 + Math.min(0.03, d.hits * 0.0005))
      .pointsMerge(false)

    // 2. Pulsing Rings Data Layer
    const ringNodes = filterPulse ? filteredNodes.filter(n => !n.is_bot) : []
    globe
      .ringsData(ringNodes)
      .ringLat(d => parseFloat(d.lat))
      .ringLng(d => parseFloat(d.lng))
      .ringColor(() => '#facc15')
      .ringMaxRadius(2.5)
      .ringPropagationSpeed(1.5)
      .ringRepeatPeriod(2500)

    // 3. 3D HTML City Text Labels Layer matching fuse-erp-co
    globe
      .htmlElementsData(filteredNodes)
      .htmlLat(d => parseFloat(d.lat))
      .htmlLng(d => parseFloat(d.lng))
      .htmlElement(d => {
        const el = document.createElement('div')
        const labelColor = d.is_bot ? '#ef4444' : 'rgba(255,255,255,0.95)'
        el.innerHTML = `
          <div style="color: ${labelColor}; font-size: 11px; font-[#000]; font-weight: 900; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; text-shadow: 0 0 10px #000, 0 0 5px #000; letter-spacing: 1px; white-space: nowrap; pointer-events: none;">
            ${d.label || d.city}
          </div>
        `
        return el
      })
  }, [filterHuman, filterBot, filterPulse, isGlobeReady])

  // Sync Rotation Controls
  useEffect(() => {
    const globe = globeInstanceRef.current
    if (!globe || !isGlobeReady) return

    globe.controls().autoRotate = isRotating
    globe.controls().autoRotateSpeed = rotationSpeed
  }, [isRotating, rotationSpeed, isGlobeReady])

  // Fly-To Camera Transition when clicking a top location item
  const handleInterceptNode = (target) => {
    const globe = globeInstanceRef.current
    if (!globe) return

    setActiveTargetLoc(target.target)

    // Pause auto-rotation when focusing up close
    setIsRotating(false)
    if (globe.controls()) {
      globe.controls().autoRotate = false
    }

    // Smooth 3D camera fly-to transition matching fuse-erp-co!
    globe.pointOfView(
      {
        lat: target.lat,
        lng: target.lng,
        alt: 0.65
      },
      1600
    )
  }

  return (
    <div className={`space-y-6 font-sans pb-12 min-h-screen p-4 md:p-6 rounded-3xl border shadow-2xl ${isLight ? 'text-slate-900 bg-slate-50 border-slate-200' : 'text-slate-100 bg-[#020617] border-white/10'}`}>
      
      {/* Header Bar matching fuse-erp-co Design */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border shadow-2xl backdrop-blur-xl ${isLight ? 'bg-white/90 border-slate-200' : 'bg-[#070b14]/90 border-white/10'}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#a3e635]/10 border border-[#a3e635]/30 text-[#a3e635] flex items-center justify-center shadow-lg shadow-[#a3e635]/10">
            <GlobeIcon size={24} className="animate-spin" style={{ animationDuration: '16s' }} />
          </div>
          <div>
            <div className={`text-[10px] font-mono font-bold tracking-[3px] uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Analytics Suite <span className="text-[#a3e635]">/</span> Global Traffic Map
            </div>
            <h1 className={`text-2xl font-serif font-light mt-0.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>Traffic Map</h1>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Live traffic locations and unusual activity tracking.</p>
          </div>
        </div>

        {/* Top Right Quick Stats Cards */}
        <div className="flex flex-wrap items-center gap-3 font-mono">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[11px] font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>1 ACTIVE NODES</span>
          </div>

          <div className={`px-4 py-2 rounded-xl border text-center ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0f172a] border-white/10'}`}>
            <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Visitor Locations</span>
            <span className="text-lg font-bold text-[#a3e635]">846</span>
          </div>

          <div className={`px-4 py-2 rounded-xl border text-center ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0f172a] border-white/10'}`}>
            <span className={`text-[10px] uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Unusual Activity</span>
            <span className="text-lg font-bold text-rose-500">285</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left HUD Control Panel & Right globe.gl 3D Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left HUD Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Top Visitor Locations with Camera Fly-To Intercept */}
          <div className={`p-5 rounded-2xl border shadow-2xl backdrop-blur-xl space-y-4 ${isLight ? 'bg-white/80 border-slate-200' : 'bg-[#0f172a]/80 border-white/10'}`}>
            <div className={`border-b pb-3 flex items-center justify-between ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <span className={`text-[10px] tracking-[3px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Top Visitor Locations
              </span>
              <span className="text-[9px] font-mono text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Click to Focus
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs max-h-[280px] overflow-y-auto pr-1">
              {TOP_VISITOR_LOCATIONS.map(loc => {
                const isSelected = activeTargetLoc === loc.target
                const statusColor = loc.is_bot ? '#ef4444' : '#a3e635'

                return (
                  <div
                    key={loc.rank}
                    onClick={() => handleInterceptNode(loc)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-lg'
                        : isLight
                          ? 'bg-slate-50 border-slate-200 hover:border-indigo-400 text-slate-800'
                          : 'bg-slate-950/70 border-white/5 hover:border-indigo-500/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[10px]" style={{ color: statusColor }}>
                        {loc.rank}
                      </span>
                      <span className="font-semibold text-[11px]">
                        {loc.source} &rarr; {loc.target}
                      </span>
                    </div>
                    <span
                      className="font-bold text-[10px] px-2 py-0.5 rounded border"
                      style={{
                        color: statusColor,
                        backgroundColor: `${statusColor}15`,
                        borderColor: `${statusColor}30`
                      }}
                    >
                      {loc.hits} HITS
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Card 2: Map Filters & Controls */}
          <div className={`p-5 rounded-2xl border shadow-2xl backdrop-blur-xl space-y-5 ${isLight ? 'bg-white/80 border-slate-200' : 'bg-[#0f172a]/80 border-white/10'}`}>
            <div className={`border-b pb-3 ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <span className={`text-[10px] tracking-[3px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Map Filters</span>
            </div>

            {/* Filter Layer Toggles */}
            <div className="space-y-3.5 text-xs font-mono">
              <div
                onClick={() => setFilterHuman(!filterHuman)}
                className={`flex items-center gap-3 cursor-pointer transition-opacity ${
                  filterHuman ? 'opacity-100' : 'opacity-35 grayscale'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-sm bg-[#a3e635] shadow-sm shadow-[#a3e635]/50 flex-shrink-0" />
                <div>
                  <span className={`font-bold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Verified Visitors</span>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Real human activity</span>
                </div>
              </div>

              <div
                onClick={() => setFilterBot(!filterBot)}
                className={`flex items-center gap-3 cursor-pointer transition-opacity ${
                  filterBot ? 'opacity-100' : 'opacity-35 grayscale'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-sm bg-[#ef4444] shadow-sm shadow-[#ef4444]/50 flex-shrink-0" />
                <div>
                  <span className={`font-bold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Automated Bots</span>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Non-human traffic</span>
                </div>
              </div>

              <div
                onClick={() => setFilterPulse(!filterPulse)}
                className={`flex items-center gap-3 cursor-pointer transition-opacity ${
                  filterPulse ? 'opacity-100' : 'opacity-35 grayscale'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#facc15] bg-[#facc15]/20 flex items-center justify-center flex-shrink-0">
                  <span className="w-1 h-1 rounded-full bg-[#facc15]" />
                </div>
                <div>
                  <span className={`font-bold block ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Activity Pulse</span>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Yellow circles for new visits</span>
                </div>
              </div>
            </div>

            {/* Map Rotation Controller */}
            <div className={`pt-4 border-t space-y-3 font-mono ${isLight ? 'border-slate-200' : 'border-white/10'}`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Map Rotation</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsRotating(!isRotating)}
                    className={`p-1.5 rounded-lg border flex items-center gap-1.5 px-2.5 transition-all ${isLight ? 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900' : 'bg-slate-950 border-white/10 text-slate-300 hover:text-white'}`}
                    title={isRotating ? "Pause Rotation" : "Play Rotation"}
                  >
                    {isRotating ? <Pause size={12} /> : <Play size={12} />}
                    <span className="text-[11px] font-bold text-[#a3e635]">{rotationSpeed.toFixed(1)}x</span>
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={rotationSpeed}
                onChange={e => setRotationSpeed(parseFloat(e.target.value))}
                className="w-full accent-[#a3e635] bg-slate-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Right Side: globe.gl 3D WebGL Canvas Container - Always dark for the 3D globe */}
        <div className="lg:col-span-8 rounded-2xl bg-[#030712] border border-white/10 shadow-2xl relative overflow-hidden min-h-[680px] flex items-center justify-center">
          
          {/* Globe.gl Container Mount Point */}
          <div
            ref={containerRef}
            className="w-full h-[680px] cursor-grab active:cursor-grabbing relative flex items-center justify-center"
          />

          {/* Interactive Hover Tactical Overlay Badge matching fuse-erp-co */}
          {hoveredNode && (
            <div className="absolute bottom-6 right-6 z-30 bg-[#0f172a]/95 backdrop-blur-2xl border-2 border-indigo-500/80 rounded-2xl p-5 w-80 text-white shadow-2xl transition-all font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-ping"
                    style={{ backgroundColor: hoveredNode.is_bot ? '#ef4444' : '#a3e635' }}
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {hoveredNode.is_bot ? 'BOT THREAT DETECTED' : 'VERIFIED VISITOR'}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {hoveredNode.hits} HITS
                </span>
              </div>

              <h4 className="text-xl font-bold text-white leading-tight">{hoveredNode.city}</h4>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">{hoveredNode.country}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 bg-black/30 p-2.5 rounded-xl font-mono text-[11px]">
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">LATITUDE</span>
                  <span className="text-[#a3e635] font-bold">{parseFloat(hoveredNode.lat).toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">LONGITUDE</span>
                  <span className="text-[#0ea5e9] font-bold">{parseFloat(hoveredNode.lng).toFixed(4)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Badge */}
          <div className="absolute bottom-4 left-6 z-20 text-[10px] font-mono text-slate-500 bg-slate-950/80 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-md">
            KKAutomotive Globe.gl Engine
          </div>
        </div>

      </div>
    </div>
  )
}
