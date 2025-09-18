"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Send,
  Waves,
  MessageCircle,
  BarChart3,
  Bot,
  User,
  Thermometer,
  Droplets,
  MapPin,
  TrendingUp,
  Satellite,
  Eye,
  Snowflake,
  Zap,
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  suggestions?: string[]
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Welcome to OceanScope AI! I'm your intelligent assistant for comprehensive ocean data analysis. I can help you explore ARGO float measurements, satellite altimetry, sea surface temperature, ocean color, sea ice data, and biogeochemical parameters. What oceanographic insights are you looking for today?",
      timestamp: new Date(),
      suggestions: [
        "Show SST anomalies in the North Pacific",
        "Compare Jason vs Sentinel altimetry data",
        "Analyze chlorophyll trends in the Arabian Sea",
        "Track Arctic sea ice thickness changes",
      ],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    { icon: <Thermometer className="h-4 w-4" />, text: "SST anomalies", color: "bg-chart-1/10 text-chart-1" },
    { icon: <Satellite className="h-4 w-4" />, text: "Satellite altimetry", color: "bg-chart-2/10 text-chart-2" },
    { icon: <Eye className="h-4 w-4" />, text: "Ocean color", color: "bg-chart-3/10 text-chart-3" },
    { icon: <Snowflake className="h-4 w-4" />, text: "Sea ice data", color: "bg-chart-4/10 text-chart-4" },
    { icon: <Droplets className="h-4 w-4" />, text: "Salinity profiles", color: "bg-chart-1/10 text-chart-1" },
    { icon: <Zap className="h-4 w-4" />, text: "BGC parameters", color: "bg-chart-2/10 text-chart-2" },
    { icon: <MapPin className="h-4 w-4" />, text: "Float locations", color: "bg-chart-3/10 text-chart-3" },
    { icon: <TrendingUp className="h-4 w-4" />, text: "Climate trends", color: "bg-chart-4/10 text-chart-4" },
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: generateBotResponse(content),
        timestamp: new Date(),
        suggestions: generateSuggestions(content),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("sst") || input.includes("sea surface temperature")) {
      return "I've analyzed the latest SST data from our satellite constellation! Current global SST shows interesting patterns with El Niño influences in the Pacific. The North Atlantic is showing +1.2°C anomalies, while the Eastern Pacific displays cooling trends. ARGO floats confirm these satellite observations with high-resolution vertical profiles. Would you like me to show specific regional analysis or compare with historical baselines?"
    }

    if (input.includes("altimetry") || input.includes("sea surface height") || input.includes("ssh")) {
      return "Excellent question about altimetry! Our Jason-3 and Sentinel-6 satellites are providing exceptional SSH measurements. Current data shows +12.3cm average global SSH with regional variations: Pacific (+15.2cm), Atlantic (+8.7cm), and concerning Arctic trends (-5.1cm). The 2.1mm/year rise rate aligns with climate projections. Shall I break down the regional patterns or show you the satellite track coverage?"
    }

    if (input.includes("ocean color") || input.includes("chlorophyll") || input.includes("phytoplankton")) {
      return "Ocean color analysis reveals fascinating biological patterns! Current chlorophyll concentrations show seasonal blooms with peak values of 1.92 mg/m³ in productive regions. The Arabian Sea displays unique biogeochemical signatures, while polar regions show dramatic seasonal variations. Phytoplankton biomass correlates strongly with nutrient upwelling patterns. Would you like to explore specific bloom events or compare inter-annual variability?"
    }

    if (input.includes("sea ice") || input.includes("arctic") || input.includes("antarctic")) {
      return "Sea ice monitoring shows critical climate indicators! Arctic concentration is at 78.2% with 2.1m average thickness, while Antarctic ice shows 85.7% concentration. The Greenland ice sheet displays concerning melt patterns. Our multi-sensor approach combines passive microwave, SAR, and altimetry for comprehensive ice analysis. Shall I show you the seasonal trends or focus on specific polar regions?"
    }

    if (input.includes("bgc") || input.includes("biogeochemical") || input.includes("ph") || input.includes("oxygen")) {
      return "Biogeochemical data reveals ocean health status! Current measurements show pH at 8.1 (slightly below optimal 8.2), elevated CO2 at 415ppm, and concerning oxygen minimum zones expanding in tropical regions. Nitrate and phosphate levels indicate nutrient stress in several basins. Our BGC-ARGO floats provide unprecedented 3D biogeochemical mapping. Would you like detailed parameter analysis or regional comparisons?"
    }

    if (input.includes("argo") || input.includes("float") || input.includes("profile")) {
      return "Our ARGO network is performing exceptionally! Currently tracking 4,127 active floats with 847 daily profiles. Global coverage reaches 89.2% with enhanced sampling in key climate regions. Each float provides temperature, salinity, and pressure data every 10 days from 2000m to surface. BGC floats add oxygen, pH, nitrate, and chlorophyll measurements. Which specific ARGO data products interest you most?"
    }

    if (input.includes("climate") || input.includes("trend") || input.includes("anomaly")) {
      return "Climate analysis shows significant oceanographic trends! Multi-decadal datasets reveal warming patterns, sea level rise acceleration, and biogeochemical shifts. Current anomalies include +1.2°C SST in the North Atlantic, expanding oxygen minimum zones, and Arctic ice decline. Our AI algorithms detect emerging patterns in the vast oceanographic datasets. Shall I focus on specific climate indicators or regional trend analysis?"
    }

    return "That's a fascinating oceanographic question! I can analyze data from our comprehensive monitoring systems including ARGO floats, satellite altimetry (Jason/Sentinel), ocean color sensors, sea ice monitoring, and biogeochemical measurements. Our database contains millions of profiles spanning temperature, salinity, sea surface height, chlorophyll, sea ice, and climate indicators. Could you specify which parameters or regions you'd like to explore?"
  }

  const generateSuggestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase()

    if (input.includes("sst") || input.includes("temperature")) {
      return [
        "Show temperature vs depth profiles for different regions",
        "Compare SST anomalies with El Niño/La Niña cycles",
        "Analyze marine heatwave events and their impacts",
      ]
    }

    if (input.includes("altimetry") || input.includes("ssh")) {
      return [
        "Compare Jason-3 vs Sentinel-6 measurements",
        "Show regional sea level trends and projections",
        "Analyze mesoscale eddies and ocean circulation",
      ]
    }

    if (input.includes("ocean color") || input.includes("chlorophyll")) {
      return [
        "Track seasonal phytoplankton bloom cycles",
        "Correlate chlorophyll with nutrient distributions",
        "Analyze harmful algal bloom detection and monitoring",
      ]
    }

    if (input.includes("sea ice")) {
      return [
        "Compare Arctic vs Antarctic ice trends",
        "Show seasonal ice extent variations",
        "Analyze ice thickness changes and climate impacts",
      ]
    }

    return [
      "Show comprehensive oceanographic dashboard",
      "Compare multi-parameter ocean observations",
      "Analyze recent satellite and float measurements",
    ]
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Waves className="h-6 w-6 text-primary animate-wave" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                OceanScope AI Assistant
              </h1>
              <p className="text-xs text-muted-foreground">Advanced oceanographic intelligence</p>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Questions */}
      <div className="border-b bg-muted/20 p-4">
        <div className="container mx-auto">
          <p className="text-sm text-muted-foreground mb-3">Explore oceanographic data:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickQuestions.map((question, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={`cursor-pointer whitespace-nowrap ${question.color} hover:opacity-80 transition-all duration-300 hover:scale-105`}
                onClick={() => handleSendMessage(question.text)}
              >
                <span className="animate-pulse">{question.icon}</span>
                <span className="ml-1">{question.text}</span>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="container mx-auto max-w-4xl space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              {message.type === "bot" && (
                <Avatar className="h-8 w-8 bg-primary">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                <Card className={`${message.type === "user" ? "bg-primary text-primary-foreground" : "bg-card"}`}>
                  <CardContent className="p-3">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </CardContent>
                </Card>

                {message.suggestions && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-2 text-xs text-left justify-start w-full bg-muted/50 hover:bg-muted"
                        onClick={() => handleSendMessage(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {message.type === "user" && (
                <Avatar className="h-8 w-8 bg-secondary">
                  <AvatarFallback>
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-primary">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-card">
                <CardContent className="p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-card/50 backdrop-blur-sm p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about SST, altimetry, ocean color, sea ice, BGC parameters, ARGO floats..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
              className="flex-1"
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="hover:scale-105 transition-transform"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-card/95 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Waves className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/chat" className="flex flex-col items-center gap-1 p-2 text-primary">
              <MessageCircle className="h-5 w-5 animate-pulse" />
              <span className="text-xs font-medium">AI Chat</span>
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
