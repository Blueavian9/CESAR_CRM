import { type FC, useState } from "react";
import { MOCK_PROPERTIES } from "./mockProperties";
import { useSearch } from "../../app/context/SearchContext";

type SortKey = "name" | "city" | "type" | "units" | "vacant" | "status";
type SortDir = "asc" | "desc";

const PropertiesPage: FC = () => {
  const { query } = useSearch();
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "draft"
  >("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const normalizedQuery = query.toLowerCase().trim();
  // ...rest of your existing code...
