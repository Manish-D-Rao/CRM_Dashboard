function StatCard({ title, value, change }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
        {value}
      </p>

      <p className="mt-2 text-xs text-gray-500">
        {change}
      </p>
    </article>
  );
}

export default StatCard;
