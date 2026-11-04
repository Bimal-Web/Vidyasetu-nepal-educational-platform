// Subject icon badge component
import { cn, SUBJECT_COLORS } from '@/lib/utils'
import {
  Zap, FlaskConical, Leaf, Pi, Monitor, BookA,
  Scale, Stethoscope, Building2, Briefcase, GraduationCap,
  Wheat, Gavel, Palette, Users, Trophy, Globe, Shield
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  physics:     Zap,
  chemistry:   FlaskConical,
  biology:     Leaf,
  math:        Pi,
  computer:    Monitor,
  english:     BookA,
  law:         Scale,
  medical:     Stethoscope,
  engineering: Building2,
  management:  Briefcase,
  education:   GraduationCap,
  agriculture: Wheat,
  gavel:       Gavel,
  arts:        Palette,
  social:      Users,
  loksewa:     Trophy,
  global:      Globe,
  security:    Shield,
}

interface SubjectBadgeProps {
  iconKey: string
  colorKey: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SubjectBadge({ iconKey, colorKey, size = 'md', className }: SubjectBadgeProps) {
  const Icon = ICON_MAP[iconKey] ?? BookA
  const color = SUBJECT_COLORS[colorKey] ?? SUBJECT_COLORS.indigo
  const sizes = { sm: 'w-10 h-10 rounded-lg', md: 'w-16 h-16 rounded-xl', lg: 'w-20 h-20 rounded-2xl' }
  const iconSizes = { sm: 18, md: 28, lg: 36 }

  return (
    <div className={cn(sizes[size], color.bg, color.text, 'flex items-center justify-center flex-shrink-0', className)}>
      <Icon size={iconSizes[size]} strokeWidth={1.8} />
    </div>
  )
}
