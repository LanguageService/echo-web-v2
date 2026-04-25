export default function Feature({ icon, title, description }: {
  icon: React.ReactNode; title: string; description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold dark:text-white">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
    </div>
  );
}
