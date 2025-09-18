"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts"
import {
  Waves,
  MessageCircle,
  BarChart3,
  Thermometer,
  Droplets,
  Activity,
  Globe,
  Snowflake,
  Zap,
  Navigation,
  TrendingUp,
  Beaker,
  Mountain,
  Wind,
  Cloud,
  Sun,
  Anchor,
  Fish,
  TreePine,
} from "lucide-react"
import Link from "next/link"
import DataFilters from "@/components/data-filters"
import SimpleWorldMap from "@/components/simple-world-map"

const physicalOceanographyData = {
  temperature: [
    { depth: 0, temp: 24.5, sst: 24.8, anomaly: 1.2 },
    { depth: 50, temp: 22.1, sst: 24.8, anomaly: 0.8 },
    { depth: 100, temp: 18.7, sst: 24.8, anomaly: 0.3 },
    { depth: 200, temp: 12.3, sst: 24.8, anomaly: -0.2 },
    { depth: 500, temp: 8.1, sst: 24.8, anomaly: -0.5 },
    { depth: 1000, temp: 4.2, sst: 24.8, anomaly: -0.8 },
    { depth: 2000, temp: 2.1, sst: 24.8, anomaly: -1.1 },
  ],
  salinity: [
    { depth: 0, salinity: 34.2, density: 1023.5 },
    { depth: 50, salinity: 34.5, density: 1024.2 },
    { depth: 100, salinity: 34.8, density: 1025.1 },
    { depth: 200, salinity: 35.1, density: 1026.8 },
    { depth: 500, salinity: 35.3, density: 1027.2 },
    { depth: 1000, salinity: 35.0, density: 1027.8 },
    { depth: 2000, salinity: 34.9, density: 1028.1 },
  ],
  currents: [
    { region: "Gulf Stream", velocity: 2.5, direction: 45, transport: 150 },
    { region: "Kuroshio", velocity: 1.8, direction: 30, transport: 120 },
    { region: "Agulhas", velocity: 2.1, direction: 180, transport: 85 },
    { region: "Antarctic Circumpolar", velocity: 0.8, direction: 90, transport: 600 },
  ],
  waves: [
    { region: "North Atlantic", height: 3.2, period: 8.5, direction: 270 },
    { region: "North Pacific", height: 2.8, period: 7.2, direction: 225 },
    { region: "Southern Ocean", height: 4.5, period: 12.1, direction: 280 },
    { region: "Indian Ocean", height: 2.1, period: 6.8, direction: 180 },
  ],
}

const atmosphereOceanData = {
  airSeaFlux: [
    { month: "Jan", heatFlux: -45, evaporation: 3.2, precipitation: 2.1, windStress: 0.15 },
    { month: "Feb", heatFlux: -38, evaporation: 3.5, precipitation: 1.8, windStress: 0.18 },
    { month: "Mar", heatFlux: -12, evaporation: 4.1, precipitation: 2.5, windStress: 0.12 },
    { month: "Apr", heatFlux: 25, evaporation: 4.8, precipitation: 3.2, windStress: 0.08 },
    { month: "May", heatFlux: 68, evaporation: 5.2, precipitation: 2.8, windStress: 0.06 },
    { month: "Jun", heatFlux: 95, evaporation: 5.8, precipitation: 1.5, windStress: 0.05 },
  ],
  windPatterns: [
    { region: "Trade Winds", speed: 12.5, direction: 75, consistency: 85 },
    { region: "Westerlies", speed: 18.2, direction: 270, consistency: 72 },
    { region: "Polar Easterlies", speed: 8.7, direction: 90, consistency: 68 },
    { region: "Monsoon", speed: 15.3, direction: 180, consistency: 45 },
  ],
}

