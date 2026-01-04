// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/Card";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { ChevronLeft, ChevronRight, Search } from "lucide-react";
// import { useState } from "react";

// interface DataTableProps<T> {
//   data: T[];
//   columns: {
//     key: string;
//     label: string;
//     render?: (item: T) => React.ReactNode;
//   }[];
//   searchKey?: string;
//   pagination?: {
//     page: number;
//     limit: number;
//     total: number;
//     onPageChange: (page: number) => void;
//   };
//   onSearch?: (query: string) => void;
//   loading?: boolean;
// }

// export function DataTable<T extends Record<string, any>>({
//   data,
//   columns,
//   searchKey,
//   pagination,
//   onSearch,
//   loading = false,
// }: DataTableProps<T>) {
//   const [searchQuery, setSearchQuery] = useState("");

//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     onSearch?.(query);
//   };

//   const totalPages = pagination
//     ? Math.ceil(pagination.total / pagination.limit)
//     : 1;

//   return (
//     <Card className="p-6">
//       {/* Search */}
//       {onSearch && (
//         <div className="mb-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
//             <Input
//               placeholder={`Search ${searchKey || "items"}...`}
//               value={searchQuery}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </div>
//       )}

//       {/* Table */}
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableHead key={column.key}>{column.label}</TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : data.length === 0 ? (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No results found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               data.map((item, index) => (
//                 <TableRow key={item.id || index}>
//                   {columns.map((column) => (
//                     <TableCell key={column.key}>
//                       {column.render ? column.render(item) : item[column.key]}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       {pagination && (
//         <div className="flex items-center justify-between space-x-2 py-4">
//           <div className="text-sm text-muted-foreground">
//             Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
//             {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
//             {pagination.total} entries
//           </div>
//           <div className="flex items-center space-x-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => pagination.onPageChange(pagination.page - 1)}
//               disabled={pagination.page <= 1}
//             >
//               <ChevronLeft className="h-4 w-4" />
//               Previous
//             </Button>
//             <div className="flex items-center space-x-1">
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 const pageNum = i + 1;
//                 return (
//                   <Button
//                     key={pageNum}
//                     variant={
//                       pagination.page === pageNum ? "default" : "outline"
//                     }
//                     size="sm"
//                     onClick={() => pagination.onPageChange(pageNum)}
//                   >
//                     {pageNum}
//                   </Button>
//                 );
//               })}
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => pagination.onPageChange(pagination.page + 1)}
//               disabled={pagination.page >= totalPages}
//             >
//               Next
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </Card>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
  }[];
  searchKey?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  onSearch?: (query: string) => void;
  loading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchKey,
  pagination,
  onSearch,
  loading = false,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.limit)
    : 1;

  return (
    <Card className="p-6">
      {/* Search */}
      {onSearch && (
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={`Search ${searchKey || "items"}...`}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Show skeleton rows instead of full page skeleton
              [...Array(5)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(item) : item[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={
                      pagination.page === pageNum ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => pagination.onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
