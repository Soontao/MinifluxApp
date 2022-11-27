/**
 * get first image link from content
 *
 * @returns 
 */
export function getImageLink(content: string): string | undefined {
  if (typeof content === 'string') {
    const r = /(https?:\/\/.*\/.*\.(png|gif|jpeg|jpg))/.exec(content);
    if (r !== null) {
      return r[0];
    }
  }
}