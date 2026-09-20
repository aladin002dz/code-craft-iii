import { useState } from 'react';

export default function VolumeSettings() {
  const [sliderValue, setSliderValue] = useState(40);
  const [numberValue, setNumberValue] = useState(40);

  return (
    <section className="panel light">
      <div className="eyebrow">Workspace settings</div>
      <h2>Notifications</h2>
      <p>Choose how loud alerts should be.</p>
      <div className="slider-row">
        <input
          type="range"
          min="0"
          max="100"
          aria-label="Volume slider"
          value={sliderValue}
          onChange={event => setSliderValue(Number(event.target.value))}
        />
        <input
          type="number"
          min="0"
          max="100"
          aria-label="Volume number"
          value={numberValue}
          onChange={event => setNumberValue(Number(event.target.value))}
        />
      </div>
    </section>
  );
}
