/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TaskStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateTaskStatus
// ====================================================

export interface UpdateTaskStatus_updateOneTask {
  __typename: "Task";
  id: string;
  name: string;
  status: TaskStatus;
  countTime: number;
}

export interface UpdateTaskStatus {
  updateOneTask: UpdateTaskStatus_updateOneTask | null;
}

export interface UpdateTaskStatusVariables {
  id: string;
  status: TaskStatus;
  countTime: number;
}
