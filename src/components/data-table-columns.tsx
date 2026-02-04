"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { statuses } from "@/constants/data";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { JobApplication } from "./layout/dashboard/ApplicationsTracker";

const EMPTY = "-----";

function renderEmpty() {
  return <span className="text-muted-foreground">{EMPTY}</span>;
}

function displayOrEmpty(value?: string | null) {
  if (value == null || value.trim() === "") {
    return renderEmpty();
  }
  return value;
}

function formatDate(date: string) {
  const dateOnly = date.split("T")[0]; // "2026-02-04"
  const [y, m, d] = dateOnly.split("-");
  return `${m}/${d}/${y}`;
}

function formatSalary(
  min?: number | null,
  max?: number | null,
  currency = "USD"
) {
  if (min == null && max == null) {
    return <span className="text-muted-foreground">-----</span>;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const formatK = (n: number) => {
    const formatted = formatter.format(n / 1000);
    return formatted.replace(/\d+(\.\d+)?/, (match) => `${match}K`);
  };

  if (min != null && max != null) return `${formatK(min)} - ${formatK(max)}`;
  return formatK((min ?? max)!);
}

const statusIconColors: Record<string, string> = {
  Applied: "text-blue-500",
  Interview: "text-yellow-500",
  Offer: "text-green-500",
  Rejected: "text-red-500",
};

export const DataTableColumns: ColumnDef<JobApplication>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px] cursor-pointer"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] cursor-pointer"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );
      if (!status) return null;
      const iconColor =
        statusIconColors[status.label] ?? "text-muted-foreground";
      return (
        <div className="flex w-25 items-center gap-2">
          {status.icon && <status.icon className={`size-4 ${iconColor}`} />}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "dateApplied",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Applied" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("dateApplied") as string;

      return (
        <div className="flex items-center gap-2">
          {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
          <span className="max-w-20 font-medium">{formatDate(date)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Location" />
    ),
    cell: ({ row }) => {
      const location = row.getValue("location") as string | null | undefined;

      return (
        <span className="max-w-40 truncate font-medium">
          {displayOrEmpty(location)}
        </span>
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
        <div className="flex gap-2">
          <span className="font-medium max-w-40">
            {formatSalary(min, max, currency)}
          </span>
        </div>
      );
    },
    sortingFn: (a, b) => {
      const aMin = a.original.salaryMin ?? 0;
      const bMin = b.original.salaryMin ?? 0;
      return aMin - bMin;
    },
  },
  {
    accessorKey: "datePosted",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Posted" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("datePosted") as string;

      return (
        <div className="flex gap-2">
          <span className="max-w-20 truncate font-medium">
            {formatDate(date)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "applicationUrl",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => {
      const url = row.getValue("applicationUrl") as string | null;

      if (!url || url.trim() === "") {
        return <span className="text-muted-foreground">{EMPTY}</span>;
      }

      return (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-400"
        >
          View <ExternalLinkIcon className="size-3" />
        </Link>
      );
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string | null | undefined;

      return (
        <span className="max-w-35 truncate font-medium">
          {displayOrEmpty(notes)}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
