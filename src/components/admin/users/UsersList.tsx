import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserListItem } from "./UserListItem";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

export type Profile = Tables<"profiles"> & {
  subscriptions?: {
    status: string;
    current_period_end: string;
  }[];
  payments?: {
    status: string;
  }[];
  user_courses?: {
    count: number;
  }[];
  study_sessions?: {
    duration_seconds: number;
  }[];
  certificates?: {
    count: number;
  }[];
};

export const UsersList = () => {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          subscriptions (
            status,
            current_period_end
          ),
          payments (
            status
          ),
          user_courses (
            count
          ),
          study_sessions (
            duration_seconds
          )
        `);

      if (error) throw error;
      return data as Profile[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error al cargar usuarios: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {users?.map((user) => (
        <div
          key={user.id}
          className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={() => setSelectedUser(user)}
        >
          <UserListItem 
            user={user} 
            onRoleChange={async (userId, newRole) => {
              // Implementar el cambio de rol
              const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);
              
              if (error) {
                console.error('Error al cambiar rol:', error);
                return;
              }
              
              // Recargar la lista de usuarios
              refetch();
            }}
            onViewDetails={(user) => setSelectedUser(user)}
          />
        </div>
      ))}

      <UserDetailsDialog
        user={selectedUser}
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      />
    </div>
  );
};