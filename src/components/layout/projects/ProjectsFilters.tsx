"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Props {
  currentLanguage: string;
  currentType: string;
  currentSort: string;
  currentYear: string;
  languages: string[];
  years: string[];
}

export default function ProjectsFilters({
  currentLanguage,
  currentType,
  currentSort,
  currentYear,
  languages,
  years,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.set("page", "1"); // reset page on filter change
    router.push(`/projects?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Language Filter */}
      <Select
        value={currentLanguage}
        onValueChange={(val) => updateFilter("language", val)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Languages</SelectItem>
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Repo Type Filter */}
      <Select
        value={currentType}
        onValueChange={(val) => updateFilter("type", val)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Repository Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Repositories</SelectItem>
          <SelectItem value="original">Original Only</SelectItem>
          <SelectItem value="forked">Forked Only</SelectItem>
          {/* <SelectItem value="private">Private</SelectItem> */}
        </SelectContent>
      </Select>

      {/* Year Filter */}
      <Select
        value={currentYear}
        onValueChange={(val) => updateFilter("year", val)}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Years</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort Filter */}
      <Select
        value={currentSort}
        onValueChange={(val) => updateFilter("sort", val)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updated_desc">Last Updated (Newest)</SelectItem>
          <SelectItem value="updated_asc">Last Updated (Oldest)</SelectItem>
          <SelectItem value="stars_desc">Stars (High → Low)</SelectItem>
          <SelectItem value="stars_asc">Stars (Low → High)</SelectItem>
          <SelectItem value="forks_desc">Forks (High → Low)</SelectItem>
          <SelectItem value="forks_asc">Forks (Low → High)</SelectItem>
          <SelectItem value="name_asc">Name (A → Z)</SelectItem>
          <SelectItem value="name_desc">Name (Z → A)</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={() => router.push("/projects")}>
        Reset
      </Button>
    </div>
  );
}
