import jsPDF from 'jspdf'
import { GeneratedProposal, BrandSettings } from '@/types'
import { formatDate } from './utils'

export function generateProposalPdf(proposal: GeneratedProposal, settings: BrandSettings): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const colors = {
    primary: '#0F172A',
    secondary: '#334155',
    accent: '#2563EB',
    light: '#64748B',
  }

  // Helper to add header and footer
  const addHeaderFooter = (pageNum: number, totalPages: number) => {
    // Header
    doc.setFontSize(9)
    doc.setTextColor(colors.light)
    doc.setFont('helvetica', 'normal')
    doc.text(settings.companyName, margin, 12)
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, 12, { align: 'right' })
    doc.setDrawColor(colors.light)
    doc.line(margin, 15, pageWidth - margin, 15)

    // Footer
    const footerY = pageHeight - 10
    doc.setFontSize(8)
    doc.setTextColor(colors.light)
    const footerText = `Prepared by ${settings.companyName} · ${settings.email}${settings.phone ? ` · ${settings.phone}` : ''}`
    doc.text(footerText, pageWidth / 2, footerY, { align: 'center' })
  }

  // Helper to check for page break
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 25) {
      doc.addPage()
      y = margin + 10
      return true
    }
    return false
  }

  // Cover section
  y = 35

  // Company name
  doc.setFontSize(22)
  doc.setTextColor(colors.primary)
  doc.setFont('helvetica', 'bold')
  doc.text(settings.companyName, margin, y)
  y += 8

  // Tagline
  if (settings.tagline) {
    doc.setFontSize(11)
    doc.setTextColor(colors.light)
    doc.setFont('helvetica', 'normal')
    doc.text(settings.tagline, margin, y)
    y += 8
  }

  // Accent line
  doc.setDrawColor(colors.accent)
  doc.setLineWidth(0.8)
  doc.line(margin, y, margin + 50, y)
  y += 12

  // PROPOSAL label
  doc.setFontSize(10)
  doc.setTextColor(colors.accent)
  doc.setFont('helvetica', 'bold')
  doc.text('PROPOSAL', margin, y)
  y += 10

  // Project title
  doc.setFontSize(18)
  doc.setTextColor(colors.primary)
  doc.setFont('helvetica', 'bold')
  const titleLines = doc.splitTextToSize(proposal.brief.projectTitle, contentWidth)
  doc.text(titleLines, margin, y)
  y += titleLines.length * 8 + 6

  // Prepared for
  doc.setFontSize(11)
  doc.setTextColor(colors.secondary)
  doc.setFont('helvetica', 'normal')
  const clientText = proposal.brief.clientCompany
    ? `${proposal.brief.clientName}, ${proposal.brief.clientCompany}`
    : proposal.brief.clientName
  doc.text(`Prepared for: ${clientText}`, margin, y)
  y += 6

  // Date
  doc.text(`Date: ${formatDate(proposal.createdAt)}`, margin, y)
  y += 15

  // Divider
  doc.setDrawColor('#E2E8F0')
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  // Parse and render sections from markdown
  const sections = proposal.markdown.split(/^## /m).filter(s => s.trim())

  for (const section of sections) {
    const lines = section.split('\n')
    const heading = lines[0].trim()
    const content = lines.slice(1).join('\n').trim()

    // Section heading
    checkPageBreak(20)
    doc.setFontSize(13)
    doc.setTextColor(colors.primary)
    doc.setFont('helvetica', 'bold')
    doc.text(heading, margin, y)
    y += 8

    // Section content
    doc.setFontSize(10)
    doc.setTextColor(colors.secondary)
    doc.setFont('helvetica', 'normal')

    // Process content - handle lists and paragraphs
    const contentLines = content.split('\n')

    for (const line of contentLines) {
      if (!line.trim()) {
        y += 3
        continue
      }

      let text = line.trim()
      let indent = 0

      // Handle bullet points
      if (text.startsWith('- ') || text.startsWith('• ')) {
        text = '• ' + text.substring(2)
        indent = 3
      }

      // Handle numbered lists
      const numberedMatch = text.match(/^(\d+)\.\s+(.+)/)
      if (numberedMatch) {
        text = `${numberedMatch[1]}. ${numberedMatch[2]}`
        indent = 3
      }

      // Remove markdown formatting
      text = text.replace(/\*\*(.+?)\*\*/g, '$1')
      text = text.replace(/\*(.+?)\*/g, '$1')

      // Word wrap
      const wrappedLines = doc.splitTextToSize(text, contentWidth - indent)

      for (const wrappedLine of wrappedLines) {
        checkPageBreak(6)
        doc.text(wrappedLine, margin + indent, y)
        y += 5
      }
    }

    y += 6
  }

  // Add page numbers
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    addHeaderFooter(i, totalPages)
  }

  // Download
  const clientSlug = proposal.brief.clientName.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const dateSlug = new Date(proposal.createdAt).toISOString().split('T')[0]
  doc.save(`${clientSlug}-proposal-${dateSlug}.pdf`)
}