const biogeochemicalData = {
  nutrients: [
    { depth: 0, nitrate: 2.1, phosphate: 0.15, silicate: 8.2, oxygen: 220 },
    { depth: 50, nitrate: 5.2, phosphate: 0.32, silicate: 12.5, oxygen: 210 },
    { depth: 100, nitrate: 12.5, phosphate: 0.85, silicate: 18.7, oxygen: 180 },
    { depth: 200, nitrate: 18.7, phosphate: 1.25, silicate: 25.3, oxygen: 150 },
    { depth: 500, nitrate: 25.3, phosphate: 1.85, silicate: 35.8, oxygen: 120 },
    { depth: 1000, nitrate: 32.1, phosphate: 2.15, silicate: 45.2, oxygen: 140 },
  ],
  carbonCycle: [
    { region: "Tropical", co2: 415, ph: 8.05, alkalinity: 2300, dic: 2050 },
    { region: "Temperate", co2: 408, ph: 8.12, alkalinity: 2280, dic: 2020 },
    { region: "Polar", co2: 395, ph: 8.18, alkalinity: 2250, dic: 1980 },
    { region: "Upwelling", co2: 450, ph: 7.95, alkalinity: 2320, dic: 2120 },
  ],
  primaryProduction: [
    { month: "Jan", chlorophyll: 0.85, productivity: 2.1, biomass: 15.2 },
    { month: "Feb", chlorophyll: 0.92, productivity: 2.3, biomass: 16.8 },
    { month: "Mar", chlorophyll: 1.15, productivity: 2.8, biomass: 21.5 },
    { month: "Apr", chlorophyll: 1.45, productivity: 3.2, biomass: 28.7 },
    { month: "May", chlorophyll: 1.78, productivity: 3.8, biomass: 35.2 },
    { month: "Jun", chlorophyll: 1.92, productivity: 4.1, biomass: 38.9 },
  ],
}

const climateSeasonalData = {
  seasonalCycles: [
    { month: "Jan", sst: 18.2, mld: 85, heatContent: 2.1 },
    { month: "Feb", sst: 17.8, mld: 95, heatContent: 2.0 },
    { month: "Mar", sst: 18.5, mld: 75, heatContent: 2.2 },
    { month: "Apr", sst: 20.1, mld: 55, heatContent: 2.5 },
    { month: "May", sst: 22.3, mld: 35, heatContent: 2.8 },
    { month: "Jun", sst: 24.8, mld: 25, heatContent: 3.2 },
  ],
  climateIndices: [
    { index: "ENSO", value: 0.8, phase: "El Niño", strength: "Moderate" },
    { index: "NAO", value: -1.2, phase: "Negative", strength: "Strong" },
    { index: "PDO", value: 0.5, phase: "Positive", strength: "Weak" },
    { index: "AMO", value: 0.3, phase: "Positive", strength: "Weak" },
  ],
}

const operationalForecastData = {
  nowcast: [
    { parameter: "SST", current: 24.5, forecast24h: 24.8, forecast7d: 25.2, accuracy: 95.2 },
    { parameter: "Wave Height", current: 2.1, forecast24h: 2.5, forecast7d: 1.8, accuracy: 88.7 },
    { parameter: "Currents", current: 1.2, forecast24h: 1.4, forecast7d: 1.1, accuracy: 82.3 },
    { parameter: "Sea Level", current: 0.15, forecast24h: 0.18, forecast7d: 0.12, accuracy: 91.5 },
  ],
  warnings: [
    { type: "Storm Surge", region: "Gulf Coast", severity: "High", eta: "6 hours" },
    { type: "Rip Currents", region: "California Coast", severity: "Moderate", eta: "Current" },
    { type: "High Waves", region: "North Atlantic", severity: "Severe", eta: "12 hours" },
  ],
}

const cryosphereData = {
  seaIce: [
    { region: "Arctic", concentration: 78.2, thickness: 2.1, extent: 14.5, trend: -2.8 },
    { region: "Antarctic", concentration: 85.7, thickness: 1.8, extent: 18.2, trend: -1.2 },
    { region: "Greenland", concentration: 92.1, thickness: 3.2, extent: 2.1, trend: -4.5 },
    { region: "Bering Sea", concentration: 45.3, thickness: 0.8, extent: 0.9, trend: -8.2 },
  ],
  icebergs: [
    { region: "Antarctic", count: 1247, avgSize: 2.5, driftSpeed: 0.3 },
    { region: "Greenland", count: 456, avgSize: 1.2, driftSpeed: 0.5 },
    { region: "Arctic", count: 89, avgSize: 0.8, driftSpeed: 0.2 },
  ],
  polarOcean: [
    { depth: 0, temp: -1.8, salinity: 32.5, iceConc: 85 },
    { depth: 50, temp: -1.5, salinity: 33.2, iceConc: 0 },
    { depth: 100, temp: 0.2, salinity: 34.1, iceConc: 0 },
    { depth: 200, temp: 1.8, salinity: 34.5, iceConc: 0 },
  ],
}

