import { motion } from 'motion/react'
import type { ObjectiveView } from '../runtime/status'

const ICON = { passed: '✓', failed: '!', pending: '' } as const

export function Checklist({ objectives, checking }: { objectives: ObjectiveView[]; checking: boolean }) {
  return (
    <ul className="checklist" aria-label="Objectives" aria-busy={checking}>
      {objectives.map(objective => (
        <li key={objective.id} className={`check-item ${objective.state}`} data-state={objective.state} data-testid={`objective-${objective.id}`}>
          <motion.span
            key={objective.state}
            className="check-icon"
            aria-hidden="true"
            initial={objective.state === 'pending' ? false : { scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          >
            {ICON[objective.state]}
          </motion.span>
          <div>
            <span className="check-label">
              {objective.label}
              <span className="sr-only">
                {objective.state === 'passed' ? ' — passed' : objective.state === 'failed' ? ' — not yet' : ' — not checked yet'}
              </span>
            </span>
            {objective.message && (
              <p className="check-message" role="status">
                {objective.message}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
