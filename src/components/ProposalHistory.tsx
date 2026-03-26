'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { GeneratedProposal, PROJECT_TYPE_LABELS } from '@/types'
import { formatShortDate } from '@/lib/utils'

interface ProposalHistoryProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (proposal: GeneratedProposal) => void
}

export function ProposalHistory({ isOpen, onClose, onLoad }: ProposalHistoryProps) {
  const { proposals, deleteProposal } = useApp()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleDelete = (id: string) => {
    deleteProposal(id)
    setDeleteConfirm(null)
  }

  const handleLoad = (proposal: GeneratedProposal) => {
    onLoad(proposal)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900 font-display">
            Saved Proposals
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {proposals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500 text-sm">
                No saved proposals yet.<br />
                Generate one and hit Save.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-slate-900 text-sm leading-tight">
                      {proposal.brief.projectTitle}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatShortDate(proposal.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-2">
                    {proposal.brief.clientName}
                    {proposal.brief.clientCompany && (
                      <span className="text-slate-400"> · {proposal.brief.clientCompany}</span>
                    )}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      {PROJECT_TYPE_LABELS[proposal.brief.projectType]}
                    </span>

                    <div className="flex items-center gap-2">
                      {deleteConfirm === proposal.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(proposal.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-xs text-slate-500 hover:text-slate-700"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleLoad(proposal)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(proposal.id)}
                            className="p-1 text-slate-400 hover:text-red-500"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
