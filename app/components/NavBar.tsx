const NavBar = () => {
  return (
    <div>
      <header className="sticky flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏠</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-gray-700 hover:text-black">
            Login
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600">
            Sign Up
          </button>
        </div>
      </header>
    </div>
  );
};

export default NavBar;
