import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { QuestionCard } from "@/components/questionnaire/QuestionCard";
import { OptionButton } from "@/components/questionnaire/OptionButton";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import { DollarSign, ArrowRight, Play, Clock, Users, Brain, Rocket, Target, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { CountdownTimer } from "@/components/courses/CountdownTimer";

const saasOptions = [
  { id: "crm", label: "CRM (Gestión de Relaciones con Clientes)", description: "Software para gestionar clientes, contactos y ventas, como HubSpot o Salesforce." },
  { id: "erp", label: "ERP (Planificación de Recursos Empresariales)", description: "Herramientas para administrar inventarios, finanzas, recursos humanos y más, como Odoo." },
  { id: "pms", label: "PMS (Sistema de Gestión de Propiedades)", description: "Para hoteles o alquileres vacacionales, gestionando reservas, check-ins y check-outs, como Cloudbeds." },
  { id: "pos", label: "POS (Sistema de Punto de Venta)", description: "Soluciones para gestionar ventas, pagos e inventarios en comercios físicos o en línea, como Square." },
  { id: "project", label: "Gestión de Proyectos", description: "Herramientas para organizar tareas, equipos y proyectos, como Trello o Asana." },
  { id: "billing", label: "Software de Facturación", description: "Para generar facturas, realizar cobros y gestionar impuestos, como FreshBooks." },
  { id: "elearning", label: "Plataformas de E-learning", description: "Para crear y gestionar cursos en línea, como Moodle o Teachable." },
  { id: "marketing", label: "Automatización de Marketing", description: "Para gestionar campañas, correos electrónicos y análisis de marketing, como Mailchimp." },
  { id: "analytics", label: "Analítica de Datos", description: "Software para analizar datos empresariales y tomar decisiones informadas, como Tableau." },
  { id: "hr", label: "Software de Recursos Humanos", description: "Para gestionar nóminas, reclutamiento y empleados, como BambooHR." },
  { id: "collaboration", label: "Plataformas de Colaboración", description: "Herramientas para trabajar en equipo en tiempo real, como Slack o Microsoft Teams." },
  { id: "inventory", label: "Gestión de Inventarios", description: "Para controlar existencias, pedidos y almacenes, como TradeGecko." },
  { id: "ecommerce", label: "Plataformas de Comercio Electrónico", description: "Para crear y administrar tiendas en línea, como Shopify." },
  { id: "subscription", label: "Gestión de Suscripciones", description: "Para empresas que manejan modelos de ingresos recurrentes, como ReCharge." },
  { id: "support", label: "Software de Atención al Cliente", description: "Para gestionar tickets y resolver problemas de clientes, como Zendesk." },
  { id: "finance", label: "Gestión Financiera", description: "Soluciones para administrar presupuestos, gastos e inversiones, como QuickBooks." },
  { id: "security", label: "Software de Seguridad", description: "Para proteger sistemas y datos empresariales, como Okta o LastPass." },
  { id: "telemedicine", label: "Plataformas de Telemedicina", description: "Para consultas médicas en línea, como Doxy.me." },
  { id: "logistics", label: "Optimización de Logística", description: "Para gestionar envíos, rutas y seguimiento de mercancías, como ShipStation." },
  { id: "cms", label: "Gestión de Contenidos (CMS)", description: "Para administrar sitios web y blogs, como WordPress o Contentful." },
];

const objectives = [
  { id: "wealth", label: "Crecer en riqueza", icon: <DollarSign className="text-yellow-500" /> },
  { id: "boss", label: "Ser mi propio jefe", icon: <DollarSign className="text-blue-500" /> },
  { id: "freedom", label: "Libertad financiera", icon: <DollarSign className="text-green-500" /> },
  { id: "travel", label: "Viajar por el mundo", icon: <DollarSign className="text-purple-500" /> },
];

const incomeRanges = [
  { id: "2000-5000", label: "$2,000 - $5,000 USD" },
  { id: "5000-10000", label: "$5,000 - $10,000 USD" },
  { id: "10000-25000", label: "$10,000 - $25,000 USD" },
  { id: "25000-50000", label: "$25,000 - $50,000 USD" },
  { id: "50000-100000", label: "$50,000 - $100,000 USD" },
  { id: "100000-plus", label: "$100,000 USD o más" },
];

const CourseLandingPage = () => {
  const { cursoId } = useParams();
  const [selectedSaas, setSelectedSaas] = useState("");
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedIncome, setSelectedIncome] = useState("");
  const [readyFor28Days, setReadyFor28Days] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [currency, setCurrency] = useState<'COP' | 'USD' | 'MXN'>('COP');
  const navigate = useNavigate();

  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    const checkFormCompletion = () => {
      const step1Complete = selectedSaas !== "";
      const step2Complete = selectedObjectives.length > 0;
      const step3Complete = selectedIncome !== "";
      const step4Complete = readyFor28Days;

      setIsFormComplete(step1Complete && step2Complete && step3Complete && step4Complete);
    };

    checkFormCompletion();
  }, [selectedSaas, selectedObjectives, selectedIncome, readyFor28Days]);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course-landing", cursoId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          instructor:instructors (
            name,
            bio,
            avatar_url
          ),
          course_ratings (
            rating
          )
        `)
        .eq("id", cursoId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!cursoId,
  });

  const { data: slots } = useQuery({
    queryKey: ["course-slots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_slots")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReserveCupo = () => {
    navigate('/checkout?courseId=startup-ai&stripePriceId=price_1QdxgVKfpF4gUTRJir43rlHL&price=300000');
  };

  const formatPrice = (price: number, curr: 'COP' | 'USD' | 'MXN') => {
    const conversions = {
      COP: { rate: 1, symbol: "$" },
      USD: { rate: 0.00025, symbol: "$" },
      MXN: { rate: 0.0043, symbol: "$" }
    };

    const converted = Math.round(price * conversions[curr].rate);
    return `${conversions[curr].symbol}${converted.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Curso no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 text-sm font-medium border border-purple-500/20 mb-4">
                ¡Próximo Lanzamiento! 🚀
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                {course.title}
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                Domina las tecnologías más innovadoras y construye una startup
                rentable con inteligencia artificial.
                <span className="block mt-2 text-purple-300">
                  De la idea al producto en tiempo récord.
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <Brain className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Tecnología Avanzada</h3>
                  <p className="text-gray-300">Implementa IA y automatización para crear productos escalables.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <Rocket className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Crecimiento Rápido</h3>
                  <p className="text-gray-300">Estrategias probadas para escalar tu SaaS rápidamente.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <Target className="w-8 h-8 text-pink-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Ingresos Recurrentes</h3>
                  <p className="text-gray-300">Alcanza $100,000+ USD mensuales con tu SaaS.</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-8 mt-12">
              <ProgressBar current={currentStep} total={totalSteps} />

              {currentStep === 1 && (
                <QuestionCard 
                  title="¿Qué tipo de empresa quieres crear?" 
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="space-y-4">
                    {saasOptions.map((option) => (
                      <Accordion type="single" collapsible key={option.id}>
                        <AccordionItem value={option.id}>
                          <div className="flex items-center space-x-2">
                            <RadioGroup value={selectedSaas} onValueChange={setSelectedSaas}>
                              <div className="flex items-center space-x-2 w-full">
                                <RadioGroupItem value={option.id} id={option.id} />
                                <AccordionTrigger className="flex-1 hover:no-underline py-4">
                                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">{option.label}</Label>
                                </AccordionTrigger>
                              </div>
                            </RadioGroup>
                          </div>
                          <AccordionContent className="px-4 py-2 text-gray-400">
                            {option.description}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                </QuestionCard>
              )}

              {currentStep === 2 && (
                <QuestionCard 
                  title="¿Cuál es tu objetivo principal?"
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="grid grid-cols-1 gap-4">
                    {objectives.map((objective) => (
                      <OptionButton
                        key={objective.id}
                        icon={objective.icon}
                        label={objective.label}
                        selected={selectedObjectives.includes(objective.id)}
                        onClick={() => setSelectedObjectives([objective.id])}
                      />
                    ))}
                  </div>
                </QuestionCard>
              )}

              {currentStep === 3 && (
                <QuestionCard 
                  title="¿A qué nivel de ingresos anuales deseas llegar?"
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <RadioGroup value={selectedIncome} onValueChange={setSelectedIncome} className="grid grid-cols-1 gap-4">
                    <OptionButton
                      label="$30,000 - $50,000 USD"
                      selected={selectedIncome === "30000-50000"}
                      onClick={() => setSelectedIncome("30000-50000")}
                      icon={<DollarSign className="text-yellow-500" />}
                    />
                    <OptionButton
                      label="$50,000 - $100,000 USD"
                      selected={selectedIncome === "50000-100000"}
                      onClick={() => setSelectedIncome("50000-100000")}
                      icon={<DollarSign className="text-green-500" />}
                    />
                    <OptionButton
                      label="$100,000 USD o más"
                      selected={selectedIncome === "100000-plus"}
                      onClick={() => setSelectedIncome("100000-plus")}
                      icon={<DollarSign className="text-blue-500" />}
                    />
                  </RadioGroup>
                </QuestionCard>
              )}

              {currentStep === 4 && (
                <QuestionCard 
                  title="¿Estás listo para el desafío de 28 días?"
                  className="transform transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 p-4 rounded-lg border border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300">
                      <Checkbox
                        id="ready28days"
                        checked={readyFor28Days}
                        onCheckedChange={(checked) => setReadyFor28Days(checked as boolean)}
                      />
                      <Label htmlFor="ready28days" className="flex-1 cursor-pointer">
                        Sí, estoy comprometido a dedicar tiempo y esfuerzo durante los próximos 28 días
                      </Label>
                    </div>

                    <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20">
                      <h3 className="text-xl font-semibold text-white mb-4">Lo que lograrás en 28 días:</h3>
                      <ul className="space-y-3">
                        <li className="flex items-center space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span>MVP funcional de tu SaaS con IA</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span>Primeros clientes pagando</span>
                        </li>
                        <li className="flex items-center space-x-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span>Sistema de ingresos recurrentes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </QuestionCard>
              )}

              {currentStep === 5 && isFormComplete && (
                <div className="mt-16 space-y-8 animate-fade-in">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text mb-4">
                      ¡Tu SaaS está a punto de despegar! 🚀
                    </h2>
                    <p className="text-xl text-gray-300">
                      No pierdas la oportunidad de crear tu startup rentable con IA
                    </p>
                  </div>

                  <CountdownTimer targetDate="2025-02-05" className="mb-8" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Potencial de Ingresos</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Mes 1-3</span>
                            <span className="text-green-400">$5,000 - $10,000 USD</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Mes 4-6</span>
                            <span className="text-green-400">$20,000 - $40,000 USD</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Mes 7-12</span>
                            <span className="text-green-400">$50,000 - $100,000+ USD</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Lo que incluye</h3>
                        <ul className="space-y-3">
                          <li className="flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>28 días de mentoría intensiva</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>Templates y código listo para usar</span>
                          </li>
                          <li className="flex items-center space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span>Comunidad de fundadores</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center space-y-4">
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
                      {formatPrice(300000, currency)}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button 
                      size="lg"
                      className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 group shadow-lg shadow-purple-500/20 animate-pulse"
                      onClick={handleReserveCupo}
                    >
                      ¡Reserva tu Cupo Ahora! 
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {slots && (
                    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-6 rounded-xl border border-purple-500/20">
                      <div className="text-sm text-purple-300 mb-4 text-center">
                        ¡Solo quedan {slots.total_slots - slots.occupied_slots} cupos disponibles!
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Progreso de inscripciones</span>
                          <span className="text-purple-400 font-semibold">
                            {Math.round((slots.occupied_slots / slots.total_slots) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out"
                            style={{ 
                              width: `${(slots.occupied_slots / slots.total_slots) * 100}%` 
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 bg-purple-900/20 p-3 rounded-lg">
                            <Users className="w-5 h-5 text-purple-400" />
                            <div>
                              <div className="text-sm text-gray-400">Cupos disponibles</div>
                              <div className="text-lg font-semibold text-purple-300">
                                {slots.total_slots - slots.occupied_slots}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 bg-purple-900/20 p-3 rounded-lg">
                            <Clock className="w-5 h-5 text-purple-400" />
                            <div>
                              <div className="text-sm text-gray-400">Días restantes</div>
                              <div className="text-lg font-semibold text-purple-300">
                                {Math.ceil((new Date(slots.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="w-[120px]"
                  disabled={currentStep === 1}
                >
                  Anterior
                </Button>
                {currentStep === 5 ? (
                  <Button
                    onClick={handleReserveCupo}
                    className="w-auto px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 animate-pulse"
                  >
                    ¡Reserva tu Cupo Ahora!
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="w-[120px]"
                    disabled={currentStep === totalSteps}
                  >
                    Siguiente
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLandingPage;
