import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full h-full flex-1 flex flex-col items-center gap-5 justify-center">
      <h1 className="">Page introuvable</h1>
      <Link href={"/"} className="btn bg-black text-white! no-underline!">
        Retour à l'accueil
      </Link>
    </div>
  );
}
