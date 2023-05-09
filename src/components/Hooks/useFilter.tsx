import { useEffect, useState } from "react";

export type UseFilterOptions<T> = {
  options: T[];
  filterFunction: (options: T[], query: string) => T[];
};

export type UseFilter = <T>(params: UseFilterOptions<T>) => {
  query: string;
  setQuery: (query: string) => void;
  filtered: T[];
};

export const useFilter: UseFilter = ({ options, filterFunction }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFilteredOptions] = useState(options);

  useEffect(() => {
    if (query === "") return setFilteredOptions(options);

    const results = filterFunction(options, query);

    setFilteredOptions(results);
  }, [query, options, filterFunction]);

  return { query, setQuery, filtered };
};
