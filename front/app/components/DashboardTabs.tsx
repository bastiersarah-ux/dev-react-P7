export default function DashboardTabs() {
  return (
    <div className="flex gap-3 mt-6">
      <button className="bg-orange-100 text-orange-600 px-4 py-2 rounded">
        Liste
      </button>

      <button className="border px-4 py-2 rounded">Kanban</button>
    </div>
  );
}
