export const StatsSection = () => {
  const stats = [
    { number: "50+", label: "Herramientas IA" },
    { number: "1000+", label: "Estudiantes" },
    { number: "24/7", label: "Soporte" },
    { number: "100%", label: "Práctico" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-16">
      {stats.map((stat, index) => (
        <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
          <div className="text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};