"use client";

import { Task } from "@front/types/api-types";
import Image from "next/image";
import StarIcon from "@front/public/star.svg";
import OrangeStarIcon from "@front/public/orange-star.svg";
import { useState } from "react";

type ListAiTaskProp = {
  tasks?: Task[];
};

export default function ListAiTask({ tasks }: ListAiTaskProp) {
  const [prompt, setPrompt] = useState("");

  const myModal = () =>
    document.querySelector<HTMLDialogElement>("#ai_task_modal");

  const showModal = () => {
    myModal()?.showModal();
  };

  const handleGenerate = () => {
    console.log("Prompt IA:", prompt);
  };

  return (
    <>
      <button className="btn btn-primary text-[16px]" onClick={showModal}>
        <Image src={StarIcon} alt="AI" width={21} height={21} />
        IA
      </button>

      <dialog id="ai_task_modal" className="modal">
        <div className="modal-box w-11/12 max-w-xl relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">
              ✕
            </button>
          </form>

          <div className="flex items-center gap-2 mb-6">
            <Image src={OrangeStarIcon} alt="AI" width={21} height={21} />
            <h3 className="font-bold text-lg">Créer une tâche</h3>
          </div>

          <div className="bg-base-200 rounded-full flex items-center px-4 py-2">
            <input
              type="text"
              placeholder="Décrivez les tâches que vous souhaitez ajouter..."
              className="flex-1 bg-transparent outline-none text-sm"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button
              onClick={handleGenerate}
              className="ml-2 btn btn-circle btn-sm btn-primary"
            >
              <Image src={StarIcon} alt="AI" width={8.4} height={8.4} />
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
