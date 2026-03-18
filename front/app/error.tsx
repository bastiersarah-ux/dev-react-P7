"use client";

import Link from "next/link";

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error }: ErrorProps) {
  return (
    <div className="w-full h-full flex-1 flex items-center justify-center">
      <span className="">Une erreur est survenue : {error.message}</span>
      <Link href={"/"} className="btn btn-primary">
        Retour à l'accueil
      </Link>
    </div>
  );
}
