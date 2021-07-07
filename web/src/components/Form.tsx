import "../styles/Form.css";

import {
  FieldError,
  Path,
  UseFormClearErrors,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import {
  InputAdornment,
  TextField,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { Link, Prompt, useLocation, useNavigate } from "react-router-dom";
import {
  faEdit,
  faEnvelope,
  faKeyboard,
  faUser,
} from "@fortawesome/free-regular-svg-icons";

import { AnimatePresence } from "framer-motion";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormErrorMessage from "./FormErrorMessage";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const useButtonStyles = makeStyles({
  button: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2em",
    padding: "0.5em 10%",
  },
});

const useInputStyles = makeStyles({
  input: {
    margin: "0.5em",
    width: "30vw",
    minWidth: "200px",
    maxWidth: "350px",
    fontSize: "1em",
    fontFamily: "inherit",
    "& .MuiInput-underline:hover:not(.Mui-disabled)::before": {
      borderColor: "var(--border)",
      borderWidth: "1.5px",
    },
    "& .MuiInput-underline:after": {
      transitionDuration: "300ms",
    },
  },
});

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const formButton = useButtonStyles();
  const formInput = useInputStyles();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const auth = useAuth();
  const theme = useTheme();

  useEffect(() => {
    if (errors.password) {
      const timer = setTimeout(() => clearErrors("password"), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.password, clearErrors]);

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => {
        auth.signin(email, password);
        navigate("/");
      })}
    >
      <EmailInputField
        register={register}
        emailErrors={errors.email}
        clearErrors={clearErrors}
      />
      <TextField
        placeholder="Password"
        type="password"
        className={formInput.input}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon className="inputIcon" icon={faKey} />
            </InputAdornment>
          ),
          ...register("password"),
        }}
      />
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
  const formButton = useButtonStyles();
  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>();
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <form onSubmit={handleSubmit(({ email }) => navigate("/login"))}>
      <EmailInputField
        register={register}
        emailErrors={errors.email}
        clearErrors={clearErrors}
      />
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

export type RegisterForm1Inputs = {
  code: number;
};

