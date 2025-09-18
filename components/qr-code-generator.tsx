"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Share2, Download, Copy } from "lucide-react"

export function QRCodeGenerator() {
  const [showQR, setShowQR] = useState(false)
  const projectUrl = typeof window !== "undefined" ? window.location.origin : "https://oceanscope-ai.vercel.app"

  const generateQRCodeURL = (text: string) => {
    // Using QR Server API to generate actual scannable QR code
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=0f172a&margin=10`
    return qrApiUrl
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(projectUrl)
  }

  const downloadQR = async () => {
    try {
      const qrUrl = generateQRCodeURL(projectUrl)
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.download = "oceanscope-qr.png"
      link.href = url
      link.click()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download QR code:", error)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={() => setShowQR(!showQR)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        <QrCode className="w-5 h-5 mr-2" />
        {showQR ? "Hide QR Code" : "Generate QR Code"}
      </Button>

      {showQR && (
        <Card className="w-fit bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-primary flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Scan to Open OceanScope AI
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg">
              <img
                src={generateQRCodeURL(projectUrl) || "/placeholder.svg"}
                alt="QR Code for OceanScope AI"
                className="w-[200px] h-[200px]"
                onError={(e) => {
                  // Fallback if API fails
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmFmYiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMzNzQxNTEiPk9jZWFuU2NvcGUgQUk8L3RleHQ+PC9zdmc+"
                }}
              />
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Scan with your phone camera to open</p>
              <p className="text-xs text-primary font-mono break-all max-w-[200px]">{projectUrl}</p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="border-primary/20 hover:bg-primary/10 bg-transparent"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy URL
              </Button>
              <Button
                onClick={downloadQR}
                variant="outline"
                size="sm"
                className="border-primary/20 hover:bg-primary/10 bg-transparent"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
