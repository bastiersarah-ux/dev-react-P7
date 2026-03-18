"use client";

import StatusBadge from "./StatusBadge";
import {
  Project,
  Task,
  TaskAssignee,
  TaskStatus,
} from "@front/types/api-types";
import { SubmitEvent, useEffect, useState } from "react";
import { User } from "@front/types/api-types";
import UserSelector from "../users/UserSelector";

type CreateOrUpdateTaskProp = {
  taskToEdit?: Task;
};

export default function CreateOrUpdateTask({
  taskToEdit,
}: CreateOrUpdateTaskProp) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [DashboardProject, setDashboardPrject] = useState<Project[]>([]);

  const myModal = () => document.querySelector<HTMLDialogElement>("#my_modal");

  const showModal = () => {
    myModal()?.showModal();
  };

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setDueDate(
        taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().slice(0, 10)
          : "",
      );
      setStatus(taskToEdit.status);
      setSelectedUsers(
        taskToEdit.assignees
          ?.map((assignee) => assignee.user!)
          .filter(Boolean) || [],
      );
    }
  }, [taskToEdit]);

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const assignees: Partial<TaskAssignee>[] = selectedUsers.map((user) => ({
      userId: user.id,
    }));

    if (taskToEdit) {
      console.log("Enregistrer la tâche modifiée :", {
        title,
        description,
        dueDate,
        status,
        assignees,
      });
    } else {
      console.log("Créer une tâche :", {
        title,
        description,
        dueDate,
        status,
        assignees,
      });
    }
  };

  const statusList: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

  const isEditMode = !!taskToEdit;

  return (
    <>
      <button className="btn text-[16px]" onClick={showModal}>
        Créer une tâche
      </button>

      <dialog id="my_modal" className="modal">
        <div className="modal-box w-11/12 max-w-lg relative">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>

          <h3 className="font-bold text-lg mb-4">
            {isEditMode ? "Modifier une tâche" : "Créer une tâche"}
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

              <fieldset className="fieldset relative">
                <legend className="fieldset-legend">Échéance*</legend>
                <input
                  type="date"
                  className="input input-bordered w-full pr-10"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </fieldset>

              <UserSelector
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
              />

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Statut</legend>
                <div className="filter">
                  <input
                    className="btn btn-ghost text-[17px] btn-badge"
                    type="reset"
                    value="×"
                    onClick={() => setStatus(null)}
                  />
                  {statusList.map((s) => (
                    <StatusBadge
                      key={s}
                      status={s}
                      formMode
                      onSelect={(value) => setStatus(value)}
                      isChecked={status === s}
                    />
                  ))}
                </div>
              </fieldset>
              <div className="modal-action">
                <button type="submit" className="btn btn-primary">
                  {taskToEdit ? "Enregistrer" : "+ Ajouter une tâche"}
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
