export type ProjectType =
  | 'web_development'
  | 'pwa'
  | 'ai_integration'
  | 'general_freelance'
  | 'construction'
  | 'shade_cloth'
  | 'other'

export interface BrandSettings {
  companyName: string
  yourName: string
  email: string
  phone: string
  website?: string
  tagline?: string
}

export interface ProposalBrief {
  projectType: ProjectType
  clientName: string
  clientCompany?: string
  projectTitle: string
  projectDescription: string
  budget?: string
  timeline?: string
  additionalNotes?: string
}

export interface GeneratedProposal {
  id: string
  createdAt: string
  brief: ProposalBrief
  brand: BrandSettings
  markdown: string
  sections: {
    executive_summary: string
    problem_statement: string
    proposed_solution: string
    scope_of_work: string
    timeline: string
    investment: string
    about_us: string
    next_steps: string
    terms: string
  }
}

export interface AppState {
  settings: BrandSettings
  proposals: GeneratedProposal[]
}

export const DEFAULT_SETTINGS: BrandSettings = {
  companyName: 'Your Company',
  yourName: 'Your Name',
  email: 'you@yourcompany.com',
  phone: '',
  website: '',
  tagline: '',
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  web_development: 'Web Development',
  pwa: 'Progressive Web App',
  ai_integration: 'AI Integration',
  general_freelance: 'General Freelance',
  construction: 'Construction / Installation',
  shade_cloth: 'Shade Cloth / Shadeport',
  other: 'Other',
}

export const BUDGET_OPTIONS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'under_10k', label: 'Under R10k' },
  { value: '10k_30k', label: 'R10–30k' },
  { value: '30k_80k', label: 'R30–80k' },
  { value: '80k_plus', label: 'R80k+' },
  { value: 'usd', label: 'International USD' },
]

export const TIMELINE_OPTIONS = [
  { value: '', label: 'Flexible' },
  { value: 'asap', label: 'ASAP' },
  { value: '2_4_weeks', label: '2–4 weeks' },
  { value: '1_2_months', label: '1–2 months' },
  { value: '3_plus_months', label: '3+ months' },
]
