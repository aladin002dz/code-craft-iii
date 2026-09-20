import { lesson1 } from './lesson1'
import type { CheckDef } from './run'

export const checksByLesson: Record<number, CheckDef[]> = {
  1: lesson1,
}
