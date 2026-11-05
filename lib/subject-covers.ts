// ============================================================
// VidyaSetu Subject Cover Image Resolver
// Matches subject domains, faculties, and keywords to
// tailored high-resolution educational cover photography.
// ============================================================

export function getSubjectCoverImage(subject?: {
  name?: string
  faculty_id?: string
  icon_key?: string
  faculties_or_streams?: { name?: string } | null
}): string {
  if (!subject) return '/assets/subjects/physics-science.jpg'
  const name = (subject.name || '').toLowerCase()
  const faculty = (subject.faculties_or_streams?.name || '').toLowerCase()
  const icon = (subject.icon_key || '').toLowerCase()

  // 1. Health & Physical Education
  if (name.includes('health') || name.includes('physical') || name.includes('sports') || icon === 'heart') {
    return '/assets/subjects/health-physical-edu.jpg'
  }

  // 2. Moral Education & Ethics
  if (name.includes('moral') || name.includes('ethics') || name.includes('character') || name.includes('values')) {
    return '/assets/subjects/moral-education.jpg'
  }

  // 3. Social Studies, Geography, History, Civics
  if (name.includes('social') || name.includes('geography') || name.includes('history') || name.includes('samajik') || icon === 'globe') {
    return '/assets/subjects/social-studies.jpg'
  }

  // 4. Vocational & Technical Education
  if (name.includes('vocational') || name.includes('technical') || name.includes('trade') || name.includes('workshop') || icon === 'wrench') {
    return '/assets/subjects/vocational-technical.jpg'
  }

  // 5. Mathematics & Statistics
  if (
    name.includes('math') ||
    name.includes('algebra') ||
    name.includes('geometry') ||
    name.includes('calculus') ||
    name.includes('trigonometry') ||
    name.includes('statistics') ||
    icon === 'math' ||
    icon === 'calculator'
  ) {
    return '/assets/subjects/mathematics.jpg'
  }

  // 6. Computer Science, Software Engineering & IT
  if (
    name.includes('computer') ||
    name.includes('programming') ||
    name.includes('coding') ||
    name.includes('bca') ||
    name.includes('csit') ||
    name.includes('software') ||
    name.includes('network') ||
    icon === 'computer' ||
    icon === 'laptop'
  ) {
    return '/assets/subjects/computer-science.jpg'
  }

  // 7. Physics, Chemistry, Science
  if (
    name.includes('physics') ||
    name.includes('science') ||
    name.includes('chemistry') ||
    name.includes('mechanics') ||
    name.includes('optics') ||
    icon === 'physics' ||
    icon === 'atom' ||
    icon === 'chemistry' ||
    icon === 'compass'
  ) {
    return '/assets/subjects/physics-science.jpg'
  }

  // 8. Loksewa & Public Administration
  if (
    name.includes('loksewa') ||
    name.includes('officer') ||
    name.includes('kharidar') ||
    name.includes('na.su') ||
    faculty.includes('loksewa') ||
    faculty.includes('officer')
  ) {
    return '/assets/subjects/social-studies.jpg'
  }

  // 9. Literature & Language Arts
  if (name.includes('nepali') || name.includes('english') || name.includes('literature') || icon === 'book' || icon === 'languages') {
    return '/assets/subjects/moral-education.jpg'
  }

  // 10. Medical & Biology
  if (name.includes('biology') || name.includes('medical') || name.includes('zoology') || name.includes('botany') || icon === 'biology') {
    return '/assets/subjects/health-physical-edu.jpg'
  }

  return '/assets/subjects/physics-science.jpg'
}
