"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ClickedLocation {
  lat: number
  lon: number
  x: number
  y: number
}

export default function SimpleWorldMap() {
  const [clickedLocation, setClickedLocation] = useState<ClickedLocation | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  // Convert screen coordinates to lat/lon
  const screenToLatLon = (x: number, y: number, rect: DOMRect) => {
    const relativeX = (x - rect.left) / rect.width
    const relativeY = (y - rect.top) / rect.height

    const lon = relativeX * 360 - 180
    const lat = 90 - relativeY * 180

    return { lat: Math.round(lat * 100) / 100, lon: Math.round(lon * 100) / 100 }
  }

  const handleMapClick = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const { lat, lon } = screenToLatLon(event.clientX, event.clientY, rect)

    setClickedLocation({
      lat,
      lon,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  // Simplified world map paths (major continents)
  const continentPaths = [
    // North America
    "M 120 80 L 180 70 L 200 90 L 190 120 L 160 130 L 140 120 L 120 100 Z",
    // South America
    "M 160 140 L 180 135 L 185 180 L 175 200 L 165 195 L 155 170 Z",
    // Europe
    "M 240 70 L 260 65 L 270 80 L 265 90 L 245 85 Z",
    // Africa
    "M 245 90 L 270 85 L 280 140 L 270 180 L 250 175 L 240 130 Z",
    // Asia
    "M 270 60 L 350 55 L 380 80 L 370 110 L 340 115 L 280 100 Z",
    // Australia
    "M 340 160 L 380 155 L 385 175 L 375 180 L 345 175 Z",
    // Antarctica
    "M 100 220 L 400 220 L 400 240 L 100 240 Z",
  ]

  return (
    <div className="relative w-full">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <svg
              width="100%"
              height="400"
              viewBox="0 0 500 250"
              className="cursor-crosshair bg-gradient-to-b from-slate-900 to-slate-800"
              onClick={handleMapClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Ocean background */}
              <rect width="500" height="250" fill="url(#oceanGradient)" />

              {/* Gradient definitions */}
              <defs>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="1" />
                  <stop offset="50%" stopColor="#1e293b" stopOpacity="1" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
                </linearGradient>
                <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#374151" stopOpacity="1" />
                  <stop offset="100%" stopColor="#1f2937" stopOpacity="1" />
                </linearGradient>
              </defs>

              {/* Grid lines for reference */}
              <g stroke="#0891b2" strokeWidth="0.5" opacity="0.4">
                {[0, 50, 100, 150, 200, 250].map((y) => (
                  <line key={`lat-${y}`} x1="0" y1={y} x2="500" y2={y} />
                ))}
                {[0, 100, 200, 300, 400, 500].map((x) => (
                  <line key={`lon-${x}`} x1={x} y1="0" x2={x} y2="250" />
                ))}
              </g>

              {/* Continents */}
              {continentPaths.map((path, index) => (
                <path
                  key={index}
                  d={path}
                  fill="url(#landGradient)"
                  stroke="#06b6d4"
                  strokeWidth="1"
                  className="hover:fill-opacity-90 transition-all duration-200"
                />
              ))}

              {/* Equator line */}
              <line
                x1="0"
                y1="125"
                x2="500"
                y2="125"
                stroke="#0ea5e9"
                strokeWidth="1.5"
                strokeDasharray="5,5"
                opacity="0.8"
              />

              {/* Prime Meridian */}
              <line
                x1="250"
                y1="0"
                x2="250"
                y2="250"
                stroke="#0ea5e9"
                strokeWidth="1.5"
                strokeDasharray="5,5"
                opacity="0.8"
              />

              {/* Clicked location marker */}
              {clickedLocation && (
                <g>
                  <circle
                    cx={clickedLocation.x}
                    cy={clickedLocation.y}
                    r="6"
                    fill="hsl(var(--destructive))"
                    stroke="white"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  <circle
                    cx={clickedLocation.x}
                    cy={clickedLocation.y}
                    r="12"
                    fill="none"
                    stroke="hsl(var(--destructive))"
                    strokeWidth="1"
                    opacity="0.5"
                    className="animate-ping"
                  />
                </g>
              )}

              {/* Coordinate labels */}
              <text x="10" y="20" fill="#0ea5e9" fontSize="10" fontWeight="500">
                90°N
              </text>
              <text x="10" y="130" fill="#0ea5e9" fontSize="10" fontWeight="500">
                0°
              </text>
              <text x="10" y="240" fill="#0ea5e9" fontSize="10" fontWeight="500">
                90°S
              </text>
              <text x="5" y="245" fill="#0ea5e9" fontSize="10" fontWeight="500">
                180°W
              </text>
              <text x="245" y="245" fill="#0ea5e9" fontSize="10" fontWeight="500">
                0°
              </text>
              <text x="475" y="245" fill="#0ea5e9" fontSize="10" fontWeight="500">
                180°E
              </text>
            </svg>

            {/* Coordinate display */}
            {clickedLocation && (
              <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
                <div className="text-sm font-medium mb-1">Coordinates</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Latitude: {clickedLocation.lat}°</div>
                  <div>Longitude: {clickedLocation.lon}°</div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
              <div className="text-xs text-muted-foreground">
                {isHovering ? "Click anywhere to get coordinates" : "Hover over map to interact"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
