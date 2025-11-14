export default function AnnouncementCard({ ann }) {
  return (
    <div className="border-l-4 border-indigo-500 pl-4 py-2 mb-3">
      <h3 className="font-medium">{ann.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{ann.content}</p>
      <p className="text-xs text-gray-500 mt-1">{new Date(ann.date).toLocaleDateString()}</p>
    </div>
  );
}