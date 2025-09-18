"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ZoomIn, ZoomOut, RotateCcw, Navigation, Satellite, Activity, Snowflake, Beaker } from "lucide-react"

interface DataPoint {
  x: number
  y: number
  lat: number
  lon: number
  type: "argo" | "satellite" | "bgc" | "ice" | "deep"
  id: string
  status: string
  data?: any
}

const generateDataPoints = (): DataPoint[] => {
  const points: DataPoint[] = []

  // ARGO floats (global distribution)
  for (let i = 0; i < 150; i++) {
    const lat = (Math.random() - 0.5) * 140 // -70 to 70
    const lon = (Math.random() - 0.5) * 360 // -180 to 180
    points.push({
      x: (lon + 180) * (800 / 360),
      y: (90 - lat) * (400 / 180),
      lat,
      lon,
      type: "argo",
      id: `ARGO-${1000 + i}`,
      status: Math.random() > 0.1 ? "Active" : "Maintenance",
      data: {
        temp: (Math.random() * 30).toFixed(1),
        salinity: (34 + Math.random() * 2).toFixed(1),
        depth: Math.floor(Math.random() * 2000),
      },
    })
  }

  // BGC floats (fewer, specific regions)
  for (let i = 0; i < 50; i++) {
    const lat = (Math.random() - 0.5) * 120
    const lon = (Math.random() - 0.5) * 340
    points.push({
      x: (lon + 180) * (800 / 360),
      y: (90 - lat) * (400 / 180),
      lat,
      lon,
      type: "bgc",
      id: `BGC-${2000 + i}`,
      status: "Active",
      data: {
        oxygen: (150 + Math.random() * 100).toFixed(0),
        ph: (7.8 + Math.random() * 0.4).toFixed(2),
        chlorophyll: (Math.random() * 2).toFixed(2),
      },
    })
  }

  // Deep ARGO floats (limited locations)
  for (let i = 0; i < 20; i++) {
    const lat = (Math.random() - 0.5) * 100
    const lon = (Math.random() - 0.5) * 320
    points.push({
      x: (lon + 180) * (800 / 360),
      y: (90 - lat) * (400 / 180),
      lat,
      lon,
      type: "deep",
      id: `DEEP-${3000 + i}`,
      status: "Active",
      data: {
        maxDepth: "6000m",
        abyssalTemp: (0.5 + Math.random() * 2).toFixed(1),
        deepSalinity: (34.6 + Math.random() * 0.3).toFixed(2),
      },
    })
  }

  // Satellite tracks
  for (let i = 0; i < 30; i++) {
    const lat = (Math.random() - 0.5) * 160
    const lon = (Math.random() - 0.5) * 360
    points.push({
      x: (lon + 180) * (800 / 360),
      y: (90 - lat) * (400 / 180),
      lat,
      lon,
      type: "satellite",
      id: `SAT-${4000 + i}`,
      status: "Operational",
      data: {
        ssh: ((Math.random() - 0.5) * 20).toFixed(1),
        altimeter: Math.random() > 0.5 ? "Jason-3" : "Sentinel-6",
      },
    })
  }

  // Sea ice monitoring (polar regions)
  for (let i = 0; i < 25; i++) {
    const isArctic = Math.random() > 0.5
    const lat = isArctic ? 70 + Math.random() * 20 : -70 - Math.random() * 20
    const lon = (Math.random() - 0.5) * 360
    points.push({
      x: (lon + 180) * (800 / 360),
      y: (90 - lat) * (400 / 180),
      lat,
      lon,
      type: "ice",
      id: `ICE-${5000 + i}`,
      status: "Monitoring",
      data: {
        concentration: (60 + Math.random() * 40).toFixed(1),
        thickness: (0.5 + Math.random() * 3).toFixed(1),
        region: isArctic ? "Arctic" : "Antarctic",
      },
    })
  }

  return points
}

