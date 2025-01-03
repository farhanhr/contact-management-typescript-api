export type CreateUserRequest = {
    username: string;
    name: string;
    password: string;
}

export type UserResponse = {
    username: string;
    name: string;
    token?: string;
}
