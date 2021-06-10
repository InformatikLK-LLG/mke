import "../styles/Form.css";

import { FieldError, UseFormRegister, useForm } from "react-hook-form";
import { Link, Prompt, useNavigate } from "react-router-dom";
import {
  faEdit,
  faEnvelope,
  faKeyboard,
} from "@fortawesome/free-regular-svg-icons";
import { makeStyles, useTheme } from "@material-ui/core";

import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "./FormErrorMessage";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";

const useStyles = makeStyles({
  button: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2em",
    padding: "0.5em 10%",
  },
});

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const formButton = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const auth = useAuth();
  const theme = useTheme();

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => {
        auth.signin(email, password);
        navigate("/");
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
      <Button
        type="submit"
        label="Login"
        buttonStyle={formButton}
        textColor="white"
        backgroundColor={theme.palette.primary.main}
      />
    </form>
  );
}

type ForgotPasswordFormInputs = {
  email: string;
};

export function ForgotPasswordForm() {
  const formButton = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <form onSubmit={handleSubmit(({ email }) => navigate("/login"))}>
      <EmailInputField register={register} emailErrors={errors.email} />
      <Button
        type="submit"
        label="Weiter"
        buttonStyle={formButton}
        textColor="white"
        backgroundColor={theme.palette.primary.main}
      />
    </form>
  );
}

type RegisterForm1Inputs = {
  code: string;
};

export function RegisterForm1() {
  const formButton = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm1Inputs>({ mode: "onChange" });
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <form
      onSubmit={handleSubmit(({ code }) =>
        navigate("./1", { state: { _register_1: true } })
      )}
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
      <Button
        textColor="white"
        backgroundColor={theme.palette.primary.main}
        type="submit"
        label="Registrieren"
        buttonStyle={formButton}
      />
    </form>
  );
}

type RegisterForm2Inputs = {
  firstName: string;
  lastName: string;
  email: string;
};

export function RegisterForm2() {
  const formButton = useStyles();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm2Inputs>({ mode: "onChange" });
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <form
      onSubmit={handleSubmit(({ firstName, lastName, email }) =>
        navigate("../2", { state: { _register_2: true } })
      )}
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
      <EmailInputField register={register} emailErrors={errors.email} />
      <Button
        textColor={theme.palette.primary.main}
        backgroundColor={theme.palette.primary.main}
        type="submit"
        label="Weiter"
        buttonStyle={formButton}
      />
      <Prompt
        when={Boolean(
          getValues().firstName || getValues().lastName || getValues().email
        )}
        message="Sicher, dass du die Seite verlassen möchtest?"
      />
    </form>
  );
}

type RegisterForm3Inputs = {
  password: string;
  passwordRepeated: string;
};

export function RegisterForm3() {
  const formButton = useStyles();
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<RegisterForm3Inputs>({ mode: "onChange" });
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <form
      onSubmit={handleSubmit(({ password, passwordRepeated }) =>
        password === passwordRepeated
          ? navigate("/")
          : setError("password", {
              message: "Passwörter stimmen nicht überein",
            })
      )}
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
      <Button
        textColor={theme.palette.primary.main}
        type="submit"
        label="Weiter"
        buttonStyle={formButton}
      />
      <Prompt
        when={Boolean(getValues().password || getValues().passwordRepeated)}
        message="Sicher, dass du die Seite verlassen möchtest?"
      />
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
