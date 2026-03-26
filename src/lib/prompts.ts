import { ProposalBrief, BrandSettings } from '@/types'

export function buildPrompt(brief: ProposalBrief, settings: BrandSettings): string {
  const budgetText = brief.budget ? getBudgetLabel(brief.budget) : 'Not specified'
  const timelineText = brief.timeline ? getTimelineLabel(brief.timeline) : 'Flexible'

  const clientReference = brief.clientCompany
    ? `${brief.clientName} from ${brief.clientCompany}`
    : brief.clientName

  const baseContext = `
You are writing a professional project proposal on behalf of ${settings.companyName}.

CLIENT DETAILS:
- Name: ${brief.clientName}
- Company: ${brief.clientCompany || 'N/A'}

PROJECT DETAILS:
- Title: ${brief.projectTitle}
- Description: ${brief.projectDescription}
- Budget: ${budgetText}
- Timeline: ${timelineText}
${brief.additionalNotes ? `- Additional notes: ${brief.additionalNotes}` : ''}

YOUR COMPANY DETAILS (use in About section and sign-off):
- Company: ${settings.companyName}
- Contact: ${settings.yourName}
- Email: ${settings.email}
- Phone: ${settings.phone || 'N/A'}
${settings.website ? `- Website: ${settings.website}` : ''}
${settings.tagline ? `- Tagline: ${settings.tagline}` : ''}
`

  const outputFormat = `
OUTPUT FORMAT:
Write the proposal in clean markdown with these exact section headers (use ## for each):

## Executive summary
## The problem
## Our proposed solution
## Scope of work
## Timeline
## Investment
## About ${settings.companyName}
## Next steps
## Terms & conditions

REQUIREMENTS:
- Address the client by name where appropriate
- Be professional, confident, and specific — not generic filler
- In Investment: if a budget was provided, work within it and justify the value. If not, provide a realistic range based on the scope.
- In Terms & conditions: include standard freelance terms — 50% deposit to commence, balance on completion, IP ownership transfers on final payment, 30-day payment terms, 2 revision rounds included, additional revisions billed hourly.
- Make it feel like a real proposal from a professional who wants to win this work
`

  let typeSpecificGuidance = ''

  switch (brief.projectType) {
    case 'web_development':
    case 'pwa':
    case 'ai_integration':
      typeSpecificGuidance = `
TECHNICAL PROJECT GUIDANCE:
- Be technical and specific
- Mention the stack where appropriate (Next.js, TypeScript, Firebase, React, etc.)
- Scope of work should list specific deliverables (pages, features, integrations)
- Timeline should be broken into phases: Discovery → Design → Development → Testing → Launch
- Include technical considerations like hosting, maintenance, and security
${brief.projectType === 'pwa' ? '- Emphasise offline capability, installability, and mobile-first design' : ''}
${brief.projectType === 'ai_integration' ? '- Mention AI/ML capabilities, API integration, and data considerations' : ''}
`
      break

    case 'construction':
    case 'shade_cloth':
      typeSpecificGuidance = `
TRADE/CONSTRUCTION PROJECT GUIDANCE:
- Use practical, trade-focused language
- Scope of work should list materials, labour, and installation steps
- Timeline in working days, accounting for weather and site access
- Investment section should break down supply vs installation costs
- Include warranty information where applicable
${brief.projectType === 'shade_cloth' ? '- Mention fabric specifications, UV rating, wind rating, and fixing methods' : ''}
`
      break

    case 'general_freelance':
      typeSpecificGuidance = `
GENERAL FREELANCE PROJECT GUIDANCE:
- Adaptable professional tone
- Scope of work based on what was described in the brief
- Be clear about deliverables and what's included vs excluded
- Timeline should be realistic for the scope described
`
      break

    case 'other':
    default:
      typeSpecificGuidance = `
PROJECT GUIDANCE:
- Infer the appropriate tone and structure from the project description
- Be professional and thorough
- Adapt the scope, timeline, and investment sections to fit the project type
`
      break
  }

  return `${baseContext}${typeSpecificGuidance}${outputFormat}

Now write the complete proposal for ${clientReference}'s "${brief.projectTitle}" project.`
}

function getBudgetLabel(value: string): string {
  const map: Record<string, string> = {
    under_10k: 'Under R10,000',
    '10k_30k': 'R10,000 – R30,000',
    '30k_80k': 'R30,000 – R80,000',
    '80k_plus': 'R80,000+',
    usd: 'International USD',
  }
  return map[value] || 'Not specified'
}

function getTimelineLabel(value: string): string {
  const map: Record<string, string> = {
    asap: 'As soon as possible',
    '2_4_weeks': '2–4 weeks',
    '1_2_months': '1–2 months',
    '3_plus_months': '3+ months',
  }
  return map[value] || 'Flexible'
}
