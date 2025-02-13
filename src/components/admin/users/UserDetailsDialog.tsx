import { Activity, User, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatSeconds } from "@/utils/timeUtils";

interface UserDetailsDialogProps {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsDialog = ({ 
  user, 
  open, 
  onOpenChange,
}: UserDetailsDialogProps) => {
  if (!user) return null;

  // Verificar si el usuario está suscrito basado en el campo is_subscribed
  const isSubscribed = user.is_subscribed || false;

  // También verificar si tiene una suscripción activa
  const hasActiveSubscription = user.subscriptions?.some(
    sub => sub.status === 'active' && new Date(sub.current_period_end) > new Date()
  );

  // El usuario está suscrito si cualquiera de las dos condiciones es verdadera
  const userIsSubscribed = isSubscribed || hasActiveSubscription;

  const formatCurrency = (amount: number) => {
    return amount?.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const calculateTotalStudyTime = (sessions: any[]) => {
    if (!sessions || sessions.length === 0) return 0;
    return sessions.reduce((total, session) => total + (session.duration_seconds || 0), 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Actividad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Métrica</TableHead>
                      <TableHead>Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Cursos Inscritos</TableCell>
                      <TableCell>{user.user_courses?.[0]?.count || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Certificados</TableCell>
                      <TableCell>{user.certificates?.[0]?.count || 0}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tiempo Total de Estudio</TableCell>
                      <TableCell>
                        {formatSeconds(calculateTotalStudyTime(user.study_sessions))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <p>{user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Nombre:</span>
                    <p>{user.first_name || 'No especificado'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Rol:</span>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Estado de suscripción:</span>
                    <Badge variant={userIsSubscribed ? 'default' : 'secondary'}>
                      {userIsSubscribed ? 'Suscrito' : 'No suscrito'}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Fecha de registro:</span>
                    <p>{new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Historial de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.payments?.length ? (
                    user.payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>
                          <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                            {payment.status === 'completed' ? 'Completado' : 'Pendiente'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No hay pagos registrados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};