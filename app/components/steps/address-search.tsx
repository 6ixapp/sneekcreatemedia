"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Loader2 } from "lucide-react"

interface AddressSearchProps {
  selected: string | null
  onSelect: (address: string, coordinates?: { lat: number; lng: number }) => void
}

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  type: string
  importance: number
}

export function AddressSearch({ selected, onSelect }: AddressSearchProps) {
  const [searchInput, setSearchInput] = useState("")
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [confirmedAddress, setConfirmedAddress] = useState(selected)
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions from OpenStreetMap Nominatim
  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          }
        }
      )
      const data: NominatimResult[] = await response.json()
      setSuggestions(data)
      setShowDropdown(data.length > 0)
    } catch (error) {
      console.error("Error fetching address suggestions:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search input with debouncing
  const handleSearch = (value: string) => {
    setSearchInput(value)

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set new timer for debouncing (wait 500ms after user stops typing)
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value)
    }, 500)
  }

  const handleSelectAddress = (suggestion: NominatimResult) => {
    const address = suggestion.display_name
    setConfirmedAddress(address)
    setSearchInput(address)
    onSelect(address, {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    })
    setSuggestions([])
    setShowDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 2: Property Address</h2>
        <p className="text-muted-foreground mb-6">Enter the property address</p>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter property address..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            className="w-full px-4 py-3 pr-10 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Dropdown Suggestions */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSelectAddress(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-accent/10 transition-colors border-b border-border last:border-b-0 flex items-start gap-3 group"
              >
                <MapPin className="w-4 h-4 text-muted-foreground mt-1 group-hover:text-primary transition-colors flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {suggestion.display_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">
                    {suggestion.type}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {confirmedAddress && (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-accent" />
            <p className="text-sm font-semibold text-accent">Confirmed Address</p>
          </div>
          <p className="text-foreground">{confirmedAddress}</p>
        </div>
      )}
    </div>
  )
}