const floatLocations = [
  { lat: 35.2, lon: -120.5, id: "F001", status: "Active", lastUpdate: "2h ago" },
  { lat: 42.1, lon: -125.3, id: "F002", status: "Active", lastUpdate: "4h ago" },
  { lat: 28.7, lon: -118.2, id: "F003", status: "Maintenance", lastUpdate: "1d ago" },
  { lat: 31.5, lon: -122.8, id: "F004", status: "Active", lastUpdate: "1h ago" },
]

const seaSurfaceHeightData = [
  { region: "Pacific", ssh: 12.3, trend: 2.1, jason: 12.1, sentinel: 12.5 },
  { region: "Atlantic", ssh: 8.7, trend: 1.8, jason: 8.5, sentinel: 8.9 },
  { region: "Indian", ssh: 15.2, trend: 3.2, jason: 15.0, sentinel: 15.4 },
  { region: "Arctic", ssh: -5.1, trend: -1.5, jason: -5.3, sentinel: -4.9 },
  { region: "Southern", ssh: 6.8, trend: 0.9, jason: 6.6, sentinel: 7.0 },
]

const oceanColorData = [
  { month: "Jan", chlorophyll: 0.85, phytoplankton: 2.1, turbidity: 1.2 },
  { month: "Feb", chlorophyll: 0.92, phytoplankton: 2.3, turbidity: 1.1 },
  { month: "Mar", chlorophyll: 1.15, phytoplankton: 2.8, turbidity: 1.0 },
  { month: "Apr", chlorophyll: 1.45, phytoplankton: 3.2, turbidity: 0.9 },
  { month: "May", chlorophyll: 1.78, phytoplankton: 3.8, turbidity: 0.8 },
  { month: "Jun", chlorophyll: 1.92, phytoplankton: 4.1, turbidity: 0.7 },
]

const seaIceData = [
  { region: "Arctic", concentration: 78.2, thickness: 2.1, extent: 14.5 },
  { region: "Antarctic", concentration: 85.7, thickness: 1.8, extent: 18.2 },
  { region: "Greenland", concentration: 92.1, thickness: 3.2, extent: 2.1 },
  { region: "Bering Sea", concentration: 45.3, thickness: 0.8, extent: 0.9 },
]

const coreArgoData = [
  { depth: 0, temp: 24.5, salinity: 34.2, pressure: 0, density: 1023.5 },
  { depth: 10, temp: 24.3, salinity: 34.3, pressure: 1, density: 1023.6 },
  { depth: 50, temp: 22.1, salinity: 34.5, pressure: 5, density: 1024.2 },
  { depth: 100, temp: 18.7, salinity: 34.8, pressure: 10, density: 1025.1 },
  { depth: 200, temp: 12.3, salinity: 35.1, pressure: 20, density: 1026.8 },
  { depth: 500, temp: 8.1, salinity: 35.3, pressure: 50, density: 1027.2 },
  { depth: 1000, temp: 4.2, salinity: 35.0, pressure: 100, density: 1027.8 },
  { depth: 2000, temp: 2.1, salinity: 34.9, pressure: 200, density: 1028.1 },
]

const bgcArgoData = [
  { depth: 0, oxygen: 220, ph: 8.1, nitrate: 2.1, chlorophyll: 0.85, backscatter: 0.002, cdom: 0.15 },
  { depth: 50, oxygen: 210, ph: 8.0, nitrate: 5.2, chlorophyll: 1.2, backscatter: 0.003, cdom: 0.18 },
  { depth: 100, oxygen: 180, ph: 7.9, nitrate: 12.5, chlorophyll: 0.6, backscatter: 0.001, cdom: 0.12 },
  { depth: 200, oxygen: 150, ph: 7.8, nitrate: 18.7, chlorophyll: 0.2, backscatter: 0.001, cdom: 0.08 },
  { depth: 500, oxygen: 120, ph: 7.7, nitrate: 25.3, chlorophyll: 0.05, backscatter: 0.0005, cdom: 0.05 },
  { depth: 1000, oxygen: 140, ph: 7.6, nitrate: 32.1, chlorophyll: 0.01, backscatter: 0.0003, cdom: 0.03 },
]

