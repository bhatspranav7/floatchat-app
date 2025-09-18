"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calendar, MapPin, Layers, Ruler, Filter } from "lucide-react"

interface FilterState {
  region: string
  parameter: string
  dateRange: string
  depthRange: [number, number]
}

interface DataFiltersProps {
  onFiltersChange: (filters: FilterState) => void
}

export default function DataFilters({ onFiltersChange }: DataFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    region: "global",
    parameter: "temperature",
    dateRange: "30days",
    depthRange: [0, 2000],
  })

  const regions = [
    { value: "global", label: "Global Ocean" },
    { value: "north-atlantic", label: "North Atlantic" },
    { value: "north-pacific", label: "North Pacific" },
    { value: "south-pacific", label: "South Pacific" },
    { value: "indian", label: "Indian Ocean" },
    { value: "southern", label: "Southern Ocean" },
    { value: "arctic", label: "Arctic Ocean" },
    { value: "mediterranean", label: "Mediterranean Sea" },
    { value: "caribbean", label: "Caribbean Sea" },
  ]

  const parameters = [
    { value: "temperature", label: "Temperature" },
    { value: "salinity", label: "Salinity" },
    { value: "pressure", label: "Pressure" },
    { value: "oxygen", label: "Dissolved Oxygen" },
    { value: "ph", label: "pH" },
    { value: "nitrate", label: "Nitrate" },
    { value: "chlorophyll", label: "Chlorophyll-a" },
    { value: "ssh", label: "Sea Surface Height" },
    { value: "sst", label: "Sea Surface Temperature" },
    { value: "sea-ice", label: "Sea Ice Concentration" },
    { value: "currents", label: "Ocean Currents" },
    { value: "waves", label: "Wave Height" },
  ]

  const dateRanges = [
    { value: "24hours", label: "Last 24 Hours" },
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "3months", label: "Last 3 Months" },
    { value: "1year", label: "Last Year" },
    { value: "5years", label: "Last 5 Years" },
    { value: "custom", label: "Custom Range" },
  ]

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const resetFilters = () => {
    const defaultFilters = {
      region: "global",
      parameter: "temperature",
      dateRange: "30days",
      depthRange: [0, 2000] as [number, number],
    }
    setFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary animate-pulse" />
          Data Filters
          <Badge variant="outline" className="ml-auto">
            Customize your data selection
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Geographic Region */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-chart-1" />
              Geographic Region
            </label>
            <Select value={filters.region} onValueChange={(value) => updateFilter("region", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Parameter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Layers className="h-4 w-4 text-chart-2" />
              Parameter
            </label>
            <Select value={filters.parameter} onValueChange={(value) => updateFilter("parameter", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select parameter" />
              </SelectTrigger>
              <SelectContent>
                {parameters.map((param) => (
                  <SelectItem key={param.value} value={param.value}>
                    {param.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-chart-3" />
              Date Range
            </label>
            <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Depth Range */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Ruler className="h-4 w-4 text-chart-4" />
              Depth Range (m)
            </label>
            <div className="px-3 py-2 border rounded-md bg-background">
              <Slider
                value={filters.depthRange}
                onValueChange={(value) => updateFilter("depthRange", value as [number, number])}
                max={6000}
                min={0}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{filters.depthRange[0]}m</span>
                <span>{filters.depthRange[1]}m</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary">{regions.find((r) => r.value === filters.region)?.label}</Badge>
            <Badge variant="secondary">{parameters.find((p) => p.value === filters.parameter)?.label}</Badge>
            <Badge variant="secondary">{dateRanges.find((d) => d.value === filters.dateRange)?.label}</Badge>
            <Badge variant="secondary">
              {filters.depthRange[0]}-{filters.depthRange[1]}m
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset
            </Button>
            <Button size="sm" className="animate-pulse">
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
