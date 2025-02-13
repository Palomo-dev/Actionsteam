import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { UsersList } from "@/components/admin/users/UsersList";

const Users = () => {
  const { profile } = useAuth();

  if (!profile?.role || profile.role !== 'admin') {
    return (
      <div className="p-4">
        <Card className="bg-red-50 border border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-600 font-medium">
              No tienes permisos de administrador
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold">Lista de Usuarios</h1>
        <p className="text-red-100 mt-2">
          Gestiona los usuarios de la plataforma
        </p>
      </div>
      
      <Card className="bg-white shadow-lg border-0">
        <CardContent className="p-0">
          <UsersList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;