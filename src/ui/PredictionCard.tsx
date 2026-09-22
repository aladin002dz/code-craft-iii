import { useId, useState } from 'react'
import type { Prediction } from '../lessons/types'
import { useI18n } from '../i18n/I18nProvider'

/** A short "what will happen?" question. It never blocks the lesson; it exposes a misconception first. */
export function PredictionCard({ prediction }: { prediction: Prediction }) {
  const { copy } = useI18n()
  const [choice, setChoice] = useState<number | null>(null)
  const name = useId()
  const answered = choice !== null
  const correct = choice === prediction.answer

  return (
    <section className="prediction" aria-label={copy.prediction.label}>
      <div className="eyebrow">{copy.prediction.heading}</div>
      <p className="prediction-question">{prediction.question}</p>
      {prediction.code && <pre className="prediction-code">{prediction.code}</pre>}
      <div className="prediction-options" role="radiogroup" aria-label={copy.prediction.options}>
        {prediction.options.map((option, index) => (
          <label
            key={option}
            className={`prediction-option${answered && index === prediction.answer ? ' right' : ''}${answered && index === choice && !correct ? ' wrong' : ''}`}
          >
            <input type="radio" name={name} checked={choice === index} onChange={() => setChoice(index)} />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {answered && (
        <p className="prediction-result" role="status">
          <strong>{correct ? copy.prediction.yes : copy.prediction.wrong(prediction.options[prediction.answer])}</strong> {prediction.explanation}
        </p>
      )}
    </section>
  )
}
