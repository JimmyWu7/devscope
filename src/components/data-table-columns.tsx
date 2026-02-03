"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";

import { labels, priorities, statuses } from "@/constants/data";
import { type Task } from "@/constants/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import Link from "next/link";

function formatSalary(min?: number, max?: number, currency = "USD") {
  if (!min && !max) return "—";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const formatK = (n: number) => {
    const formatted = formatter.format(n / 1000); // divide by 1000
    return formatted.replace(/\d+(\.\d+)?/, (match) => `${match}K`); // append "K"
  };

  if (min && max) return `${formatK(min)} – ${formatK(max)}`;
  return formatK(min ?? max!);
}

export const DataTableColumns: ColumnDef<Task>[] = [
  // {
  //   accessorKey: "company",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Company" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="max-w-40 truncate">{row.getValue("company")}</div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "company",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-40 truncate font-medium">
            {row.getValue("company")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-40 truncate font-medium">
            {row.getValue("role")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Location" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-30 truncate font-medium">
            {row.getValue("location")}
          </span>
        </div>
      );
    },
  },
  {
    id: "salary",
    accessorFn: (row) => ({
      min: row.salaryMin,
      max: row.salaryMax,
      currency: row.salaryCurrency,
    }),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary" />
    ),
    cell: ({ row }) => {
      const { min, max, currency } = row.getValue("salary") as {
        min?: number;
        max?: number;
        currency?: string;
      };

      return (
        <span className="font-medium">{formatSalary(min, max, currency)}</span>
      );
    },
    sortingFn: (a, b) => {
      const aMin = a.original.salaryMin ?? 0;
      const bMin = b.original.salaryMin ?? 0;
      return aMin - bMin;
    },
  },

  {
    accessorKey: "applicationUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => {
      // const label = labels.find((label) => label.value === row.original.applicationUrl);

      return (
        <div className="flex gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <Link
            href={row.getValue("applicationUrl")}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-30 truncate font-medium hover:text-blue-400"
          >
            Link
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-25 items-center gap-2">
          {status.icon && (
            <status.icon className="text-muted-foreground size-4" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    // filterFn: (row, id, value) => {
    //   return value.includes(row.getValue(id));
    // },
  },
  {
    accessorKey: "datePosted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Posted" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("datePosted") as Date;

      return (
        <div className="flex gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-30 truncate font-medium">
            {date.toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "dateApplied",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Applied" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("dateApplied") as Date;

      return (
        <div className="flex gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-30 truncate font-medium">
            {date.toLocaleDateString()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-30 truncate font-medium">
            {row.getValue("notes")}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "notes",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Notes" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("notes")
  //     );

  //     if (!priority) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex items-center gap-2">
  //         {priority.icon && (
  //           <priority.icon className="text-muted-foreground size-4" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     );
  //   },
  // filterFn: (row, id, value) => {
  //   return value.includes(row.getValue(id));
  // },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
