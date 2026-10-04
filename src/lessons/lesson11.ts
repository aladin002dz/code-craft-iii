import starter from './starters/11-profile-viewer.jsx?raw'
import type { Lesson } from './types'

export const lesson11: Lesson = {
  id: 11,
  course: 'effects',
  topic: 'Refetch when a value changes',
  title: 'Load the profile that was chosen',
  project: 'Team chat',
  prerequisite: 10,
  request: 'Choosing a person should load their profile, but the panel keeps showing Linus. Once that works, a quick click on Ada and then Grace must still end on Grace’s profile.',
  steps: [
    'Click Grace in the preview and watch the network log: nothing is requested.',
    'The effect reads personId, so add personId to its dependency array.',
    'Answer the prediction, then click Ada and, straight away, Grace. Ada’s response is slow and arrives last.',
    'Keep an ignore flag in the effect: set it in the cleanup and check it before setProfile. Then run the checks.',
  ],
  concept:
    'Every value from props or state that an effect reads belongs in its dependency array, so React runs the effect again when it changes. Before running it again, React calls the previous cleanup. Responses can arrive in any order, so the cleanup marks the old request as unwanted and its late response is ignored.',
  prediction: {
    question: 'With personId in the dependencies but no cleanup: Ada’s profile takes 1.5 seconds, Grace’s takes 0.3 seconds. You click Ada, then Grace straight away. What does the panel show at the end?',
    code: 'useEffect(() => {\n  setProfile(null);\n  fetch(`/api/profiles/${personId}`)\n    .then(response => response.json())\n    .then(data => setProfile(data));\n}, [personId]);',
    options: ['Grace', 'Ada', 'Loading… forever'],
    answer: 1,
    explanation:
      'Both requests finish. Grace’s arrives first and is shown, then Ada’s arrives and setProfile replaces it. Nothing tells the first request that its answer is no longer wanted.',
  },
  objectives: [
    { id: 'loads-first', label: 'The first profile loads when the panel opens' },
    { id: 'follows-person', label: 'Choosing a person loads their profile' },
    { id: 'shows-loading', label: 'The old profile disappears while loading' },
    { id: 'ignores-stale', label: 'A late response never replaces the newer profile' },
  ],
  hints: [
    'The dependency array is empty, so React never runs the effect again. Which value does the effect read that can change?',
    'Use [personId] as the dependencies. Then start the effect with let ignore = false; and return () => { ignore = true; }.',
    'Only store a response that is still wanted: .then(data => { if (!ignore) setProfile(data); });',
  ],
  filename: 'ProfileViewer.jsx',
  supplied: [{ filename: 'network.js', description: 'A pretend server answers fetch(\'/api/profiles/:id\') with JSON. Ada’s profile is slow on purpose. NetworkLog lists every request.' }],
  starter,
  focus: {
    edit: [/^  useEffect\(\(\) => \{/],
  },
}
