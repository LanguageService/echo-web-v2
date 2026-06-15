export default function Feature({ icon, title, description }: {
  icon: React.ReactNode; title: string; description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border shadow-md hover:shadow-lg transition duration-300">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-foreground text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
