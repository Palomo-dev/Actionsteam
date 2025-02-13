interface PricingSectionProps {
  basePrice: number;
}

export const PricingSection = ({ basePrice }: PricingSectionProps) => {
  return (
    <section className="py-16 bg-[#0A0F1C]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Inversión
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Obtén acceso a todos los módulos y recursos por un precio único.
        </p>
        <div className="bg-purple-900/20 p-8 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-colors max-w-md mx-auto">
          <div className="text-5xl font-bold mb-4 text-white">
            {basePrice.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </div>
          <p className="text-purple-300 mb-8">
            ¡Aprovecha esta oferta limitada y transforma tu futuro!
          </p>
          <button className="bg-purple-600 text-white py-3 px-8 rounded-lg hover:bg-purple-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
            ¡Reserva tu lugar!
          </button>
        </div>
      </div>
    </section>
  );
};