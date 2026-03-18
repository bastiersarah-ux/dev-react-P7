"use client";

import { Task } from "@front/types/api-types";
import Image from "next/image";
import StarIcon from "@front/public/star.svg";
import { useState } from "react";
import OrangeStarIcon from "@front/public/orange-star.svg";

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
            <h3 className="font-bold text-lg">Vos tâches...</h3>
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {(tasks ?? []).map((task) => (
              <div
                key={task.id}
                className="border rounded-xl p-4 bg-base-100 shadow-sm"
              >
                <h4 className="font-semibold">{task.title}</h4>
                <p className="text-sm opacity-70">{task.description}</p>

                <div className="flex gap-4 mt-3 text-sm opacity-70">
                  <button className="hover:text-error">Supprimer</button>
                  <button className="hover:text-primary">Modifier</button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-6">
            <button className="btn btn-neutral">+ Ajouter les tâches</button>
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
