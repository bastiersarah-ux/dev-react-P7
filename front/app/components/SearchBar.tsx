import Image from "next/image";
import SearchIcon from "@front/public/icon-search.svg";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <label className="input input-bordered flex items-center gap-2 w-72">
      <input type="text" className="grow" placeholder="Rechercher une tâche" />
      <Image src={SearchIcon} alt="Icône commentaires" className="w-4 h-4" />
    </label>
  );
}
