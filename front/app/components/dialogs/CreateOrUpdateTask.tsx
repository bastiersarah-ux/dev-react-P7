"use client";

import StatusBadge from "../tasks/StatusBadge";
import {
  Project,
  Task,
  TaskAssignee,
  TaskInput,
  TaskStatus,
} from "@front/types/api-types";
import { SubmitEvent, useEffect, useState } from "react";
import { User } from "@front/types/api-types";
import UserSelector from "../users/UserSelector";
import { addTask, updateTaskById } from "@front/services/taskService";

type CreateOrUpdateTaskProp = {
  taskToEdit?: Task;
  idProject: string;
};

export default function CreateOrUpdateTask({
  taskToEdit,
  idProject,
}: CreateOrUpdateTaskProp) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [DashboardProject, setDashboardPrject] = useState<Project[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const myModal = () => document.getElementById(id) as HTMLDialogElement;

  const showModal = () => {
    myModal()?.showModal();
  };

  const dismissModal = () => {
    myModal()?.close();
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

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const assignees = selectedUsers.map((user) => user?.id);

      const input: TaskInput = {
        description,
        dueDate: new Date(dueDate).toISOString(),
        title: title,
        assigneeIds: assignees,
      };

      const res: Task | null = !taskToEdit
        ? await addTask(idProject, input)
        : await updateTaskById(idProject, taskToEdit!.id, input);

      if (!res) {
        console.error("Erreur lors de l'enregistrement de la tache");
        return;
      } else {
        location.reload();
      }
      dismissModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la tache:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusList: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

  const isEditMode = !!taskToEdit;

  const id = taskToEdit
    ? `task-modal-${taskToEdit.id}`
    : `task-modal-${idProject}-new`;

  return (
    <>
      <button className="btn bg-black  h-12.5 text-white " onClick={showModal}>
        Créer une tâche
      </button>

      <dialog id={id} className="modal">
        <div className="modal-box w-11/12 max-w-lg relative">
          {isSubmitting && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-500/50">
              <span
                className="loading loading-spinner loading-lg text-white"
                aria-label="Enregistrement en cours"
              />
            </div>
          )}
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
                  required
                  onChange={(e) => setTitle(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Description*</legend>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset relative">
                <legend className="fieldset-legend">Échéance*</legend>
                <input
                  type="date"
                  className="input input-bordered w-full pr-10"
                  value={dueDate}
                  required
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
                <button type="submit" className="btn btn-primary btn-outline">
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
