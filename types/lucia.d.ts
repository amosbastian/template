// lucia.d.ts
/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Auth = import("../libs/auth/src/lib/auth.ts").Auth;
  type UserAttributes = {};
}
