/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateUser
// ====================================================

export interface CreateUser_createOneUser {
  __typename: "User";
  id: string;
  name: string | null;
}

export interface CreateUser {
  createOneUser: CreateUser_createOneUser;
}

export interface CreateUserVariables {
  name: string;
  userName: string;
  password: string;
}
