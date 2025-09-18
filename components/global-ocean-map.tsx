"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Navigation, Waves, Thermometer, Droplets } from "lucide-react"

interface DataPoint {
  id: string
  lat: number
  lon: number
  type: "argo" | "satellite" | "buoy" | "glider"
  temperature?: number
  salinity?: number
  depth?: number
  status: "active" | "maintenance" | "inactive"
}

const generateOceanData = (): DataPoint[] => {
  const data: DataPoint[] = []

  // Major ocean basins with realistic coordinates
  const oceanRegions = [
    { name: "North Atlantic", latRange: [30, 70], lonRange: [-80, 0] },
    { name: "South Atlantic", latRange: [-60, 30], lonRange: [-70, 20] },
    { name: "North Pacific", latRange: [0, 60], lonRange: [120, -120] },
    { name: "South Pacific", latRange: [-60, 0], lonRange: [120, -70] },
    { name: "Indian Ocean", latRange: [-60, 30], lonRange: [20, 120] },
    { name: "Arctic Ocean", latRange: [60, 90], lonRange: [-180, 180] },
    { name: "Southern Ocean", latRange: [-90, -50], lonRange: [-180, 180] },
  ]

  let id = 1
  oceanRegions.forEach((region) => {
    // Generate ARGO floats
    for (let i = 0; i < 50; i++) {
      const lat = region.latRange[0] + Math.random() * (region.latRange[1] - region.latRange[0])
      const lon = region.lonRange[0] + Math.random() * (region.lonRange[1] - region.lonRange[0])

      data.push({
        id: `ARGO-${id++}`,
        lat,
        lon,
        type: "argo",
        temperature: 2 + Math.random() * 28, // 2-30°C
        salinity: 32 + Math.random() * 6, // 32-38 PSU
        depth: Math.random() * 2000,
        status: Math.random() > 0.1 ? "active" : Math.random() > 0.5 ? "maintenance" : "inactive",
      })
    }

    // Generate satellite data points
    for (let i = 0; i < 20; i++) {
      const lat = region.latRange[0] + Math.random() * (region.latRange[1] - region.latRange[0])
      const lon = region.lonRange[0] + Math.random() * (region.lonRange[1] - region.lonRange[0])

      data.push({
        id: `SAT-${id++}`,
        lat,
        lon,
        type: "satellite",
        temperature: 5 + Math.random() * 25,
        status: "active",
      })
    }

    // Generate buoys
    for (let i = 0; i < 15; i++) {
      const lat = region.latRange[0] + Math.random() * (region.latRange[1] - region.latRange[0])
      const lon = region.lonRange[0] + Math.random() * (region.lonRange[1] - region.lonRange[0])

      data.push({
        id: `BUOY-${id++}`,
        lat,
        lon,
        type: "buoy",
        temperature: 8 + Math.random() * 22,
        salinity: 33 + Math.random() * 4,
        status: Math.random() > 0.05 ? "active" : "maintenance",
      })
    }
  })

  return data
}

