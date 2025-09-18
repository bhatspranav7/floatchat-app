"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  BarChart3,
  Waves,
  Thermometer,
  Droplets,
  Gauge,
  Wind,
  Satellite,
  Eye,
  Snowflake,
  Activity,
  Globe,
  Zap,
  Beaker,
  Mountain,
  Compass,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [animatedStats, setAnimatedStats] = useState({ floats: 0, profiles: 0, coverage: 0, satellites: 0 })
  const [currentDataIndex, setCurrentDataIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats((prev) => ({
        floats: prev.floats < 4127 ? prev.floats + 50 : 4127,
        profiles: prev.profiles < 2847 ? prev.profiles + 35 : 2847,
        coverage: prev.coverage < 89.2 ? prev.coverage + 1.2 : 89.2,
        satellites: prev.satellites < 847 ? prev.satellites + 12 : 847,
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const dataInterval = setInterval(() => {
      setCurrentDataIndex((prev) => (prev + 1) % oceanDataTypes.length)
    }, 3000)
    return () => clearInterval(dataInterval)
  }, [])

  const features = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "AI Ocean Assistant",
      description: "Natural language queries for comprehensive ocean data analysis across all parameters",
      example: "Show me SST anomalies in the North Atlantic during El Niño events with BGC correlations",
      capabilities: ["Multi-parameter analysis", "Climate trend detection", "Real-time data queries"],
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics Dashboard",
      description: "Integrated visualization of ARGO, satellite, and biogeochemical data with AI insights",
      example: "Compare chlorophyll concentrations with sea surface height variations across ocean basins",
      capabilities: ["Core ARGO data", "BGC parameters", "Deep ocean profiles", "Satellite altimetry"],
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Interactive Global Maps",
      description: "Zoomable world maps with real-time data points, satellite tracks, and float trajectories",
      example: "Track sea ice thickness changes in the Arctic with ARGO float validation",
      capabilities: ["Zoom & pan controls", "Live data points", "Coordinate display", "Multi-layer visualization"],
    },
  ]

  const oceanParams = [
    {
      icon: <Thermometer className="h-5 w-5 text-chart-1" />,
      name: "Sea Surface Temp",
      unit: "°C",
      value: "24.5",
      trend: "+1.2",
    },
    {
      icon: <Satellite className="h-5 w-5 text-chart-2" />,
      name: "Sea Surface Height",
      unit: "cm",
      value: "+12.3",
      trend: "+2.1",
    },
    {
      icon: <Eye className="h-5 w-5 text-chart-3" />,
      name: "Ocean Color",
      unit: "mg/m³",
      value: "1.92",
      trend: "+0.15",
    },
    { icon: <Snowflake className="h-5 w-5 text-chart-4" />, name: "Sea Ice", unit: "%", value: "78.2", trend: "-2.3" },
    {
      icon: <Droplets className="h-5 w-5 text-chart-1" />,
      name: "Salinity",
      unit: "PSU",
      value: "35.1",
      trend: "+0.02",
    },
    { icon: <Gauge className="h-5 w-5 text-chart-2" />, name: "Pressure", unit: "dbar", value: "1013", trend: "+1.5" },
    { icon: <Wind className="h-5 w-5 text-chart-3" />, name: "Oxygen", unit: "μmol/kg", value: "220", trend: "-8" },
    {
      icon: <Activity className="h-5 w-5 text-chart-4" />,
      name: "Chlorophyll",
      unit: "mg/m³",
      value: "2.1",
      trend: "+0.3",
    },
  ]

  const oceanDataTypes = [
    {
      type: "Core ARGO",
      icon: <Activity className="h-8 w-8" />,
      count: "4,127",
      description: "Temperature, Salinity, Pressure",
    },
    {
      type: "BGC ARGO",
      icon: <Beaker className="h-8 w-8" />,
      count: "1,247",
      description: "Oxygen, pH, Nutrients, Chlorophyll",
    },
    {
      type: "Deep ARGO",
      icon: <Mountain className="h-8 w-8" />,
      count: "456",
      description: "Full-depth 6000m Profiles",
    },
    {
      type: "Satellites",
      icon: <Satellite className="h-8 w-8" />,
      count: "847",
      description: "Jason, Sentinel Altimetry",
    },
    {
      type: "Sea Ice",
      icon: <Snowflake className="h-8 w-8" />,
      count: "234",
      description: "Arctic & Antarctic Monitoring",
    },
    {
      type: "Extensions",
      icon: <Compass className="h-8 w-8" />,
      count: "328",
      description: "Ice Detection, Currents, Waves",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Waves className="h-8 w-8 text-primary animate-wave" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-secondary rounded-full animate-pulse" />
                <div className="absolute top-1 left-1 h-2 w-2 bg-primary/50 rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-balance text-primary">OceanScope AI</h1>
                <p className="text-xs text-muted-foreground">Advanced Ocean Data Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="animate-float">
                Live Multi-Platform Data
              </Badge>
              <Badge variant="outline" className="animate-pulse">
                {animatedStats.floats} Active Floats
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-balance text-foreground animate-gradient">
              Ultimate Ocean Intelligence Platform
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed max-w-4xl mx-auto">
              Explore the world's most comprehensive oceanographic database through advanced AI. From ARGO floats to
              satellite observations, discover insights across temperature, salinity, biogeochemical parameters, sea
              ice, climate trends, and deep ocean data.
            </p>
          </div>

          <div className="relative">
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-card/50 to-muted/30 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-6">
                  <div className="text-primary animate-pulse">{oceanDataTypes[currentDataIndex].icon}</div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary">{oceanDataTypes[currentDataIndex].type}</h3>
                    <p className="text-3xl font-bold text-primary">{oceanDataTypes[currentDataIndex].count}</p>
                    <p className="text-sm text-muted-foreground">{oceanDataTypes[currentDataIndex].description}</p>
                  </div>
                  <div className="flex gap-1">
                    {oceanDataTypes.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentDataIndex ? "bg-primary animate-pulse" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {oceanParams.map((param, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-4 text-center relative z-10">
                  <div className="flex justify-center mb-2 group-hover:animate-bounce">{param.icon}</div>
                  <h3 className="font-semibold text-sm">{param.name}</h3>
                  <p className="text-lg font-bold text-primary">{param.value}</p>
                  <p className="text-xs text-muted-foreground">{param.unit}</p>
                  <Badge variant={param.trend.startsWith("+") ? "default" : "destructive"} className="text-xs mt-1">
                    {param.trend}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary animate-pulse">
                {animatedStats.floats.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Active ARGO Floats</div>
              <div className="text-xs text-primary">+23 today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary animate-pulse">
                {animatedStats.profiles.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Daily Profiles</div>
              <div className="text-xs text-secondary">+156 today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-3 animate-pulse">{animatedStats.coverage.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Ocean Coverage</div>
              <div className="text-xs text-chart-3">Global reach</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-chart-4 animate-pulse">
                {animatedStats.satellites.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Satellite Passes</div>
              <div className="text-xs text-chart-4">Daily coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-balance text-foreground">
            Comprehensive Ocean Data Analysis
          </h3>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    activeFeature === index
                      ? "border-primary bg-card shadow-lg scale-105"
                      : "hover:border-primary/50 hover:scale-102"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  {activeFeature === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 animate-pulse" />
                  )}
                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          activeFeature === index ? "bg-primary text-primary-foreground animate-pulse" : "bg-muted"
                        }`}
                      >
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-sm leading-relaxed text-foreground mb-3">
                      {feature.description}
                    </CardDescription>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {feature.capabilities.map((capability, capIndex) => (
                        <Badge key={capIndex} variant="outline" className="text-xs justify-center">
                          {capability}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-3 p-3 bg-muted/50 rounded-lg border-l-4 border-primary/30">
                      <p className="text-xs font-mono text-foreground/70 italic">"{feature.example}"</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <Card className="border-2 border-primary/20 bg-card overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                <CardContent className="p-8 text-center relative z-10">
                  <div className="animate-float mb-6 relative">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center relative">
                      <Waves className="h-16 w-16 text-primary animate-wave" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary/30 rounded-full animate-ping" />
                      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-chart-3/40 rounded-full animate-pulse" />
                      <div className="absolute top-4 right-4 w-4 h-4 bg-chart-4/50 rounded-full animate-bounce" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-semibold mb-4 text-foreground">Ready to Explore Ocean Intelligence?</h4>
                  <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
                    Dive into the world's most comprehensive ocean intelligence platform with AI-powered insights,
                    real-time data visualization, and advanced analytics across all oceanographic parameters.
                  </p>

                  <div className="space-y-3">
                    <Link href="/chat">
                      <Button
                        className="w-full group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                        size="lg"
                      >
                        <MessageCircle className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                        Start AI Ocean Chat
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full bg-transparent group border-2" size="lg">
                        <BarChart3 className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                        Explore Interactive Dashboard
                      </Button>
                    </Link>
                    <div className="flex gap-2 mt-4">
                      <Badge variant="secondary" className="flex-1 justify-center py-2">
                        <Globe className="mr-1 h-3 w-3" />
                        Global Coverage
                      </Badge>
                      <Badge variant="secondary" className="flex-1 justify-center py-2">
                        <Zap className="mr-1 h-3 w-3" />
                        Real-time Data
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link href="/" className="flex flex-col items-center gap-1 p-2 text-primary">
              <Waves className="h-5 w-5 animate-wave" />
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link
              href="/chat"
              className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">AI Chat</span>
            </Link>
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-xs">Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
