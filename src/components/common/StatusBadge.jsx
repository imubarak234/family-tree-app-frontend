export default function StatusBadge({ status }) {
  const styles = {
    Living: 'bg-green-100 text-green-800',
    Deceased: 'bg-gray-100 text-gray-800',
    Unknown: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || styles.Unknown
      }`}
    >
      {status || 'Unknown'}
    </span>
  );
}