export default function EnhancedWorldMap() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null)
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [dataPoints] = useState(generateDataPoints())
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / zoom
    const y = (e.clientY - rect.top - pan.y) / zoom

    // Convert screen coordinates to lat/lon
    const lon = (x / 800) * 360 - 180
    const lat = 90 - (y / 400) * 180

    setClickedCoords({ lat: Math.max(-90, Math.min(90, lat)), lon: Math.max(-180, Math.min(180, lon)) })
    setSelectedPoint(null)
  }

  const handlePointClick = (point: DataPoint, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedPoint(point)
    setClickedCoords(null)
  }

  const zoomIn = () => setZoom((prev) => Math.min(prev * 1.5, 5))
  const zoomOut = () => setZoom((prev) => Math.max(prev / 1.5, 0.5))
  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedPoint(null)
    setClickedCoords(null)
  }

  // Simplified world map paths (continents outline)
  const continents = [
    // North America
    "M 120 80 L 180 70 L 200 90 L 220 85 L 240 100 L 200 120 L 160 130 L 120 110 Z",
    // South America
    "M 200 180 L 220 160 L 240 180 L 250 220 L 230 260 L 210 250 L 200 220 Z",
    // Europe
    "M 380 70 L 420 65 L 440 80 L 420 90 L 380 85 Z",
    // Africa
    "M 380 100 L 420 95 L 440 120 L 450 160 L 430 200 L 400 190 L 380 150 Z",
    // Asia
    "M 450 60 L 550 55 L 600 70 L 650 65 L 700 80 L 680 100 L 620 110 L 580 95 L 520 90 L 450 85 Z",
    // Australia
    "M 580 220 L 650 215 L 680 230 L 670 250 L 620 245 L 580 235 Z",
    // Antarctica
    "M 50 320 L 750 320 L 750 380 L 50 380 Z",
  ]

  const getPointColor = (type: string) => {
    switch (type) {
      case "argo":
        return "#3b82f6"
      case "bgc":
        return "#10b981"
      case "deep":
        return "#8b5cf6"
      case "satellite":
        return "#f59e0b"
      case "ice":
        return "#06b6d4"
      default:
        return "#6b7280"
    }
  }

  const getPointIcon = (type: string) => {
    switch (type) {
      case "argo":
        return <Activity className="h-3 w-3" />
      case "bgc":
        return <Beaker className="h-3 w-3" />
      case "deep":
        return <Navigation className="h-3 w-3" />
      case "satellite":
        return <Satellite className="h-3 w-3" />
      case "ice":
        return <Snowflake className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={resetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Badge variant="secondary">Zoom: {zoom.toFixed(1)}x</Badge>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>ARGO ({dataPoints.filter((p) => p.type === "argo").length})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>BGC ({dataPoints.filter((p) => p.type === "bgc").length})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span>Deep ({dataPoints.filter((p) => p.type === "deep").length})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span>Satellite ({dataPoints.filter((p) => p.type === "satellite").length})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
            <span>Ice ({dataPoints.filter((p) => p.type === "ice").length})</span>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div
        className="relative overflow-hidden rounded-lg border bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
        style={{ height: "500px" }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          className="cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleMapClick}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
          }}
        >
          {/* Ocean background */}
          <rect width="800" height="400" fill="url(#oceanGradient)" />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {Array.from({ length: 19 }, (_, i) => (
            <line
              key={`lat-${i}`}
              x1="0"
              y1={i * (400 / 18)}
              x2="800"
              y2={i * (400 / 18)}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 37 }, (_, i) => (
            <line
              key={`lon-${i}`}
              x1={i * (800 / 36)}
              y1="0"
              x2={i * (800 / 36)}
              y2="400"
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="0.5"
            />
          ))}

          {/* Continents */}
          {continents.map((path, index) => (
            <path
              key={index}
              d={path}
              fill="currentColor"
              fillOpacity="0.2"
              stroke="currentColor"
              strokeOpacity="0.4"
              strokeWidth="1"
            />
          ))}

          {/* Data points */}
          {dataPoints.map((point) => (
            <circle
              key={point.id}
              cx={point.x}
              cy={point.y}
              r={zoom > 2 ? "4" : zoom > 1.5 ? "3" : "2"}
              fill={getPointColor(point.type)}
              stroke="white"
              strokeWidth="0.5"
              className="cursor-pointer hover:stroke-2 transition-all animate-pulse"
              onClick={(e) => handlePointClick(point, e)}
              opacity={point.status === "Active" ? 1 : 0.6}
            />
          ))}

          {/* Clicked coordinates marker */}
          {clickedCoords && (
            <circle
              cx={(clickedCoords.lon + 180) * (800 / 360)}
              cy={(90 - clickedCoords.lat) * (400 / 180)}
              r="6"
              fill="red"
              stroke="white"
              strokeWidth="2"
              className="animate-ping"
            />
          )}
        </svg>
      </div>

      {/* Information Panel */}
      {(selectedPoint || clickedCoords) && (
        <Card className="animate-in slide-in-from-bottom-4">
          <CardContent className="p-4">
            {selectedPoint ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPointIcon(selectedPoint.type)}
                    <h3 className="font-semibold">{selectedPoint.id}</h3>
                  </div>
                  <Badge variant={selectedPoint.status === "Active" ? "default" : "secondary"}>
                    {selectedPoint.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Coordinates</p>
                    <p className="font-mono">
                      {selectedPoint.lat.toFixed(3)}°, {selectedPoint.lon.toFixed(3)}°
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="capitalize">{selectedPoint.type} Float</p>
                  </div>
                </div>

                {selectedPoint.data && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {Object.entries(selectedPoint.data).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-muted-foreground capitalize">{key}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : clickedCoords ? (
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Coordinates
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Latitude</p>
                    <p className="font-mono text-lg">{clickedCoords.lat.toFixed(4)}°</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Longitude</p>
                    <p className="font-mono text-lg">{clickedCoords.lon.toFixed(4)}°</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Ocean depth: ~{Math.floor(Math.random() * 4000 + 1000)}m | Nearest float:{" "}
                  {Math.floor(Math.random() * 50 + 10)}km
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
