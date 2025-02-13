export const NewsSection = () => {
  const articles = [
    {
      date: "31 Enero 2025",
      category: "Finanzas",
      title: "Pasos para liderar un equipo",
      description: "Multiplica tus oportunidades con creatividad, esfuerzo, estrategia y soluciones de bajo costo."
    },
    {
      date: "30 Diciembre 2024",
      category: "Finanzas",
      title: "Cómo generar ingresos adicionales desde casa sin complicaciones",
      description: "Descubre cómo generar ingresos adicionales desde la comodidad de tu hogar, sin complicaciones y aprovechando tus habilidades y tiempo libre."
    },
    {
      date: "30 Diciembre 2024",
      category: "Finanzas",
      title: "Los secretos para construir una fuente de ingresos pasivos de manera efectiva",
      description: "Los secretos para construir una fuente de ingresos pasivos sostenibles exitosamente."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
          NOTICIAS Y ARTÍCULOS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">{article.date}</span>
                <span className="px-3 py-1 bg-red-50 text-red-800 rounded-full text-sm">
                  {article.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-red-800 transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600">{article.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
