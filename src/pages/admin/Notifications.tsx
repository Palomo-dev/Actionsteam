import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Notifications = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestión de Notificaciones</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Enviar Nueva Notificación</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" placeholder="Título de la notificación" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje</Label>
              <Textarea 
                id="message" 
                placeholder="Escribe el mensaje de la notificación"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Destinatarios</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona los destinatarios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los usuarios</SelectItem>
                  <SelectItem value="students">Estudiantes</SelectItem>
                  <SelectItem value="instructors">Instructores</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" className="w-full">
              Enviar Notificación
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Notificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((notification) => (
              <div key={notification} className="p-4 border border-gray-800 rounded-lg">
                <h3 className="font-semibold">Notificación {notification}</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Contenido de la notificación {notification}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">Enviado: hace 2 días</span>
                  <span className="text-xs text-gray-500">Destinatarios: Todos los usuarios</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;