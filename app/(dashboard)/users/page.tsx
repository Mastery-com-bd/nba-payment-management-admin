// "use client";

// import { DataTable } from "@/components/shared/DataTable";
// import { UserDetailsModal } from "@/components/modals/UserDetailsModal";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { adminApi } from "@/lib/api/adminApi";
// import { userApi } from "@/lib/api/userApi";
// import { User } from "@/lib/types";
// import { Edit, Eye, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// export default function UsersPage() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//   });

//   const fetchUsers = async (page = 1, search = "") => {
//     setLoading(true);
//     try {
//       const response = await adminApi.getAllUsers({
//         page,
//         limit: pagination.limit,
//       });
//       if (response.success && response.data) {
//         setUsers(response.data);
//         setPagination((prev) => ({
//           ...prev,
//           page,
//           total: response.meta?.total || 0,
//         }));
//       }
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handlePageChange = (page: number) => {
//     fetchUsers(page);
//   };

//   const handleSearch = (query: string) => {
//     fetchUsers(1, query);
//   };

//   const handleView = (id: string) => {
//     setSelectedUserId(id);
//     setModalOpen(true);
//   };

//   const handleEdit = (id: string) => {
//     // TODO: Implement edit user
//     console.log("Edit user:", id);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this user?")) return;

//     try {
//       const response = await userApi.deleteUser(id);
//       if (response.success) {
//         toast.success("User deleted successfully");
//         fetchUsers();
//       } else {
//         toast.error("Failed to delete user");
//       }
//     } catch (error) {
//       toast.error("Failed to delete user");
//     }
//   };

//   const columns = [
//     {
//       key: "avatar",
//       label: "Avatar",
//       render: (user: User) => (
//         <Avatar className="h-8 w-8">
//           <AvatarImage src={user.avatar_url} alt={user.full_name} />
//           <AvatarFallback>
//             {user.full_name
//               .split(" ")
//               .map((n) => n[0])
//               .join("")
//               .toUpperCase()}
//           </AvatarFallback>
//         </Avatar>
//       ),
//     },
//     {
//       key: "full_name",
//       label: "Name",
//     },
//     {
//       key: "email",
//       label: "Email",
//     },
//     {
//       key: "role",
//       label: "Role",
//       render: (user: User) => (
//         <Badge variant={user.role === "admin" ? "default" : "secondary"}>
//           {user.role}
//         </Badge>
//       ),
//     },
//     {
//       key: "is_active",
//       label: "Status",
//       render: (user: User) => (
//         <Badge variant={user.is_active ? "success" : "destructive"}>
//           {user.is_active ? "Active" : "Inactive"}
//         </Badge>
//       ),
//     },
//     {
//       key: "actions",
//       label: "Actions",
//       render: (user: User) => (
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleView(user.id)}
//           >
//             <Eye className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleEdit(user.id)}
//           >
//             <Edit className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleDelete(user.id)}
//           >
//             <Trash2 className="h-4 w-4" />
//           </Button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold">Users</h1>
//         <p className="text-muted-foreground">
//           Manage user accounts and permissions
//         </p>
//       </div>

//       <DataTable
//         data={users}
//         columns={columns}
//         searchKey="users"
//         pagination={{
//           ...pagination,
//           onPageChange: handlePageChange,
//         }}
//         onSearch={handleSearch}
//         loading={loading}
//       />

//       <UserDetailsModal
//         userId={selectedUserId}
//         open={modalOpen}
//         onOpenChange={setModalOpen}
//       />
//     </div>
//   );
// }

"use client";

import { UserDetailsModal } from "@/components/modals/UserDetailsModal";
import { DataTable } from "@/components/shared/DataTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { adminApi } from "@/lib/api/adminApi";
import { userApi } from "@/lib/api/userApi";
import { User } from "@/lib/types";
import { Eye, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToToggle, setUserToToggle] = useState<{
    id: string;
    currentStatus: boolean;
  } | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const fetchUsers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const response = await adminApi.getAllUsers({
        page,
        limit: pagination.limit,
        searchTerm: search || undefined,
      });
      if (response.success && response.data) {
        setUsers(response.data);
        setPagination((prev) => ({
          ...prev,
          page: response.meta?.page || 1,
          total: response.meta?.total || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleSearch = (query: string) => {
    fetchUsers(1, query);
  };

  const handleView = (id: string) => {
    setSelectedUserId(id);
    setModalOpen(true);
  };

  // const handleEdit = (id: string) => {
  //   // TODO: Implement edit user
  //   console.log("Edit user:", id);
  // };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
  };

  const handleToggleClick = (id: string, currentStatus: boolean) => {
    setUserToToggle({ id, currentStatus });
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await userApi.deleteUser(userToDelete);
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setUserToDelete(null);
    }
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;

    try {
      const response = await userApi.deactivateUserAccount(userToToggle.id);
      if (response.success) {
        toast.success(
          `User ${
            userToToggle.currentStatus ? "deactivated" : "activated"
          } successfully`
        );
        fetchUsers();
      } else {
        toast.error(
          `Failed to ${
            userToToggle.currentStatus ? "deactivate" : "activate"
          } user`
        );
      }
    } catch (error) {
      toast.error(
        `Failed to ${
          userToToggle.currentStatus ? "deactivate" : "activate"
        } user`
      );
    } finally {
      setUserToToggle(null);
    }
  };

  const columns = [
    {
      key: "avatar",
      label: "Avatar",
      render: (user: User) => (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url} alt={user.full_name} />
          <AvatarFallback>
            {user.full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      key: "full_name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "role",
      label: "Role",
      render: (user: User) => (
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <Badge variant={user.is_active ? "success" : "destructive"}>
            {user.is_active ? "Active" : "Inactive"}
          </Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <Switch
                  checked={user.is_active}
                  onCheckedChange={() =>
                    handleToggleClick(user.id, user.is_active)
                  }
                />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {user.is_active ? "Deactivate User" : "Activate User"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {user.is_active
                    ? `Are you sure you want to deactivate ${user.full_name}'s account? They will not be able to log in until reactivated.`
                    : `Are you sure you want to activate ${user.full_name}'s account? They will be able to log in again.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setUserToToggle(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmToggleStatus}>
                  {user.is_active ? "Deactivate" : "Activate"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(user.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(user.id)}
          >
            <Edit className="h-4 w-4" />
          </Button> */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={user.role === "admin"}
                onClick={() => handleDeleteClick(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  <span className="font-semibold">{user.full_name}</span>
                  {"'s account and remove all their data from our servers."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setUserToDelete(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        searchKey="users"
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
        onSearch={handleSearch}
        loading={loading}
      />

      <UserDetailsModal
        userId={selectedUserId}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* Delete Confirmation Dialog */}
      {/* <AlertDialog
        open={!!userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user's account and remove all their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}

      {/* Toggle Status Confirmation Dialog */}
      {/* <AlertDialog
        open={!!userToToggle}
        onOpenChange={(open) => !open && setUserToToggle(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {userToToggle?.currentStatus
                ? "Deactivate User"
                : "Activate User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {userToToggle?.currentStatus
                ? "Are you sure you want to deactivate this user's account? They will not be able to log in until reactivated."
                : "Are you sure you want to activate this user's account? They will be able to log in again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToToggle(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              {userToToggle?.currentStatus ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
}
