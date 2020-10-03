/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { EnableStatus } from "./../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateOneUser {
  __typename: "User";
  id: string;
  name: string | null;
  enableStatus: EnableStatus;
}

export interface UpdateUser {
  updateOneUser: UpdateUser_updateOneUser | null;
}

export interface UpdateUserVariables {
  enableStatus: EnableStatus;
  id: string;
}
