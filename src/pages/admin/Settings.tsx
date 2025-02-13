import { SettingsGeneral } from "./settings/SettingsGeneral";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configuración</h1>
      
      <div className="grid gap-6">
        <SettingsGeneral />

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Correo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">Servidor SMTP</Label>
              <Input id="smtpHost" placeholder="smtp.ejemplo.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPort">Puerto SMTP</Label>
              <Input id="smtpPort" placeholder="587" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpUser">Usuario SMTP</Label>
              <Input id="smtpUser" type="email" placeholder="usuario@ejemplo.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Contraseña SMTP</Label>
              <Input id="smtpPassword" type="password" />
            </div>
            
            <Button>Guardar Configuración</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;