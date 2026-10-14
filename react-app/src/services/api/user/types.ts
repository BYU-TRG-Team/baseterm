import { UUID } from "../../../types";
import { Role } from "../../../types/auth";
import { 
  AdminStatusEndpointResponse,
  CreateManagedUserEndpointResponse,
  PasswordResetSubmitEndpointResponse, 
  SignInEndpointEndpointResponse,
  GetUserEndpointResponse, 
  UpdateUserEndpointResponse,
  GetAllUsersEndpointResponse,
  ResetUserPasswordEndpointResponse,
  UpdateManagedUserEndpointResponse,
} from "../../../types/responses";

export interface SignInConfig {
  username: string,
  password: string,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: SignInEndpointEndpointResponse) => void;
  onFinish?: () => void;
}

export interface SignUpConfig {
  username: string,
  password: string,
  email: string,
  name: string,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: () => void;
  onFinish?: () => void;
}

export interface LogoutConfig {
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: () => void;
  onFinish?: () => void;
}

export interface InitiatePasswordRecoveryConfig {
  email: string,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onFinish?: () => void;
}

export interface SubmitPasswordRecoveryConfig {
  password: string,
  token: UUID,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: PasswordResetSubmitEndpointResponse) => void;
  onFinish?: () => void;
}

export interface GetUserConfig {
  uuid: UUID,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: GetUserEndpointResponse) => void;
  onFinish?: () => void;
}

export interface UpdateUserConfig {
  uuid: UUID,
  username?: string,
  email?: string,
  name?: string,
  roleId?: Role,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: UpdateUserEndpointResponse) => void;
  onFinish?: () => void;
}

export interface GetAllUsersConfig {
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: GetAllUsersEndpointResponse) => void;
  onFinish?: () => void;
}

export interface GetAdminStatusConfig {
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: AdminStatusEndpointResponse) => void;
  onFinish?: () => void;
}

export interface DeleteUserConfig {
  uuid: UUID,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: () => void;
  onFinish?: () => void;
}

export interface CreateManagedUserConfig {
  username: string,
  email: string,
  name: string,
  password: string,
  roleId: Role,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: CreateManagedUserEndpointResponse) => void;
  onFinish?: () => void;
}

export interface UpdateManagedUserConfig {
  uuid: UUID,
  username?: string,
  email?: string,
  name?: string,
  verified?: boolean,
  roleId?: Role,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: UpdateManagedUserEndpointResponse) => void;
  onFinish?: () => void;
}

export interface ResetUserPasswordConfig {
  uuid: UUID,
  password: string,
  onInit?: () => void,
  onError: (errorMessage: string) => void;
  onSuccess?: (response: ResetUserPasswordEndpointResponse) => void;
  onFinish?: () => void;
}