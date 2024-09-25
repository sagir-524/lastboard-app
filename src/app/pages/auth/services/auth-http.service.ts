import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { RegistrationRequestBody } from "../types/registration-request-body.type";
import { TokenResponse } from "../types/token-response.type";

@Injectable()
export class AuthHttpService {
  readonly #http = inject(HttpClient);

  register(data: RegistrationRequestBody) {
    return this.#http.post("auth/register", data);
  }

  resendVerificationMail(email: string) {
    return this.#http.post("auth/resend-verification-email", { email });
  }

  verifyEmail(token: string) {
    return this.#http.post("auth/verify", { token });
  }

  login(email: string, password: string) {
    return this.#http.post<TokenResponse>("auth/login", { email, password });
  }
}
