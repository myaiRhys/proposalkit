import { AppState, BrandSettings, GeneratedProposal, DEFAULT_SETTINGS } from '@/types'

const STORAGE_KEY = 'proposalkit_data'

const defaultState: AppState = {
  settings: DEFAULT_SETTINGS,
  proposals: [],
}

export function loadState(): AppState {
  if (typeof window === 'undefined') {
    return defaultState
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return defaultState
    }
    const parsed = JSON.parse(stored) as AppState
    return {
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      proposals: parsed.proposals || [],
    }
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Failed to save state to localStorage:', error)
  }
}

export function saveSettings(settings: BrandSettings): void {
  const state = loadState()
  state.settings = settings
  saveState(state)
}

export function saveProposal(proposal: GeneratedProposal): void {
  const state = loadState()
  state.proposals = [proposal, ...state.proposals]
  saveState(state)
}

export function deleteProposal(id: string): void {
  const state = loadState()
  state.proposals = state.proposals.filter(p => p.id !== id)
  saveState(state)
}

export function isDefaultSettings(settings: BrandSettings): boolean {
  return (
    settings.companyName === DEFAULT_SETTINGS.companyName &&
    settings.yourName === DEFAULT_SETTINGS.yourName &&
    settings.email === DEFAULT_SETTINGS.email
  )
}
