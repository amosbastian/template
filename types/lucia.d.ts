// lucia.d.ts
/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Authentication = import("../libs/authentication/src/lib/authentication.ts").Authentication;
  type UserAttributes = {
    email: string;
  };
}
