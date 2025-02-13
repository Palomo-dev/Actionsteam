import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  name: string;
  birthDate: string;
  email: string;
  phone: string;
  location: string;
}

export const Header = ({ name, birthDate, email, phone, location }: HeaderProps) => {
  const contactInfo = [
    { icon: <Mail className="w-4 h-4 text-red-600" />, value: email },
    { icon: <Phone className="w-4 h-4 text-red-600" />, value: phone },
    { icon: <MapPin className="w-4 h-4 text-red-600" />, value: location },
    { icon: <Calendar className="w-4 h-4 text-red-600" />, value: birthDate },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-50" />
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img
                src="/instructor-profile.jpg"
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <Badge 
                variant="outline" 
                className="mb-2 px-3 py-1 border-red-200 text-red-700 bg-red-50/50"
              >
                Instructor Principal
              </Badge>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-red-600 to-red-800 text-transparent bg-clip-text">
                {name}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    {info.icon}
                    <span className="text-sm">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};