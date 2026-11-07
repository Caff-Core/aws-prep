/** FNV-1a hash. Used for stable ordering, never for security. */
function hash(text: string): number {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

/**
 * Orders options by a hash of the question and option ids. Authors tend to write
 * the correct option first, so stored order must never reach learners. The result
 * is the same on every build, which keeps static pages reproducible.
 */
export function orderOptions<T extends { id: string }>(questionId: string, options: readonly T[]) {
  return [...options].sort((a, b) => hash(`${questionId}:${a.id}`) - hash(`${questionId}:${b.id}`));
}
