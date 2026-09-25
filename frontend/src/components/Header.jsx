function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Sales Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm text-gray-500">
          Search
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
          M
        </div>
      </div>
    </header>
  );
}

export default Header;