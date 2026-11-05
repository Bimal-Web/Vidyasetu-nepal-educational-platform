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

  // 1. Database Management System (DBMS, SQL, Relational)
  if (
    name.includes('database') ||
    name.includes('dbms') ||
    name.includes('sql') ||
    name.includes('relational')
  ) {
    return '/assets/subjects/database-management.jpg'
  }

  // 2. Data Structures & Algorithms (DSA, Trees, Graphs, Sorting)
  if (
    name.includes('data structure') ||
    name.includes('algorithm') ||
    name.includes('dsa')
  ) {
    return '/assets/subjects/data-structures.jpg'
  }

  // 3. Web Technology & Development (HTML, CSS, JS, Web Tech)
  if (
    name.includes('web tech') ||
    name.includes('web development') ||
    name.includes('frontend') ||
    name.includes('backend') ||
    name.includes('full stack') ||
    name.includes('internet')
  ) {
    return '/assets/subjects/web-technology.jpg'
  }

  // 4. Object Oriented Programming in Java
  if (
    name.includes('java') ||
    (name.includes('object oriented') && !name.includes('c++'))
  ) {
    return '/assets/subjects/java-programming.jpg'
  }

  // 5. C Programming / Structured Programming
  if (
    name === 'c programming' ||
    name.includes('programming in c') ||
    name.includes('structured programming')
  ) {
    return '/assets/subjects/c-programming.jpg'
  }

  // 6. Discrete Mathematics & Logic
  if (
    name.includes('discrete math') ||
    name.includes('discrete structure')
  ) {
    return '/assets/subjects/discrete-mathematics.jpg'
  }

  // 7. Economics, Banking, Finance, Commercial Law
  if (
    name.includes('economic') ||
    name.includes('banking') ||
    name.includes('finance') ||
    name.includes('accounting') ||
    name.includes('business math') ||
    name.includes('financial')
  ) {
    return '/assets/subjects/economics-finance.jpg'
  }

  // 8. Health & Physical Education
  if (name.includes('health') || name.includes('physical') || name.includes('sports') || icon === 'heart') {
    return '/assets/subjects/health-physical-edu.jpg'
  }

  // 9. Moral Education & Ethics
  if (name.includes('moral') || name.includes('ethics') || name.includes('character') || name.includes('values')) {
    return '/assets/subjects/moral-education.jpg'
  }

  // 10. Social Studies, Geography, History, Civics
  if (name.includes('social') || name.includes('geography') || name.includes('history') || name.includes('samajik') || icon === 'globe') {
    return '/assets/subjects/social-studies.jpg'
  }

  // 11. Vocational & Technical Education
  if (name.includes('vocational') || name.includes('technical') || name.includes('trade') || name.includes('workshop') || icon === 'wrench') {
    return '/assets/subjects/vocational-technical.jpg'
  }

  // 12. General Mathematics & Statistics
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

  // 13. General Computer Science & Fundamentals
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

  // 14. Physics, Chemistry, General Science
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

  // 15. Loksewa & Public Administration
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

  // 16. Literature & Language Arts
  if (name.includes('nepali') || name.includes('english') || name.includes('literature') || icon === 'book' || icon === 'languages') {
    return '/assets/subjects/moral-education.jpg'
  }

  // 17. Medical & Biology
  if (name.includes('biology') || name.includes('medical') || name.includes('zoology') || name.includes('botany') || icon === 'biology') {
    return '/assets/subjects/health-physical-edu.jpg'
  }

  return '/assets/subjects/physics-science.jpg'
}

