// Must be the first import of anything that loads react-dom: React looks for the
// devtools hook once, when react-dom initialises.
import { handleCommit } from './inspect'

const noop = () => {}
const globals = globalThis as { __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown }

globals.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
  supportsFiber: true,
  isDisabled: false,
  renderers: new Map(),
  inject: () => 1,
  checkDCE: noop,
  onScheduleFiberRoot: noop,
  onCommitFiberUnmount: noop,
  onPostCommitFiberRoot: noop,
  setStrictMode: noop,
  onCommitFiberRoot: (_id: number, root: Parameters<typeof handleCommit>[0]) => handleCommit(root),
}
