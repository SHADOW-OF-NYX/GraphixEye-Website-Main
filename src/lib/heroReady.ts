type Listener = () => void;

let ready = false;
const listeners = new Set<Listener>();

/** Signal that the home hero video can display / play. Idempotent. */
export function markHeroReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

/** Subscribe once; fires immediately if already ready. Returns unsubscribe. */
export function onHeroReady(cb: Listener): () => void {
  if (ready) {
    cb();
    return () => undefined;
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
