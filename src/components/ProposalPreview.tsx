'use client'

import { GeneratedProposal } from '@/types'
import { markdownToHtml } from '@/lib/utils'
import { EmptyState } from './EmptyState'
import { LoadingState } from './LoadingState'
import { ExportBar } from './ExportBar'

interface ProposalPreviewProps {
  proposal: GeneratedProposal | null
  streamingContent: string
  isGenerating: boolean
  isStreaming: boolean
  onOpenSettings: () => void
  onSave: () => void
}

export function ProposalPreview({
  proposal,
  streamingContent,
  isGenerating,
  isStreaming,
  onOpenSettings,
  onSave,
}: ProposalPreviewProps) {
  // Show loading state when generating but not yet streaming
  if (isGenerating && !isStreaming && !streamingContent) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden">
        <LoadingState />
      </div>
    )
  }

  // Show streaming content
  if (isStreaming || streamingContent) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isStreaming && (
          <div className="flex items-center gap-2 px-6 py-3 bg-blue-50 border-b border-blue-100">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm text-blue-700">Generating proposal...</span>
          </div>
        )}

        <div className="flex-1 overflow-auto p-6">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(streamingContent) }}
          />
          {isStreaming && (
            <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1" />
          )}
        </div>

        {!isStreaming && proposal && (
          <ExportBar proposal={proposal} onSave={onSave} />
        )}
      </div>
    )
  }

  // Show completed proposal
  if (proposal) {
    return (
      <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(proposal.markdown) }}
          />
        </div>
        <ExportBar proposal={proposal} onSave={onSave} />
      </div>
    )
  }

  // Show empty state with demo proposal
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden">
      <EmptyState onOpenSettings={onOpenSettings} />
    </div>
  )
}
