"use client";

import Link from "next/link";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error }: ErrorProps) {
  return (
    <div className="w-full h-full flex-1 flex flex-col items-center gap-5 justify-center">
      <h1>Une erreur est survenue</h1>
      <h4 className="">{error.message}</h4>
      <Link href={"/"} className="btn bg-black text-white! no-underline!">
        Retour à l'accueil
      </Link>
    </div>
  );
}
