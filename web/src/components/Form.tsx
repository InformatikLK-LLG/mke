import "../styles/Form.css";

import {
  FieldError,
  Path,
  UseFormClearErrors,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { FormState, RenderInput, useInputStyles } from "../pages/Institution";
import {
  Grid,
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
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const auth = useAuth();
  const theme = useTheme();
  const formState: FormState<LoginFormInputs> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
    setValue,
  };

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
      style={{ width: "40%" }}
    >
      <Grid container spacing={2} xs={10} alignItems="center" justify="center">
        <Grid item xs={12}>
          <EmailInputField
            register={register}
            emailErrors={errors.email}
            clearErrors={clearErrors}
          />
        </Grid>
        <Grid item xs={12}>
          {RenderInput({
            name: "password",
            type: "password",
            placeholder: "Passwort",
            required: "Passwort muss angegeben werden",
            icon: faKey,
            formState,
          })}
        </Grid>
      </Grid>
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
      <Grid container>
        <Grid item xs={12}>
          <EmailInputField
            register={register}
            emailErrors={errors.email}
            clearErrors={clearErrors}
          />
        </Grid>
      </Grid>
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
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterForm1Inputs>({ mode: "onChange" });
  const formState: FormState<RegisterForm1Inputs> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
    setValue,
  };
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
      style={{ width: "40%" }}
    >
      <Grid container>
        <Grid item xs={12}>
          {RenderInput({
            name: "code",
            placeholder: "Code",
            required: "Code muss angegeben werden",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "0-6 chars bla dass wir sehen dass was da ist.",
            },
            icon: faKeyboard,
            formState,
            autofocus: true,
          })}
        </Grid>
      </Grid>
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
    setValue,
    control,
    formState: { errors },
  } = useForm<RegisterForm2Inputs>({ mode: "onChange" });
  const formState: FormState<RegisterForm2Inputs> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
    setValue,
  };
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
      <Grid container>
        <Grid item>
          {RenderInput({
            name: "firstName",
            placeholder: "Vorname",
            required: "Vorname muss angegeben werden",
            icon: faEdit,
            formState,
            autofocus: true,
          })}
        </Grid>
        <Grid item>
          {RenderInput({
            name: "lastName",
            placeholder: "Nachname",
            required: "Nachname muss angegeben werden",
            icon: faKeyboard,
            formState,
          })}
        </Grid>
        <Grid item>
          <EmailInputField
            register={register}
            emailErrors={errors.email}
            clearErrors={clearErrors}
          />
        </Grid>
      </Grid>
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
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterForm3Inputs>({ mode: "onChange" });
  const formState: FormState<RegisterForm3Inputs> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
    setValue,
  };
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
      <Grid container>
        <Grid item>
          {RenderInput({
            name: "password",
            type: "password",
            placeholder: "Passwort",
            required: "Passwort muss angegeben werden ",
            pattern: {
              value: /\w{8}/,
              message:
                "Passwort muss aus mindestens acht Zeichen bestehen; inklusive Sonderzeichen",
            },
            icon: faKey,
            formState,
            autofocus: true,
          })}
        </Grid>
        <Grid item>
          {RenderInput({
            name: "passwordRepeated",
            type: "password",
            placeholder: "Passwort bestätigen",
            required: "Passwort muss angegeben werden",
            icon: faKey,
            formState,
          })}
        </Grid>
      </Grid>
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
    </>
  );
}
