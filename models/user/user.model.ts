import { Deserializable } from "./deserializable.model";

export class User implements Deserializable {
  id: string;
  auth_type: "landlord" | "tenant" | "admin";
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  token: string;

  constructor(
    id: string,
    auth_type: "landlord" | "tenant" | "admin",
    username: string,
    firstname: string,
    lastname,
    password: string,
    token: string
  ) {
    this.id = id;
    this.auth_type = auth_type;
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    this.token = token;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }

  getName(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  getUsername(): string {
    return `${this.username}`;
  }
}
