"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Globe, Satellite, Navigation, X } from "lucide-react"

interface MapPoint {
  lat: number
  lon: number
  id: string
  type: "argo" | "satellite" | "bgc" | "ice"
  status: string
  data?: any
}

const mapPoints: MapPoint[] = [
  { lat: 35.2, lon: -120.5, id: "F001", type: "argo", status: "Active" },
  { lat: 42.1, lon: -125.3, id: "F002", type: "argo", status: "Active" },
  { lat: 28.7, lon: -118.2, id: "F003", type: "argo", status: "Maintenance" },
  { lat: 31.5, lon: -122.8, id: "F004", type: "argo", status: "Active" },
  { lat: 60.2, lon: -150.1, id: "S001", type: "satellite", status: "Passing" },
  { lat: -45.3, lon: 170.8, id: "B001", type: "bgc", status: "Sampling" },
  { lat: 75.1, lon: -10.2, id: "I001", type: "ice", status: "Monitoring" },
  { lat: -60.5, lon: -45.7, id: "I002", type: "ice", status: "Monitoring" },
]

interface WorldMapProps {
  onPointClick?: (point: MapPoint) => void
}

export default function WorldMap({ onPointClick }: WorldMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null)
  const [showCoordinates, setShowCoordinates] = useState(false)
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lon: number } | null>(null)

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Convert pixel coordinates to lat/lon (simplified projection)
    const lon = (x / rect.width) * 360 - 180
    const lat = 90 - (y / rect.height) * 180

    setClickedCoords({ lat: Math.round(lat * 100) / 100, lon: Math.round(lon * 100) / 100 })
    setShowCoordinates(true)
  }

  const handlePointClick = (point: MapPoint, event: React.MouseEvent) => {
    event.stopPropagation()
    setSelectedPoint(point)
    if (onPointClick) {
      onPointClick(point)
    }
  }

  const getPointColor = (type: string) => {
    switch (type) {
      case "argo":
        return "bg-primary"
      case "satellite":
        return "bg-secondary"
      case "bgc":
        return "bg-chart-3"
      case "ice":
        return "bg-chart-4"
      default:
        return "bg-muted"
    }
  }

  const getPointIcon = (type: string) => {
    switch (type) {
      case "argo":
        return <MapPin className="h-3 w-3" />
      case "satellite":
        return <Satellite className="h-3 w-3" />
      case "bgc":
        return <Globe className="h-3 w-3" />
      case "ice":
        return <Navigation className="h-3 w-3" />
      default:
        return <MapPin className="h-3 w-3" />
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="relative h-96 bg-gradient-to-br from-blue-50 via-blue-100 to-teal-100 dark:from-blue-950 dark:via-blue-900 dark:to-teal-900 rounded-lg overflow-hidden border-2 border-primary/20 cursor-crosshair"
        onClick={handleMapClick}
      >
        {/* World map background pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Simplified world continents */}
            <path
              d="M50 80 Q80 70 120 75 Q160 80 200 85 Q240 90 280 85 Q320 80 350 85 L350 120 Q320 115 280 120 Q240 125 200 120 Q160 115 120 120 Q80 125 50 120 Z"
              fill="currentColor"
              className="text-muted-foreground/30"
            />
            <path
              d="M80 40 Q120 35 160 40 Q200 45 240 40 Q280 35 320 40 L320 70 Q280 65 240 70 Q200 75 160 70 Q120 65 80 70 Z"
              fill="currentColor"
              className="text-muted-foreground/30"
            />
            <path
              d="M100 140 Q140 135 180 140 Q220 145 260 140 Q300 135 340 140 L340 170 Q300 165 260 170 Q220 175 180 170 Q140 165 100 170 Z"
              fill="currentColor"
              className="text-muted-foreground/30"
            />
          </svg>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {/* Latitude lines */}
          {[...Array(9)].map((_, i) => (
            <div
              key={`lat-${i}`}
              className="absolute w-full border-t border-current"
              style={{ top: `${(i + 1) * 10}%` }}
            />
          ))}
          {/* Longitude lines */}
          {[...Array(17)].map((_, i) => (
            <div
              key={`lon-${i}`}
              className="absolute h-full border-l border-current"
              style={{ left: `${(i + 1) * 5.88}%` }}
            />
          ))}
        </div>

        {/* Map points */}
        {mapPoints.map((point) => {
          const x = ((point.lon + 180) / 360) * 100
          const y = ((90 - point.lat) / 180) * 100

          return (
            <div
              key={point.id}
              className={`absolute w-4 h-4 ${getPointColor(point.type)} rounded-full animate-pulse shadow-lg cursor-pointer hover:scale-125 transition-transform flex items-center justify-center text-white`}
              style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
              onClick={(e) => handlePointClick(point, e)}
              title={`${point.id} (${point.lat}°, ${point.lon}°)`}
            >
              {getPointIcon(point.type)}
            </div>
          )
        })}

        {/* Coordinate display */}
        {showCoordinates && clickedCoords && (
          <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">Coordinates</p>
                <p className="text-xs text-muted-foreground">
                  Lat: {clickedCoords.lat}°, Lon: {clickedCoords.lon}°
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowCoordinates(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Selected point details */}
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg min-w-48">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="font-medium">{selectedPoint.id}</h4>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPoint(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1 text-sm">
              <p>
                Type: <Badge variant="outline">{selectedPoint.type.toUpperCase()}</Badge>
              </p>
              <p>
                Status:{" "}
                <Badge variant={selectedPoint.status === "Active" ? "default" : "secondary"}>
                  {selectedPoint.status}
                </Badge>
              </p>
              <p className="text-muted-foreground">
                {selectedPoint.lat}°N, {selectedPoint.lon}°W
              </p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <h4 className="text-sm font-medium mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span>ARGO Floats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span>Satellites</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
              <span>BGC Floats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-chart-4 rounded-full"></div>
              <span>Sea Ice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="sm">
          <MapPin className="mr-2 h-4 w-4" />
          ARGO Floats ({mapPoints.filter((p) => p.type === "argo").length})
        </Button>
        <Button variant="outline" size="sm">
          <Satellite className="mr-2 h-4 w-4" />
          Satellites ({mapPoints.filter((p) => p.type === "satellite").length})
        </Button>
        <Button variant="outline" size="sm">
          <Globe className="mr-2 h-4 w-4" />
          BGC Floats ({mapPoints.filter((p) => p.type === "bgc").length})
        </Button>
        <Button variant="outline" size="sm">
          <Navigation className="mr-2 h-4 w-4" />
          Sea Ice ({mapPoints.filter((p) => p.type === "ice").length})
        </Button>
      </div>
    </div>
  )
}