export function RegisterForm1() {
  const formButton = useButtonStyles();
  const formInput = useInputStyles();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterForm1Inputs>({ mode: "onChange" });
  const navigate = useNavigate();
  const theme = useTheme();
  const { validateInviteCode } = useAuth();

  useEffect(() => {
    if (errors.code) {
      const timer = setTimeout(() => clearErrors("code"), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.code, clearErrors]);

  return (
    <form
      onSubmit={handleSubmit(({ code }) => {
        if (validateInviteCode(code))
          navigate("./1", { state: { registerState: { code } } });
        setError("code", { message: "Code falsch" });
      })}
    >
      <label>
        <AnimatePresence>
          {errors.code && (
            <FormErrorMessage name="code" message={errors.code.message} />
          )}
        </AnimatePresence>
        <TextField
          placeholder="Code"
          className={formInput.input}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon className="inputIcon" icon={faKeyboard} />
              </InputAdornment>
            ),
            ...register("code", {
              required: "Einladungscode ist notwendig.",
              pattern: {
                value: /^[0-9]{6}$/,
                message: "0-6 chars bla dass wir sehen dass was da ist.",
              },
            }),
          }}
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

export type RegisterForm2Inputs = {
  firstName: string;
  lastName: string;
  email: string;
};

export function RegisterForm2() {
  const formButton = useButtonStyles();
  const formInput = useInputStyles();
  const {
    register,
    handleSubmit,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterForm2Inputs>({ mode: "onChange" });
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const {
    registerState: { code },
  } = location.state as { registerState: { code: number } };

  useEffect(() => {
    if (errors.firstName) {
      const timer = setTimeout(() => clearErrors("firstName"), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.firstName, clearErrors]);

  useEffect(() => {
    if (errors.lastName) {
      const timer = setTimeout(() => clearErrors("lastName"), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.lastName, clearErrors]);

  return (
    <form
      onSubmit={handleSubmit(({ firstName, lastName, email }) =>
        navigate("../2", {
          state: {
            registerState: { code, firstName, lastName, email },
          },
        })
      )}
    >
      <label>
        <AnimatePresence>
          {errors.firstName && (
            <FormErrorMessage
              name="firstName"
              message={errors.firstName.message}
            />
          )}
        </AnimatePresence>
        <TextField
          placeholder="Vorname"
          className={formInput.input}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon className="inputIcon" icon={faEdit} />
              </InputAdornment>
            ),
            ...register("firstName", {
              required: "Vorname muss angegeben werden",
            }),
          }}
          autoFocus
        />
      </label>
      <label>
        <AnimatePresence>
          {errors.lastName && (
            <FormErrorMessage
              name="lastName"
              message={errors.lastName.message}
            />
          )}
        </AnimatePresence>
        <TextField
          placeholder="Nachname"
          className={formInput.input}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon className="inputIcon" icon={faUser} />
              </InputAdornment>
            ),
            ...register("lastName", {
              required: "Nachname muss angegeben werden",
            }),
          }}
        />
      </label>
      <EmailInputField
        register={register}
        emailErrors={errors.email}
        clearErrors={clearErrors}
      />
      <Button
        textColor="white"
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
  const formButton = useButtonStyles();
  const formInput = useInputStyles();
  const {
    register,
    handleSubmit,
    setError,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterForm3Inputs>({ mode: "onChange" });
  const navigate = useNavigate();
  const theme = useTheme();
  const auth = useAuth();
  const location = useLocation();
  const { registerState } = location.state as {
    registerState: {
      code: number;
      firstName: string;
      lastName: string;
      email: string;
    };
  };

  useEffect(() => {
    if (errors.password) {
      const timer = setTimeout(() => clearErrors("password"), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.password, clearErrors]);

  useEffect(() => {
    if (errors.passwordRepeated) {
      const timer = setTimeout(() => clearErrors("passwordRepeated"), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors.passwordRepeated, clearErrors]);

  return (
    <form
      onSubmit={handleSubmit(({ password, passwordRepeated }) => {
        if (password === passwordRepeated) {
          auth.register(
            registerState.code,
            registerState.firstName,
            registerState.lastName,
            registerState.email,
            password,
            passwordRepeated
          );
          navigate("/");
        } else
          setError("password", {
            message: "Passwörter stimmen nicht überein",
          });
      })}
    >
      <label>
        <AnimatePresence>
          {errors.password && (
            <FormErrorMessage
              name="password"
              message={errors.password.message}
            />
          )}
        </AnimatePresence>
        <TextField
          placeholder="Passwort"
          type="password"
          className={formInput.input}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon className="inputIcon" icon={faKey} />
              </InputAdornment>
            ),
            ...register("password", {
              required: "Passwort muss angegeben werden ",
              pattern: {
                value: /\w{8}/,
                message:
                  "Passwort muss aus mindestens acht Zeichen bestehen; inklusive Sonderzeichen",
              },
            }),
          }}
          autoFocus
        />
      </label>
      <label>
        <AnimatePresence>
          {errors.passwordRepeated && (
            <FormErrorMessage
              name="passwordRepeated"
              message={errors.passwordRepeated.message}
            />
          )}
        </AnimatePresence>
        <TextField
          placeholder="Passwort bestätigen"
          type="password"
          className={formInput.input}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon className="inputIcon" icon={faKey} />
              </InputAdornment>
            ),
            ...register("passwordRepeated", {
              required: "Passwort muss angegeben werden",
            }),
          }}
        />
      </label>
      <Button
        textColor="white"
        type="submit"
        label="Weiter"
        buttonStyle={formButton}
        backgroundColor={theme.palette.primary.main}
      />
      <Prompt
        when={Boolean(getValues().password || getValues().passwordRepeated)}
        message="Sicher, dass du die Seite verlassen möchtest?"
      />
    </form>
  );
}

export function EmailInputField<T>({
  register,
  emailErrors,
  clearErrors,
}: {
  register: UseFormRegister<any>;
  emailErrors: FieldError | undefined;
  clearErrors: UseFormClearErrors<T>;
}) {
  const formInput = useInputStyles();

  useEffect(() => {
    if (emailErrors) {
      const timer = setTimeout(() => clearErrors("email" as Path<T>), 5000);
      return () => clearTimeout(timer);
    }
  }, [emailErrors, clearErrors]);

  return (
    <>
      <label>
        <AnimatePresence>
          {emailErrors && (
            <FormErrorMessage name="email" message={emailErrors.message} />
          )}
        </AnimatePresence>
        <TextField
          placeholder="Email"
          className={formInput.input}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon className="inputIcon" icon={faEnvelope} />
              </InputAdornment>
            ),
            ...register("email", {
              required: "Email muss angegeben werden",
              pattern: {
                value: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                message: "gültige Email mit @ und so.",
              },
            }),
          }}
        />
      </label>
    </>
  );
}
