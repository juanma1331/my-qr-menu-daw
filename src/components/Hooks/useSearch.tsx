import { useEffect, useState } from "react";

export type UseProductSearchParams<T> = {
  data: T[];
  filter: (data: T[], query: string) => T[];
};

export type UseSearch = <T>(params: UseProductSearchParams<T>) => {
  query: string;
  setQuery: (query: string) => void;
  searchResults: T[];
};

export const useSearch: UseSearch = ({ data, filter }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(data);

  useEffect(() => {
    if (query === "") return setSearchResults(data);

    const results = filter(data, query);

    setSearchResults(results);
  }, [query, data, filter]);

  return { query, setQuery, searchResults };
};
