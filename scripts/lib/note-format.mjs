// Display formatting only: preserve JSON values, key order and execution contracts.
export function formatNoteMetadata(meta) {
  const value = JSON.parse(JSON.stringify(meta));
  function format(item, depth, prefix = 0) {
    const inline = JSON.stringify(item);
    if (!item || typeof item !== 'object' || !Object.keys(item).length
      || (depth > 0 && depth * 2 + prefix + inline.length <= 120)) return inline;
    const indent = '  '.repeat(depth + 1);
    const rows = Array.isArray(item)
      ? item.map(child => indent + format(child, depth + 1))
      : Object.entries(item).map(([key, child]) => {
        const label = JSON.stringify(key) + ': ';
        return indent + label + format(child, depth + 1, label.length);
      });
    return (Array.isArray(item) ? '[' : '{') + '\n' + rows.join(',\n') + '\n'
      + '  '.repeat(depth) + (Array.isArray(item) ? ']' : '}');
  }
  return format(value, 0);
}
