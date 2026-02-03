"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { promises } from "fs";
import path from "path";
import { DataTable } from "@/components/data-table";
import { DataTableColumns } from "@/components/data-table-columns";
import { data } from "@/constants/table-data";

type ApplicationStatus = "Applied" | "Interview" | "Offer" | "Rejected";

type Application = {
  id: string;
  role: string;
  company: string;
  applicationUrl?: string;
  dateApplied: string;
  datePosted?: string;
  status: ApplicationStatus;
};

// const columns: ColumnDef<Application>[] = [
//   {
//     accessorKey: "role",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Role" />
//     ),
//   },
//   {
//     accessorKey: "company",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Company" />
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Status" />
//     ),
//     cell: ({ row }) => (
//       <Badge variant={statusVariantMap[row.original.status]}>
//         {row.original.status}
//       </Badge>
//     ),
//   },
//   {
//     accessorKey: "dateApplied",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Date Applied" />
//     ),
//   },
//   {
//     accessorKey: "datePosted",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Date Posted" />
//     ),
//     cell: ({ row }) => row.original.datePosted ?? "—",
//   },
//   {
//     accessorKey: "applicationUrl",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Link" />
//     ),
//     cell: ({ row }) =>
//       row.original.applicationUrl ? (
//         <a
//           href={row.original.applicationUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-sm text-primary underline-offset-4 hover:underline"
//         >
//           View
//         </a>
//       ) : (
//         "—"
//       ),
//     meta: { align: "right" },
//   },
// ];

// const statusVariantMap: Record<
//   ApplicationStatus,
//   "default" | "secondary" | "destructive" | "outline"
// > = {
//   Applied: "secondary",
//   Interview: "default",
//   Offer: "outline",
//   Rejected: "destructive",
// };

const ApplicationsTracker = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Applications</CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable data={data} columns={DataTableColumns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsTracker;
