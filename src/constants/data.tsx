import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  CheckIcon,
  Circle,
  CircleOff,
  ClockIcon,
  HelpCircle,
  StarIcon,
  Timer,
  XIcon,
} from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "APPLIED",
    label: "Applied",
    icon: CheckIcon,
  },
  {
    value: "INTERVIEW",
    label: "Interview",
    icon: ClockIcon,
  },
  {
    value: "OFFER",
    label: "Offer",
    icon: StarIcon,
  },
  {
    value: "REJECTED",
    label: "Rejected",
    icon: XIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];
