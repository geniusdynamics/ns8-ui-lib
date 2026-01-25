/*
 * Copyright (C) 2023 Nethesis S.r.l.
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import axios from "axios";
import { CircleX, CheckCircle, AlertTriangle, Info } from "lucide-vue-next";
import { useStorageService } from "./useStorageService";

export const useTaskService = () => {
  const { getFromStorage } = useStorageService();

  const getTaskContext = (taskPath: string, apiUrl: string) => {
    const token = getFromStorage<{ token: string }>("loginInfo")?.token || "";
    return axios.get(`${apiUrl}/${taskPath}/context`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const getTaskStatus = (taskPath: string, apiUrl: string) => {
    const token = getFromStorage<{ token: string }>("loginInfo")?.token || "";
    return axios.get(`${apiUrl}/${taskPath}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const getClusterTasks = (apiUrl: string) => {
    const token = getFromStorage<{ token: string }>("loginInfo")?.token || "";
    return axios.get(`${apiUrl}/cluster/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const createClusterTask = (taskData: any, apiUrl: string) => {
    const token = getFromStorage<{ token: string }>("loginInfo")?.token || "";
    return axios.post(`${apiUrl}/cluster/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const createClusterTaskForApp = (taskData: any) => {
    const token = getFromStorage<{ token: string }>("loginInfo")?.token || "";
    const apiUrl = (window as any).parent?.core?.$root?.apiUrl;
    return axios.post(`${apiUrl}/cluster/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const createModuleTaskForApp = (moduleId: string, taskData: any) => {
    const token = getFromStorage<{ token: string }>("loginInfo")?.token || "";
    const apiUrl = (window as any).parent?.core?.$root?.apiUrl;
    return axios.post(`${apiUrl}/module/${moduleId}/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const createNodeTask = (nodeId: string, taskData: any, apiUrl: string) => {
    const token = getFromStorage<{ token: string }>("loginInfo")?.token || "";
    return axios.post(`${apiUrl}/node/${nodeId}/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const createNodeTaskForApp = (nodeId: string, taskData: any) => {
    const token = getFromStorage<{ token: string }>("loginInfo")?.token || "";
    const apiUrl = (window as any).parent?.core?.$root?.apiUrl;
    return axios.post(`${apiUrl}/node/${nodeId}/tasks`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const getTaskTitle = (task: any): string => {
    if (
      task &&
      task.context &&
      task.context.extra &&
      task.context.extra.title
    ) {
      return task.context.extra.title;
    } else {
      return "";
    }
  };

  const getTaskKind = (task: any): "error" | "success" | "warning" | "info" => {
    switch (task.status) {
      case "aborted":
      case "validation-failed":
        return "error";
      case "completed":
        return "success";
      case "pending":
        return "warning";
      default:
        return "info";
    }
  };

  const getTaskIcon = (task: any) => {
    switch (task.status) {
      case "aborted":
      case "validation-failed":
        return CircleX;
      case "completed":
        return CheckCircle;
      case "pending":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getTaskStatusDescription = (
    task: any,
    t: (key: string, args?: any) => string,
    rootTask: boolean = true
  ): string => {
    const agent = task.context?.queue
      ? task.context.queue.split("/tasks")[0]
      : "cluster";
    const taskLabel = `${agent}/${task.context?.action}`;
    const taskOrSubtask = rootTask ? "task" : "subtask";

    switch (task.status) {
      case "aborted":
        return t(`task.${taskOrSubtask}_failed`, { task: taskLabel });
      case "validation-failed":
        return t(`task.${taskOrSubtask}_failed_validation`, { task: taskLabel });
      case "completed":
        return t(`task.${taskOrSubtask}_completed`, { task: taskLabel });
      case "pending":
        return t(`task.${taskOrSubtask}_pending`, { task: taskLabel });
      case "running":
        return t(`task.${taskOrSubtask}_running`, { task: taskLabel });
      default:
        return "";
    }
  };

  const createErrorNotification = (err: any, message: string, emit: (event: string, ...args: any[]) => void) => {
    console.error(err);
    emit("createErrorNotification", err, message);
  };

  const createErrorNotificationForApp = (err: any, message: string) => {
    console.error(err);
    const core = (window as any).parent?.core;
    if (core?.$root) {
      core.$root.$emit("createErrorNotification", err, message);
    }
  };

  const createNotificationForApp = (notification: any) => {
    const core = (window as any).parent?.core;
    if (core?.$root) {
      core.$root.$emit("createNotificationForApp", notification);
    }
  };

  const deleteNotificationForApp = (notification: any) => {
    const core = (window as any).parent?.core;
    if (core?.$root) {
      core.$root.$emit("deleteNotificationForApp", notification);
    }
  };

  return {
    getTaskContext,
    getTaskStatus,
    getClusterTasks,
    createClusterTask,
    createClusterTaskForApp,
    createModuleTaskForApp,
    createNodeTask,
    createNodeTaskForApp,
    getTaskTitle,
    getTaskKind,
    getTaskIcon,
    getTaskStatusDescription,
    createErrorNotification,
    createErrorNotificationForApp,
    createNotificationForApp,
    deleteNotificationForApp,
  };
};
