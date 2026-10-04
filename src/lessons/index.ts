import { lesson1 } from './lesson1'
import { lesson2 } from './lesson2'
import { lesson3 } from './lesson3'
import { lesson4 } from './lesson4'
import { lesson5 } from './lesson5'
import { lesson6 } from './lesson6'
import { lesson7 } from './lesson7'
import { lesson8 } from './lesson8'
import { lesson9 } from './lesson9'
import { lesson10 } from './lesson10'
import { lesson11 } from './lesson11'
import { lesson12 } from './lesson12'
import { lesson13 } from './lesson13'
import { lesson14 } from './lesson14'
import { lesson15 } from './lesson15'
import { lesson16 } from './lesson16'
import type { CourseId, Lesson } from './types'

export const lessons: Lesson[] = [
  lesson1, lesson2, lesson3, lesson4, lesson5, lesson6, lesson7, lesson8, lesson9,
  lesson10, lesson11, lesson12, lesson13, lesson14, lesson15, lesson16,
]

export type Course = { id: CourseId; lessonIds: number[] }

/** Courses in the order the home page lists them. Lesson ids stay unique across courses. */
export const courses: Course[] = [
  { id: 'state', lessonIds: lessons.filter(lesson => lesson.course === 'state').map(lesson => lesson.id) },
  { id: 'effects', lessonIds: lessons.filter(lesson => lesson.course === 'effects').map(lesson => lesson.id) },
]

export const isCourseId = (value: string): value is CourseId => courses.some(course => course.id === value)

export function getLesson(id: number): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id)
}

export function courseLessons<T extends Pick<Lesson, 'course'>>(all: T[], course: CourseId): T[] {
  return all.filter(lesson => lesson.course === course)
}

/** The lesson's position within its own course, starting at 1. Shown to learners instead of the global id. */
export function lessonNumber(id: number): number {
  const lesson = getLesson(id)
  return lesson ? lessons.filter(item => item.course === lesson.course).findIndex(item => item.id === id) + 1 : id
}

/** The following lesson in the same course, or null at the end of the course. */
export function nextInCourse(lesson: Pick<Lesson, 'id' | 'course'>): Lesson | null {
  const list = lessons.filter(item => item.course === lesson.course)
  return list[list.findIndex(item => item.id === lesson.id) + 1] ?? null
}
