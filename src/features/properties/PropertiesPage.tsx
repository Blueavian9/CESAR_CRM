const PropertiesPage = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold tracking-tight">Properties</h1>
        <button className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
          Add Property
        </button>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        Manage your portfolio of residential, commercial, and short-term rentals.
      </p>
      <div className="rounded-lg border bg-white p-4 text-sm text-slate-500">
        Property list table will go here.
      </div>
    </div>
  );
};

export default PropertiesPage;
