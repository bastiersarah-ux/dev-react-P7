import { useEffect, useState } from "react";
import { User } from "@front/types/api-types";
import { searchUsers } from "@front/services/userSearchService";

export const useUserSearch = (query: string) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const load = async () => {
      if (query.length < 2) {
        setUsers([]); // pas de recherche si moins de 2 lettres
        return;
      }

      const data = await searchUsers(query);
      setUsers(data);
    };

    load();
  }, [query]);

  return { users };
};
