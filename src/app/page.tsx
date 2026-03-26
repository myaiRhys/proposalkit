'use client'

import { useState, useCallback } from 'react'
import { useApp } from '@/context/AppContext'
import { BriefForm } from '@/components/BriefForm'
import { ProposalPreview } from '@/components/ProposalPreview'
import { SettingsModal } from '@/components/SettingsModal'
import { ProposalHistory } from '@/components/ProposalHistory'
import { ProposalBrief, GeneratedProposal } from '@/types'
import { generateId } from '@/lib/utils'

export default function Home() {
  const { settings, saveProposal } = useApp()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [currentProposal, setCurrentProposal] = useState<GeneratedProposal | null>(null)
  const [currentBrief, setCurrentBrief] = useState<ProposalBrief | null>(null)

  const handleGenerate = useCallback(async (brief: ProposalBrief) => {
    setIsGenerating(true)
    setIsStreaming(false)
    setStreamingContent('')
    setCurrentProposal(null)
    setCurrentBrief(brief)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, settings }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate proposal')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      setIsStreaming(true)
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk
        setStreamingContent(fullContent)
      }

      // Create the completed proposal
      const proposal: GeneratedProposal = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        brief,
        brand: settings,
        markdown: fullContent,
        sections: {
          executive_summary: '',
          problem_statement: '',
          proposed_solution: '',
          scope_of_work: '',
          timeline: '',
          investment: '',
          about_us: '',
          next_steps: '',
          terms: '',
        },
      }

      setCurrentProposal(proposal)
      setIsStreaming(false)
    } catch (error) {
      console.error('Generation error:', error)
      setStreamingContent('Error generating proposal. Please check your API key and try again.')
      setIsStreaming(false)
    } finally {
      setIsGenerating(false)
    }
  }, [settings])

  const handleSaveProposal = useCallback(() => {
    if (currentProposal) {
      saveProposal({
        brief: currentProposal.brief,
        brand: currentProposal.brand,
        markdown: currentProposal.markdown,
        sections: currentProposal.sections,
      })
    }
  }, [currentProposal, saveProposal])

  const handleLoadProposal = useCallback((proposal: GeneratedProposal) => {
    setCurrentProposal(proposal)
    setStreamingContent(proposal.markdown)
    setCurrentBrief(proposal.brief)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-semibold font-display text-slate-900">ProposalKit</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-6">
            {/* Left column - Brief form */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit sticky top-24">
              <h2 className="text-lg font-semibold text-slate-900 mb-1 font-display">Project Brief</h2>
              <p className="text-sm text-slate-500 mb-6">
                Fill in the details and generate a professional proposal.
              </p>
              <BriefForm onSubmit={handleGenerate} isGenerating={isGenerating} />
            </div>

            {/* Right column - Proposal preview */}
            <div className="min-h-[600px]">
              <ProposalPreview
                proposal={currentProposal}
                streamingContent={streamingContent}
                isGenerating={isGenerating}
                isStreaming={isStreaming}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onSave={handleSaveProposal}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            Built by{' '}
            <a
              href="https://kinnearsystems.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
            >
              Kinnear Systems
            </a>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <ProposalHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onLoad={handleLoadProposal}
      />
    </div>
  )
}
