import ThemeToggle from "./ThemeToggle";

function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[#D8D3DA] bg-[#E8E5EA] px-8 dark:border-[#3B383D] dark:bg-[#1A1A1A]">
      <div>
        <h2 className="text-lg font-semibold text-[#27242A] dark:text-[#F3F3F3]">
          Sales Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button className="text-sm text-[#6F6972] hover:text-[#6339BD] dark:text-[#A7A3AA] dark:hover:text-[#F3F3F3]">
          Search
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7445D8] text-sm font-medium text-[#FFFFFF] dark:bg-[#2D2A30] dark:text-[#F3F3F3]">
          M
        </div>
      </div>
    </header>
  );
}

export default Header;
