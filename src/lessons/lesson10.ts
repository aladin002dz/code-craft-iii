import starter from './starters/10-team-directory.jsx?raw'
import type { Lesson } from './types'

export const lesson10: Lesson = {
  id: 10,
  course: 'effects',
  topic: 'Fetch data when a component loads',
  title: 'Load the team once',
  project: 'Team chat',
  prerequisite: null,
  request: 'The directory shows the team, but the network log keeps counting: the same request is sent again and again. Load the team once, when the directory appears.',
  steps: [
    'Answer the prediction, then watch the request count in the network log.',
    'Find the fetch call. It sits in the component body, so it runs on every render, and every response causes another render.',
    'Move it into useEffect with an empty dependency array, so it runs once, after the first render.',
    'Toggle "Compact view" to check that it does not fetch again, then run the checks.',
  ],
  concept:
    'Rendering should only describe the screen. Talking to a server is a side effect, so it belongs in useEffect, which React runs after the screen is updated. The dependency array decides when it runs again: [] means only after the first render, while no array means after every render.',
  prediction: {
    question: 'The component calls fetch in its body, and the response is stored with setMembers. How many requests are sent while the directory stays open?',
    code: 'fetch(\'/api/team\')\n  .then(response => response.json())\n  .then(data => setMembers(data));',
    options: ['One', 'Two', 'They never stop'],
    answer: 2,
    explanation:
      'Every render sends a request. Each response calls setMembers with a new array, which causes another render, which sends another request. Moving the request into an effect with [] breaks the loop.',
  },
  objectives: [
    { id: 'shows-loading', label: 'The directory shows Loading… until the team arrives' },
    { id: 'shows-team', label: 'The team list appears when the response arrives' },
    { id: 'fetches-once', label: 'The team is requested once, even after re-rendering' },
  ],
  hints: [
    'Count the renders: the first render requests the team, and the response calls setMembers. What happens on the render that follows?',
    'Wrap the request in useEffect(() => { ... }, []); The empty array tells React to run it only after the first render.',
    'useEffect(() => { fetch(\'/api/team\').then(response => response.json()).then(data => setMembers(data)); }, []);',
  ],
  filename: 'TeamDirectory.jsx',
  supplied: [{ filename: 'network.js', description: 'A pretend server answers fetch(\'/api/...\') with JSON after a short delay. NetworkLog lists every request.' }],
  starter,
  focus: {
    edit: [/^  fetch\('\/api\/team'\)/, /\.then\(response => response\.json\(\)\)/, /\.then\(data => setMembers\(data\)\);/],
  },
}
