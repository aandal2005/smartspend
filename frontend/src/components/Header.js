function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="flex items-center gap-4">
        <input
          placeholder="Search"
          className="bg-[#1e293b] px-4 py-2 rounded-xl outline-none"
        />

        <div className="bg-[#1e293b] px-4 py-2 rounded-xl">
          Emma Parson
        </div>
      </div>
    </div>
  );
}

export default Header;