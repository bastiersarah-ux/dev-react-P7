"use client";

import { SubmitEvent, useEffect, useState } from "react";
import { Project, User } from "@front/types/api-types";
import UserSelector from "../users/UserSelector";

type CreateOrUpdateProjectProp = {
  projectToEdit?: Project | null;
};

export default function CreateOrUpdateProject({
  projectToEdit,
}: CreateOrUpdateProjectProp) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const myModal = () => document.querySelector<HTMLDialogElement>("#my_modal");

  const showModal = () => {
    myModal()?.showModal();
  };

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.name);
      setDescription(projectToEdit.description || "");
    }
  }, [projectToEdit]);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.name);
      setDescription(projectToEdit.description || "");
      setSelectedUsers(
        projectToEdit.members?.map((member) => member.user!).filter(Boolean) ||
          [],
      );
    }
  }, [projectToEdit]);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (projectToEdit) {
      console.log("Enregistrer le projet modifié", {
        title,
        description,
      });
    } else {
      console.log("Créer un projet", {
        title,
        description,
      });
    }
  };

  const isEditMode = !!projectToEdit;

  return (
    <>
      <button
        className={`btn ${isEditMode && "btn-link text-primary"} `}
        onClick={showModal}
      >
        {isEditMode ? "Modifier" : "+ Créer un projet"}
      </button>

      <dialog id="my_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg mb-4">
            {isEditMode ? "Modifier un projet" : "Créer un projet"}
          </h3>

          <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
            <div className="form-control w-full">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Titre*</legend>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Description*</legend>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </fieldset>

              <UserSelector
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
              />

              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  {projectToEdit ? "Enregistrer" : "+ Ajouter un projet"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