export default function GlobalOceanMap() {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [selectedPoint, setSelectedPoint] = useState<DataPoint | null>(null)
  const [clickCoords, setClickCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [dataPoints] = useState<DataPoint[]>(generateOceanData())
  const [filter, setFilter] = useState<string>("all")

  const handleMapClick = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convert pixel coordinates to lat/lon (simplified projection)
    const lon = ((x - pan.x) / zoom - 400) * 0.45 // Approximate conversion
    const lat = (200 - (y - pan.y) / zoom) * 0.45 // Approximate conversion

    setClickCoords({ lat: Math.max(-90, Math.min(90, lat)), lon: Math.max(-180, Math.min(180, lon)) })
    setSelectedPoint(null)
  }

  const handlePointClick = (point: DataPoint, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedPoint(point)
    setClickCoords(null)
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setSelectedPoint(null)
    setClickCoords(null)
  }

  const filteredPoints = dataPoints.filter(
    (point) => filter === "all" || point.type === filter || point.status === filter,
  )

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setZoom(Math.min(3, zoom * 1.2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setZoom(Math.max(0.5, zoom / 1.2))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={resetView}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            All ({dataPoints.length})
          </Button>
          <Button size="sm" variant={filter === "argo" ? "default" : "outline"} onClick={() => setFilter("argo")}>
            ARGO ({dataPoints.filter((p) => p.type === "argo").length})
          </Button>
          <Button
            size="sm"
            variant={filter === "satellite" ? "default" : "outline"}
            onClick={() => setFilter("satellite")}
          >
            Satellites ({dataPoints.filter((p) => p.type === "satellite").length})
          </Button>
          <Button size="sm" variant={filter === "active" ? "default" : "outline"} onClick={() => setFilter("active")}>
            Active Only ({dataPoints.filter((p) => p.status === "active").length})
          </Button>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg overflow-hidden border-2 border-primary/20">
        <svg width="100%" height="500" viewBox="0 0 800 400" className="cursor-crosshair" onClick={handleMapClick}>
          {/* Ocean Background */}
          <defs>
            <pattern id="oceanPattern" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="hsl(var(--primary))" fillOpacity="0.05" />
              <path
                d="M0,10 Q5,5 10,10 T20,10"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                fill="none"
                opacity="0.3"
              />
            </pattern>
          </defs>

          <rect
            width="800"
            height="400"
            fill="url(#oceanPattern)"
            transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          />

          {/* Simplified World Continents */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* North America */}
            <path
              d="M100,80 L200,60 L250,100 L200,150 L120,140 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            {/* South America */}
            <path
              d="M180,200 L220,180 L240,250 L200,300 L170,280 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            {/* Europe */}
            <path
              d="M380,70 L420,60 L440,90 L410,110 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            {/* Africa */}
            <path
              d="M380,120 L440,110 L460,200 L420,280 L380,260 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            {/* Asia */}
            <path
              d="M450,50 L600,40 L650,120 L580,140 L450,100 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            {/* Australia */}
            <path
              d="M580,250 L650,240 L670,280 L620,290 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
            {/* Antarctica */}
            <path
              d="M100,350 L700,350 L700,380 L100,380 Z"
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          </g>

          {/* Grid Lines */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} opacity="0.3">
            {/* Latitude lines */}
            {[-60, -30, 0, 30, 60].map((lat) => (
              <line
                key={lat}
                x1="0"
                y1={200 - (lat * 200) / 90}
                x2="800"
                y2={200 - (lat * 200) / 90}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            ))}
            {/* Longitude lines */}
            {[-120, -60, 0, 60, 120].map((lon) => (
              <line
                key={lon}
                x1={400 + (lon * 400) / 180}
                y1="0"
                x2={400 + (lon * 400) / 180}
                y2="400"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.5"
                strokeDasharray="2,2"
              />
            ))}
          </g>

          {/* Data Points */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {filteredPoints.map((point) => {
              const x = 400 + (point.lon * 400) / 180
              const y = 200 - (point.lat * 200) / 90

              return (
                <g key={point.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r={point.type === "argo" ? "3" : point.type === "satellite" ? "2" : "2.5"}
                    fill={
                      point.type === "argo"
                        ? "hsl(var(--chart-1))"
                        : point.type === "satellite"
                          ? "hsl(var(--chart-2))"
                          : point.type === "buoy"
                            ? "hsl(var(--chart-3))"
                            : "hsl(var(--chart-4))"
                    }
                    stroke={point.status === "active" ? "white" : "hsl(var(--muted-foreground))"}
                    strokeWidth="1"
                    className="cursor-pointer hover:r-4 transition-all animate-pulse"
                    onClick={(e) => handlePointClick(point, e)}
                    opacity={point.status === "active" ? 1 : 0.6}
                  />
                  {point.status === "active" && (
                    <circle
                      cx={x}
                      cy={y}
                      r="6"
                      fill="none"
                      stroke={
                        point.type === "argo"
                          ? "hsl(var(--chart-1))"
                          : point.type === "satellite"
                            ? "hsl(var(--chart-2))"
                            : point.type === "buoy"
                              ? "hsl(var(--chart-3))"
                              : "hsl(var(--chart-4))"
                      }
                      strokeWidth="1"
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}
                </g>
              )
            })}
          </g>

          {/* Click Coordinates Marker */}
          {clickCoords && (
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              <circle
                cx={400 + (clickCoords.lon * 400) / 180}
                cy={200 - (clickCoords.lat * 200) / 90}
                r="5"
                fill="none"
                stroke="hsl(var(--destructive))"
                strokeWidth="2"
                className="animate-ping"
              />
              <circle
                cx={400 + (clickCoords.lon * 400) / 180}
                cy={200 - (clickCoords.lat * 200) / 90}
                r="2"
                fill="hsl(var(--destructive))"
              />
            </g>
          )}
        </svg>

        {/* Zoom Level Indicator */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
          Zoom: {zoom.toFixed(1)}x
        </div>
      </div>

      {/* Information Panel */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Selected Point Info */}
        {selectedPoint && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                {selectedPoint.type.toUpperCase()} {selectedPoint.id}
              </CardTitle>
              <CardDescription>Detailed sensor information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Latitude</p>
                    <p className="font-mono">{selectedPoint.lat.toFixed(4)}°</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Longitude</p>
                    <p className="font-mono">{selectedPoint.lon.toFixed(4)}°</p>
                  </div>
                </div>

                {selectedPoint.temperature && (
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-chart-1" />
                    <span className="text-sm">Temperature: {selectedPoint.temperature.toFixed(1)}°C</span>
                  </div>
                )}

                {selectedPoint.salinity && (
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-chart-2" />
                    <span className="text-sm">Salinity: {selectedPoint.salinity.toFixed(1)} PSU</span>
                  </div>
                )}

                {selectedPoint.depth && (
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4 text-chart-3" />
                    <span className="text-sm">Depth: {selectedPoint.depth.toFixed(0)}m</span>
                  </div>
                )}

                <Badge variant={selectedPoint.status === "active" ? "default" : "secondary"}>
                  {selectedPoint.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Click Coordinates Info */}
        {clickCoords && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Coordinates
              </CardTitle>
              <CardDescription>Clicked location information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Latitude</p>
                    <p className="font-mono text-lg">{clickCoords.lat.toFixed(4)}°</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Longitude</p>
                    <p className="font-mono text-lg">{clickCoords.lon.toFixed(4)}°</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Ocean Region:{" "}
                    {clickCoords.lat > 60
                      ? "Arctic Ocean"
                      : clickCoords.lat < -50
                        ? "Southern Ocean"
                        : clickCoords.lon > -30 && clickCoords.lon < 20 && clickCoords.lat > -35 && clickCoords.lat < 70
                          ? "Atlantic Ocean"
                          : clickCoords.lon > 20 &&
                              clickCoords.lon < 120 &&
                              clickCoords.lat > -60 &&
                              clickCoords.lat < 30
                            ? "Indian Ocean"
                            : "Pacific Ocean"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <Card className={selectedPoint || clickCoords ? "md:col-span-2" : ""}>
          <CardHeader>
            <CardTitle>Map Legend</CardTitle>
            <CardDescription>Data point types and status indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                <span>ARGO Floats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                <span>Satellites</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-3"></div>
                <span>Buoys</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                <span>Active Status</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
