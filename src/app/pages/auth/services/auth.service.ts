import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RegistrationRequestBody } from "../types/registration-request-body.type";

@Injectable()
export class AuthHttpService {
  readonly #http = inject(HttpClient);

  constructor() {
    console.log("AuthHttpService initialized");
  }

  register(data: RegistrationRequestBody) {
    return this.#http.post("auth/register", data);
  }

  resendVerificationMail(email: string) {
    return this.#http.post("auth/resend-verification-email", { email });
  }
}
