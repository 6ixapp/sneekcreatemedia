"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"

interface AddressSearchProps {
  selected: string | null
  onSelect: (address: string, coordinates?: { lat: number; lng: number }) => void
}

export function AddressSearch({ selected, onSelect }: AddressSearchProps) {
  const [searchInput, setSearchInput] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [confirmedAddress, setConfirmedAddress] = useState(selected)

  const handleSearch = (value: string) => {
    setSearchInput(value)
  }

  const handleSelectAddress = (address: string) => {
    setConfirmedAddress(address)
    setSearchInput(address)
    onSelect(address)
    setSuggestions([])
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 2: Property Address</h2>
        <p className="text-muted-foreground mb-6">Enter the property address</p>
      </div>

      <div className="relative">
        <input
          type="text" 
          placeholder="Enter property address..."
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
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