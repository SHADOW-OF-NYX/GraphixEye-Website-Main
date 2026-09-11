type Listener = () => void;

let ready = false;
const listeners = new Set<Listener>();

/** Signal that the home hero video is actually playing. Idempotent. */
export function markHeroReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

/** Reset so the next home visit waits for video again. */
export function resetHeroReady() {
  ready = false;
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
