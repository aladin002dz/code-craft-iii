import { lesson1 } from './lesson1'
import type { Lesson } from './types'

export const lessons: Lesson[] = [lesson1]

export function getLesson(id: number): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id)
}
