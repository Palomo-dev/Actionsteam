import { User, Mail, CreditCard, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { type Profile } from "./UsersList";

interface UserListItemProps {
  user: Profile;
  onRoleChange: (userId: string, newRole: string) => Promise<void>;
  onViewDetails: (user: Profile) => void;
}

export const UserListItem = ({ user, onRoleChange, onViewDetails }: UserListItemProps) => {
  const hasActiveSubscription = user.subscriptions?.some(
    sub => sub.status === 'active' && new Date(sub.current_period_end) > new Date()
  );

  const hasPurchasedCourses = user.payments?.some(
    payment => payment.status === 'completed'
  );

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">{user.first_name || 'Usuario'}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-1" />
            {user.email}
          </div>
          <div className="flex gap-2 mt-1">
            {hasActiveSubscription && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Suscrito
              </Badge>
            )}
            {hasPurchasedCourses && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CreditCard className="h-3 w-3" />
                Compras realizadas
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Select
          defaultValue={user.role}
          onValueChange={(value) => onRoleChange(user.id, value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">Cliente</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(user)}
        >
          Ver Detalles
        </Button>
      </div>
    </div>
  );
};