const deepArgoData = [
  { depth: 2000, temp: 2.1, salinity: 34.9, pressure: 200 },
  { depth: 3000, temp: 1.8, salinity: 34.8, pressure: 300 },
  { depth: 4000, temp: 1.5, salinity: 34.7, pressure: 400 },
  { depth: 5000, temp: 1.2, salinity: 34.7, pressure: 500 },
  { depth: 6000, temp: 0.9, salinity: 34.6, pressure: 600 },
]

const derivedParameters = [
  { parameter: "Mixed Layer Depth", value: "45m", trend: "+2.3m", status: "Normal" },
  { parameter: "Sound Speed", value: "1520 m/s", trend: "+1.2 m/s", status: "Good" },
  { parameter: "Heat Content", value: "2.1 GJ/m²", trend: "+0.15 GJ/m²", status: "High" },
  { parameter: "Potential Density", value: "27.8 kg/m³", trend: "-0.02 kg/m³", status: "Normal" },
  { parameter: "Brunt-Väisälä", value: "0.012 s⁻¹", trend: "+0.001 s⁻¹", status: "Good" },
  { parameter: "Richardson Number", value: "0.85", trend: "-0.05", status: "Stable" },
]

const argoExtensions = [
  { type: "Ice Detection", active: 127, coverage: "Arctic/Antarctic", accuracy: "94.2%" },
  { type: "Surface Currents", active: 89, coverage: "Global", accuracy: "91.7%" },
  { type: "Wave Height", active: 45, coverage: "North Atlantic", accuracy: "88.5%" },
  { type: "Air-Sea Flux", active: 67, coverage: "Tropical Pacific", accuracy: "92.1%" },
]

const regionalObservations = [
  { region: "North Atlantic", floats: 847, profiles: 12450, quality: "97.8%" },
  { region: "North Pacific", floats: 923, profiles: 13890, quality: "96.2%" },
  { region: "South Pacific", floats: 756, profiles: 11230, quality: "98.1%" },
  { region: "Indian Ocean", floats: 634, profiles: 9870, quality: "95.7%" },
  { region: "Southern Ocean", floats: 512, profiles: 8450, quality: "94.3%" },
  { region: "Arctic Ocean", floats: 234, profiles: 3210, quality: "91.8%" },
  { region: "Mediterranean", floats: 156, profiles: 2340, quality: "99.1%" },
]

const climateIndicators = [
  { indicator: "Ocean Heat Content", value: "+0.33 W/m²", change: "+12%", period: "2000-2024" },
  { indicator: "Sea Level Rise", value: "3.4 mm/year", change: "+15%", period: "1993-2024" },
  { indicator: "Ocean pH", value: "8.05", change: "-0.05", period: "2000-2024" },
  { indicator: "Oxygen Minimum", value: "120 μmol/kg", change: "-8%", period: "2000-2024" },
  { indicator: "Thermocline Depth", value: "150m", change: "+5m", period: "2000-2024" },
]

