import "../styles/Form.css";

import { FieldError, UseFormRegister, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, usePrompt } from "react-router-dom";
import {
  faEdit,
  faEnvelope,
  faKeyboard,
} from "@fortawesome/free-regular-svg-icons";

import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "./FormErrorMessage";
import { StateType } from "./NoTrespassing";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";

const promptMessage =
  "Sicher, dass du die Seite verlassen möchtest? Nein bist du nicht. Geh weg.";

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <form
      onSubmit={handleSubmit(async ({ email, password }) => {
        if (await auth.signin(email, password)) navigate("/");
        else setError("email", { message: "Email oder Passwort ist falsch" });
      })}
    >
      <EmailInputField register={register} emailErrors={errors.email} />
      <label id="password">
        <FontAwesomeIcon className="inputIcon" icon={faKey} />
        <input
          placeholder="Password"
          {...register("password")}
          type="password"
        />
      </label>
      <Link to="/forgotpassword">Passwort vergessen?</Link>
      <Button className="formButton" type="submit" label="Login" />
    </form>
  );
}

type ForgotPasswordFormInputs = {
  email: string;
};

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(({ email }) => navigate("/login"))}>
      <EmailInputField register={register} emailErrors={errors.email} />
      <Button className="formButton" type="submit" label="Weiter" />
    </form>
  );
}

type RegisterForm1Inputs = {
  code: string;
  email: string;
};

export function RegisterForm1() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterForm1Inputs>({ mode: "onChange" });
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <form
      onSubmit={handleSubmit(async ({ code, email }) => {
        if (await auth.verifyRegistrationEligibility(code, email)) {
          navigate("./1", { state: { _register_1: { email } } });
        } else
          setError("code", {
            message: "Einladungscode oder Email sind falsch",
          });
      })}
    >
      <label>
        {errors.code && <FormErrorMessage message={errors.code.message} />}
        <FontAwesomeIcon className="inputIcon" icon={faKeyboard} />
        <input
          placeholder="Code"
          {...register("code", {
            required: "Einladungscode ist notwendig.",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "0-6 chars bla dass wir sehen dass was da ist.",
            },
          })}
        />
      </label>
      <EmailInputField register={register} emailErrors={errors.email} />
      <Button className="formButton" type="submit" label="Registrieren" />
    </form>
  );
}

type RegisterForm2Inputs = {
  firstName: string;
  lastName: string;
};

export function RegisterForm2() {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<RegisterForm2Inputs>({ mode: "onChange" });
  const navigate = useNavigate();
  const location = useLocation().state as StateType;

  usePrompt(promptMessage, isDirty && !isSubmitting);

  return (
    <form
      onSubmit={handleSubmit(({ firstName, lastName }) => {
        navigate("../2", {
          state: {
            _register_2: {
              email: location._register_1.email,
              firstName,
              lastName,
            },
          },
        });
      })}
    >
      <label>
        {errors.firstName && (
          <FormErrorMessage message={errors.firstName.message} />
        )}
        <FontAwesomeIcon className="inputIcon" icon={faEdit} />
        <input
          placeholder="Vorname"
          {...register("firstName", {
            required: "Vorname muss angegeben werden",
          })}
          autoFocus
        />
      </label>
      <label>
        {errors.lastName && (
          <FormErrorMessage message={errors.lastName.message} />
        )}
        <FontAwesomeIcon className="inputIcon" icon={faEdit} />
        <input
          placeholder="Nachname"
          {...register("lastName", {
            required: "Nachname muss angegeben werden",
          })}
        />
      </label>
      <Button className="formButton" type="submit" label="Weiter" />
      {/* <Prompt
        when={Boolean(getValues().firstName || getValues().lastName)}
        message="Sicher, dass du die Seite verlassen möchtest?"
      /> */}
    </form>
  );
}

type RegisterForm3Inputs = {
  password: string;
  passwordRepeated: string;
};

export function RegisterForm3() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<RegisterForm3Inputs>({ mode: "onChange" });
  const navigate = useNavigate();
  const location = useLocation().state as StateType;
  const auth = useAuth();

  usePrompt(promptMessage, isDirty && !isSubmitting);

  return (
    <form
      onSubmit={handleSubmit(async ({ password, passwordRepeated }) => {
        const { firstName, lastName, email } = location._register_2;
        if (
          await auth.register(
            firstName,
            lastName,
            email,
            password,
            passwordRepeated
          )
        )
          navigate("/");
        else
          setError("password", {
            message: "Der Nutzer konnte nicht erstellt werden",
          });
      })}
    >
      <label>
        {errors.password && (
          <FormErrorMessage message={errors.password.message} />
        )}
        <FontAwesomeIcon className="inputIcon" icon={faKey} />
        <input
          placeholder="Passwort"
          {...register("password", {
            required: "Passwort muss angegeben werden ",
            pattern: {
              value: /\w{8}/,
              message:
                "Passwort muss aus mindestens acht Zeichen bestehen; inklusive Sonderzeichen",
            },
          })}
          type="password"
          autoFocus
        />
      </label>
      <label>
        {errors.passwordRepeated && (
          <FormErrorMessage message={errors.passwordRepeated.message} />
        )}
        <FontAwesomeIcon className="inputIcon" icon={faKey} />
        <input
          placeholder="Passwort bestätigen"
          {...register("passwordRepeated", {
            required: "Passwort muss angegeben werden",
          })}
          type="password"
        />
      </label>
      <Button className="formButton" type="submit" label="Weiter" />
      {/* <Prompt
        when={Boolean(getValues().password || getValues().passwordRepeated)}
        message="Sicher, dass du die Seite verlassen möchtest?"
      /> */}
    </form>
  );
}

function EmailInputField({
  register,
  emailErrors,
}: {
  register: UseFormRegister<any>;
  emailErrors: FieldError | undefined;
}) {
  return (
    <label>
      {emailErrors && <FormErrorMessage message={emailErrors.message} />}
      <FontAwesomeIcon className="inputIcon" icon={faEnvelope} />
      <input
        placeholder="Email"
        {...register("email", {
          required: "Email muss angegeben werden",
          pattern: {
            value: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: "gültige Email mit @ und so.",
          },
        })}
      />
    </label>
  );
}
