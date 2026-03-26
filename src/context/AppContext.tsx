'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { AppState, BrandSettings, GeneratedProposal, DEFAULT_SETTINGS } from '@/types'
import { loadState, saveState, isDefaultSettings } from '@/lib/storage'
import { generateId } from '@/lib/utils'

interface AppContextValue {
  settings: BrandSettings
  proposals: GeneratedProposal[]
  isDefaultSettings: boolean
  updateSettings: (settings: BrandSettings) => void
  saveProposal: (proposal: Omit<GeneratedProposal, 'id' | 'createdAt'>) => GeneratedProposal
  deleteProposal: (id: string) => void
  getProposal: (id: string) => GeneratedProposal | undefined
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    settings: DEFAULT_SETTINGS,
    proposals: [],
  })
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadState()
    setState(loaded)
    setIsHydrated(true)
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    if (isHydrated) {
      saveState(state)
    }
  }, [state, isHydrated])

  const updateSettings = useCallback((settings: BrandSettings) => {
    setState(prev => ({ ...prev, settings }))
  }, [])

  const saveProposalFn = useCallback((proposalData: Omit<GeneratedProposal, 'id' | 'createdAt'>): GeneratedProposal => {
    const proposal: GeneratedProposal = {
      ...proposalData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }
    setState(prev => ({
      ...prev,
      proposals: [proposal, ...prev.proposals],
    }))
    return proposal
  }, [])

  const deleteProposal = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      proposals: prev.proposals.filter(p => p.id !== id),
    }))
  }, [])

  const getProposal = useCallback((id: string) => {
    return state.proposals.find(p => p.id === id)
  }, [state.proposals])

  const value: AppContextValue = {
    settings: state.settings,
    proposals: state.proposals,
    isDefaultSettings: isDefaultSettings(state.settings),
    updateSettings,
    saveProposal: saveProposalFn,
    deleteProposal,
    getProposal,
  }

  if (!isHydrated) {
    return null
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