export default function DashboardPage() {
  const [selectedRegion, setSelectedRegion] = useState("Pacific")
  const [activeTab, setActiveTab] = useState("overview")
  const [liveData, setLiveData] = useState(false)
  const [filters, setFilters] = useState({
    region: "global",
    parameter: "temperature",
    dateRange: "30days",
    depthRange: [0, 2000],
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => !prev)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    // Here you would typically trigger data refetch based on filters
    console.log("[v0] Filters updated:", newFilters)
  }

  const stats = [
    {
      title: "Core ARGO Floats",
      value: "4,127",
      change: "+23",
      icon: <Activity className="h-4 w-4" />,
      color: "text-chart-1",
    },
    {
      title: "BGC ARGO Floats",
      value: "1,247",
      change: "+18",
      icon: <Beaker className="h-4 w-4" />,
      color: "text-chart-2",
    },
    {
      title: "Deep ARGO Floats",
      value: "456",
      change: "+7",
      icon: <Mountain className="h-4 w-4" />,
      color: "text-chart-3",
    },
    {
      title: "Daily Profiles",
      value: "2,847",
      change: "+156",
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-chart-4",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Waves className="h-6 w-6 text-primary animate-wave" />
                <div
                  className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${liveData ? "bg-green-500 animate-pulse" : "bg-secondary"}`}
                />
              </div>
              <div>
                <h1 className="text-lg font-semibold">OceanScope Dashboard</h1>
                <p className="text-xs text-muted-foreground">Comprehensive Ocean Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="animate-float">
                Multi-Platform Data
              </Badge>
              <Badge variant={liveData ? "default" : "outline"} className="animate-pulse">
                {liveData ? "Live" : "Updating"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 pb-20">
        <DataFilters onFiltersChange={handleFiltersChange} />

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300 hover:scale-105">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`${stat.color} animate-pulse`}>{stat.icon}</div>
                  <Badge variant="outline" className="text-xs animate-bounce">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
            <TabsTrigger value="physical">Physical</TabsTrigger>
            <TabsTrigger value="atmosphere">Atmosphere</TabsTrigger>
            <TabsTrigger value="biogeochem">Biogeochemical</TabsTrigger>
            <TabsTrigger value="climate">Climate</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="cryosphere">Cryosphere</TabsTrigger>
            <TabsTrigger value="maps">Maps</TabsTrigger>
          </TabsList>

          <TabsContent value="physical" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-chart-1 animate-pulse" />
                    Temperature Profiles
                  </CardTitle>
                  <CardDescription>Sea surface and subsurface temperature distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={physicalOceanographyData.temperature}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="temp"
                        label={{ value: "Temperature (°C)", position: "insideBottom", offset: -5 }}
                      />
                      <YAxis
                        dataKey="depth"
                        reversed
                        label={{ value: "Depth (m)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip />
                      <Line type="monotone" dataKey="temp" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      <Line
                        type="monotone"
                        dataKey="anomaly"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={1}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-chart-2 animate-bounce" />
                    Salinity & Density
                  </CardTitle>
                  <CardDescription>Water mass properties and stratification</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={physicalOceanographyData.salinity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="depth" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="salinity" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      <Area
                        type="monotone"
                        dataKey="density"
                        stroke="hsl(var(--chart-3))"
                        fill="hsl(var(--chart-3))"
                        fillOpacity={0.3}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-chart-3 animate-spin" />
                    Ocean Currents
                  </CardTitle>
                  <CardDescription>Major current systems and transport</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={physicalOceanographyData.currents}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="velocity" fill="hsl(var(--chart-3))" />
                      <Bar dataKey="transport" fill="hsl(var(--chart-4))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-5 w-5 text-chart-4 animate-wave" />
                    Wave Conditions
                  </CardTitle>
                  <CardDescription>Significant wave height and period</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={physicalOceanographyData.waves}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="height"
                        label={{ value: "Wave Height (m)", position: "insideBottom", offset: -5 }}
                      />
                      <YAxis dataKey="period" label={{ value: "Period (s)", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Scatter dataKey="direction" fill="hsl(var(--chart-4))" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="atmosphere" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-chart-1 animate-pulse" />
                    Air-Sea Heat Flux
                  </CardTitle>
                  <CardDescription>Energy exchange between atmosphere and ocean</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={atmosphereOceanData.airSeaFlux}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="heatFlux" fill="hsl(var(--chart-1))" />
                      <Line type="monotone" dataKey="evaporation" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      <Line type="monotone" dataKey="precipitation" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-chart-2 animate-bounce" />
                    Wind Patterns
                  </CardTitle>
                  <CardDescription>Global wind systems and ocean forcing</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={atmosphereOceanData.windPatterns}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="region" />
                      <PolarRadiusAxis />
                      <Radar
                        name="Speed"
                        dataKey="speed"
                        stroke="hsl(var(--chart-2))"
                        fill="hsl(var(--chart-2))"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Consistency"
                        dataKey="consistency"
                        stroke="hsl(var(--chart-3))"
                        fill="hsl(var(--chart-3))"
                        fillOpacity={0.1}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="biogeochem" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-chart-1 animate-pulse" />
                    Nutrient Profiles
                  </CardTitle>
                  <CardDescription>Essential nutrients and dissolved oxygen</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={biogeochemicalData.nutrients}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="depth" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="nitrate" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      <Line type="monotone" dataKey="phosphate" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      <Line type="monotone" dataKey="silicate" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                      <Line type="monotone" dataKey="oxygen" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-chart-2 animate-bounce" />
                    Carbon Cycle
                  </CardTitle>
                  <CardDescription>Ocean carbon system and acidification</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={biogeochemicalData.carbonCycle}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="co2" fill="hsl(var(--chart-1))" />
                      <Bar dataKey="ph" fill="hsl(var(--chart-2))" />
                      <Bar dataKey="alkalinity" fill="hsl(var(--chart-3))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fish className="h-5 w-5 text-chart-3 animate-pulse" />
                    Primary Production
                  </CardTitle>
                  <CardDescription>Phytoplankton and marine productivity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={biogeochemicalData.primaryProduction}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="chlorophyll"
                        stroke="hsl(var(--chart-3))"
                        fill="hsl(var(--chart-3))"
                        fillOpacity={0.4}
                      />
                      <Area
                        type="monotone"
                        dataKey="productivity"
                        stroke="hsl(var(--chart-4))"
                        fill="hsl(var(--chart-4))"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="climate" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-chart-1 animate-pulse" />
                    Seasonal Cycles
                  </CardTitle>
                  <CardDescription>Annual oceanographic patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={climateSeasonalData.seasonalCycles}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sst" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      <Bar dataKey="mld" fill="hsl(var(--chart-2))" />
                      <Area
                        type="monotone"
                        dataKey="heatContent"
                        stroke="hsl(var(--chart-3))"
                        fill="hsl(var(--chart-3))"
                        fillOpacity={0.3}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-chart-2 animate-spin" />
                    Climate Indices
                  </CardTitle>
                  <CardDescription>Major climate oscillations and teleconnections</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {climateSeasonalData.climateIndices.map((index, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{index.index}</p>
                          <Badge variant={index.value > 0 ? "default" : "destructive"}>{index.phase}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <p>Value: {index.value}</p>
                          <p>Strength: {index.strength}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Anchor className="h-5 w-5 text-chart-1 animate-pulse" />
                    Nowcast & Forecast
                  </CardTitle>
                  <CardDescription>Real-time and predicted ocean conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operationalForecastData.nowcast.map((item, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{item.parameter}</p>
                          <Badge variant="outline">{item.accuracy}% Accuracy</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <p>Now: {item.current}</p>
                          <p>24h: {item.forecast24h}</p>
                          <p>7d: {item.forecast7d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-chart-2 animate-bounce" />
                    Marine Warnings
                  </CardTitle>
                  <CardDescription>Active alerts and hazard notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {operationalForecastData.warnings.map((warning, i) => (
                      <div
                        key={i}
                        className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors border-l-4 border-destructive"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{warning.type}</p>
                          <Badge
                            variant={
                              warning.severity === "Severe"
                                ? "destructive"
                                : warning.severity === "High"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {warning.severity}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <p>Region: {warning.region}</p>
                          <p>ETA: {warning.eta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cryosphere" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Snowflake className="h-5 w-5 text-chart-1 animate-spin" />
                    Sea Ice Monitoring
                  </CardTitle>
                  <CardDescription>Ice concentration, thickness, and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cryosphereData.seaIce}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="concentration" fill="hsl(var(--chart-1))" />
                      <Bar dataKey="thickness" fill="hsl(var(--chart-2))" />
                      <Bar dataKey="extent" fill="hsl(var(--chart-3))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="h-5 w-5 text-chart-2 animate-pulse" />
                    Polar Ocean Properties
                  </CardTitle>
                  <CardDescription>Arctic and Antarctic ocean characteristics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={cryosphereData.polarOcean}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="depth" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="temp" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      <Line type="monotone" dataKey="salinity" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      <Area
                        type="monotone"
                        dataKey="iceConc"
                        stroke="hsl(var(--chart-4))"
                        fill="hsl(var(--chart-4))"
                        fillOpacity={0.3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-chart-3 animate-bounce" />
                    Iceberg Tracking
                  </CardTitle>
                  <CardDescription>Large iceberg monitoring and drift patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {cryosphereData.icebergs.map((berg, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{berg.region}</p>
                          <Badge variant="outline">{berg.count} Tracked</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Avg Size: {berg.avgSize} km²</p>
                          <p>Drift Speed: {berg.driftSpeed} m/s</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Maps Tab */}
          <TabsContent value="maps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-chart-1 animate-pulse" />
                  Interactive World Map
                </CardTitle>
                <CardDescription>Click anywhere on the map to get latitude and longitude coordinates</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleWorldMap />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Waves className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
            <Link
              href="/chat"
              className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">AI Chat</span>
            </Link>
            <Link href="/dashboard" className="flex flex-col items-center gap-1 p-2 text-primary">
              <BarChart3 className="h-5 w-5 animate-pulse" />
              <span className="text-xs font-medium">Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
