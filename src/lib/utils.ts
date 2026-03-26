import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return crypto.randomUUID()
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function parseMarkdownSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {}
  const parts = markdown.split(/^## /m)

  for (const part of parts) {
    if (!part.trim()) continue
    const lines = part.split('\n')
    const title = lines[0].trim().toLowerCase().replace(/[^a-z_]/g, '_')
    const content = lines.slice(1).join('\n').trim()
    sections[title] = content
  }

  return sections
}

export function markdownToHtml(markdown: string): string {
  let html = markdown

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-slate-900 mt-6 mb-2">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-200 font-display">$1</h2>')

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Lists
  html = html.replace(/^- (.+)$/gm, '<li class="ml-4 pl-2">$1</li>')
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="list-disc space-y-1 my-3">$&</ul>')

  // Numbered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 pl-2">$1</li>')

  // Paragraphs
  html = html.replace(/^(?!<[hul]|<li)(.+)$/gm, '<p class="my-3 leading-relaxed">$1</p>')

  // Clean up empty paragraphs
  html = html.replace(/<p class="[^"]*"><\/p>/g, '')

  return html
}

export function getBudgetLabel(value: string): string {
  const map: Record<string, string> = {
    under_10k: 'Under R10,000',
    '10k_30k': 'R10,000 – R30,000',
    '30k_80k': 'R30,000 – R80,000',
    '80k_plus': 'R80,000+',
    usd: 'International USD',
  }
  return map[value] || 'Not specified'
}

export function getTimelineLabel(value: string): string {
  const map: Record<string, string> = {
    asap: 'As soon as possible',
    '2_4_weeks': '2–4 weeks',
    '1_2_months': '1–2 months',
    '3_plus_months': '3+ months',
  }
  return map[value] || 'Flexible'
}
