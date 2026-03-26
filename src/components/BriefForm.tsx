'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ProposalBrief, PROJECT_TYPE_LABELS, BUDGET_OPTIONS, TIMELINE_OPTIONS, ProjectType } from '@/types'
import { cn } from '@/lib/utils'

const briefSchema = z.object({
  projectType: z.enum(['web_development', 'pwa', 'ai_integration', 'general_freelance', 'construction', 'shade_cloth', 'other']),
  clientName: z.string().min(1, 'Client name is required'),
  clientCompany: z.string().optional(),
  projectTitle: z.string().min(1, 'Project title is required'),
  projectDescription: z.string().min(50, 'Please provide at least 50 characters describing the project'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  additionalNotes: z.string().optional(),
})

interface BriefFormProps {
  onSubmit: (data: ProposalBrief) => void
  isGenerating: boolean
}

const PROJECT_TYPE_ICONS: Record<ProjectType, React.ReactNode> = {
  web_development: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  pwa: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  ai_integration: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  general_freelance: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  construction: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  shade_cloth: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
  ),
  other: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export function BriefForm({ onSubmit, isGenerating }: BriefFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProposalBrief>({
    resolver: zodResolver(briefSchema),
    defaultValues: {
      projectType: 'web_development',
      budget: '',
      timeline: '',
    },
  })

  const projectType = watch('projectType')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Project Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Project Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(PROJECT_TYPE_LABELS) as ProjectType[]).map((type) => (
            <label
              key={type}
              className={cn(
                'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all',
                projectType === type
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              )}
            >
              <input
                type="radio"
                value={type}
                {...register('projectType')}
                className="sr-only"
              />
              {PROJECT_TYPE_ICONS[type]}
              <span className="text-sm font-medium">{PROJECT_TYPE_LABELS[type]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Client Details */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Client Name *
          </label>
          <input
            {...register('clientName')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="e.g. Sarah Botha"
          />
          {errors.clientName && (
            <p className="mt-1 text-xs text-red-500">{errors.clientName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Client Company
          </label>
          <input
            {...register('clientCompany')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="e.g. Fynbos Flowers"
          />
        </div>
      </div>

      {/* Project Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Project Title *
        </label>
        <input
          {...register('projectTitle')}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="e.g. E-commerce website for Cape Town florist"
        />
        {errors.projectTitle && (
          <p className="mt-1 text-xs text-red-500">{errors.projectTitle.message}</p>
        )}
      </div>

      {/* Project Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Project Description *
        </label>
        <textarea
          {...register('projectDescription')}
          rows={4}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
          placeholder="Describe what the client needs and any context you have..."
        />
        {errors.projectDescription && (
          <p className="mt-1 text-xs text-red-500">{errors.projectDescription.message}</p>
        )}
      </div>

      {/* Budget & Timeline */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Budget Range
          </label>
          <select
            {...register('budget')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Timeline
          </label>
          <select
            {...register('timeline')}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {TIMELINE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Additional Notes
        </label>
        <textarea
          {...register('additionalNotes')}
          rows={2}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
          placeholder="Anything else to include — specific requirements, client preferences, constraints..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isGenerating}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-medium transition-all',
          isGenerating
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        )}
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            Generate Proposal
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}
