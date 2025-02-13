import { Button } from "@/components/ui/button";

interface PriceSelectorProps {
  price: number;
  currency: 'COP' | 'USD' | 'MXN';
  setCurrency: (currency: 'COP' | 'USD' | 'MXN') => void;
}

export const PriceSelector = ({ price, currency, setCurrency }: PriceSelectorProps) => {
  const formatPrice = (price: number) => {
    const conversions = {
      COP: { rate: 1, symbol: "$" },
      USD: { rate: 0.00025, symbol: "$" },
      MXN: { rate: 0.0043, symbol: "$" }
    };

    const converted = Math.round(price * conversions[currency].rate);
    return `${conversions[currency].symbol}${converted.toLocaleString()}`;
  };

  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex justify-center gap-4 mb-4">
        {(['COP', 'USD', 'MXN'] as const).map((curr) => (
          <Button
            key={curr}
            variant={currency === curr ? "default" : "outline"}
            onClick={() => setCurrency(curr)}
            className={`w-20 ${
              currency === curr 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                : 'border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/10'
            } transition-all duration-300 hover:scale-105`}
          >
            {curr}
          </Button>
        ))}
      </div>
      <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
        {formatPrice(price)}
      </div>
    </div>
  );
};