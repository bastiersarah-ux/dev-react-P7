export default function StatusBadge({ status }) {
  const styles = {
    todo: "bg-red-100 text-red-500",
    progress: "bg-yellow-100 text-yellow-600",
    done: "bg-green-100 text-green-600",
  };

  const labels = {
    todo: "À faire",
    progress: "En cours",
    done: "Terminé",
  };

  return (
    <span className={`text-xs px-3 py-1 rounded ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
