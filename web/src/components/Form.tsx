import "../styles/Form.css";

import {
  FieldError,
  Path,
  UseFormClearErrors,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { FormEventHandler, Fragment, useEffect } from "react";
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
import { classicNameResolver } from "typescript";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth";
import useViewport from "../hooks/useViewport";

const useButtonStyles = makeStyles({
  button: {
    display: "flex",
    justifyContent: "center",
  },
});

const useFormStyles = makeStyles({
  form: {
    width: "40%",
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
  } = useForm<LoginFormInputs>({ mode: "onChange" });
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
  const classes = useFormStyles();

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => {
        auth.signin(email, password);
        navigate("/");
      })}
      className={classes.form}
    >
      <Grid
        container
        item
        spacing={2}
        xs={10}
        alignItems="center"
        justify="center"
      >
        <Grid item xs={12}>
          <EmailInputField formState={formState} />
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
  const formInput = useInputStyles();
  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({ mode: "onChange" });
  const formState: FormState<ForgotPasswordFormInputs> = {
    clearErrors,
    control,
    errors,
    formInput,
    getValues,
    setValue,
  };
  const navigate = useNavigate();
  const theme = useTheme();
  const classes = useFormStyles();

  return (
    <form
      onSubmit={handleSubmit(({ email }) => navigate("/login"))}
      className={classes.form}
    >
      <Grid
        container
        item
        spacing={2}
        xs={10}
        alignItems="center"
        justify="center"
      >
        <Grid item xs={12}>
          <EmailInputField formState={formState} />
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
  const { validateInviteCode } = useAuth();
  const theme = useTheme();
  const classes = useFormStyles();

  return (
    <form
      onSubmit={handleSubmit(({ code }) => {
        if (validateInviteCode(code))
          navigate("./1", { state: { registerState: { code } } });
        setError("code", { message: "Code falsch" });
      })}
      className={classes.form}
    >
      <Grid
        container
        item
        spacing={2}
        xs={12}
        alignItems="center"
        justify="center"
      >
        <Grid item xs={12}>
          {RenderInput({
            name: "code",
            placeholder: "Code",
            autoComplete: "one-time-code",
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
  const location = useLocation();
  const {
    registerState: { code },
  } = location.state as { registerState: { code: number } };
  const theme = useTheme();
  const classes = useFormStyles();

  return (
    <form
      onSubmit={handleSubmit(({ firstName, lastName, email }) =>
        navigate("../2", {
          state: {
            registerState: { code, firstName, lastName, email },
          },
        })
      )}
      className={classes.form}
    >
      <Grid
        container
        item
        spacing={2}
        xs={12}
        alignItems="center"
        justify="center"
      >
        <Grid item>
          {RenderInput({
            name: "firstName",
            placeholder: "Vorname",
            autoComplete: "given-name",
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
            autoComplete: "family-name",
            required: "Nachname muss angegeben werden",
            icon: faKeyboard,
            formState,
          })}
        </Grid>
        <Grid item>
          <EmailInputField formState={formState} />
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
  const theme = useTheme();
  const classes = useFormStyles();

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
      className={classes.form}
    >
      <Grid
        container
        item
        spacing={2}
        xs={12}
        alignItems="center"
        justify="center"
      >
        <Grid item>
          {RenderInput({
            name: "password",
            type: "password",
            placeholder: "Passwort",
            autoComplete: "new-password",
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
            autoComplete: "new-password",
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

export function EmailInputField<T extends { email: string }>({
  formState,
}: {
  formState: FormState<T>;
}) {
  return RenderInput({
    name: "email" as Path<T>,
    placeholder: "Email",
    autoComplete: "email",
    required: "Email muss angegeben werden",
    pattern: {
      value: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: "gültige Email mit @ und so.",
    },
    icon: faEnvelope,
    formState,
  });
}

export type OrderType = {
  xs?: number[];
  md?: number[];
  lg?: number[];
  xl?: number[];
};

export default function Form<T>({
  inputs,
  button,
  onSubmit,
  order,
  width = "80%",
}: {
  inputs: Array<JSX.Element>;
  button: JSX.Element;
  onSubmit: FormEventHandler<HTMLFormElement>;
  order?: OrderType;
  width?: string;
}) {
  const viewportWidth = useViewport();
  const theme = useTheme();
  const breakpoints = theme.breakpoints.values;

  const breakpoint = order
    ? viewportWidth >= breakpoints.xl && order["xl"]
      ? "xl"
      : viewportWidth >= breakpoints.lg && order["lg"]
      ? "lg"
      : viewportWidth >= breakpoints.md && order["md"]
      ? "md"
      : "xs"
    : "xs";

  return (
    <form onSubmit={onSubmit} style={{ width }}>
      <Grid
        container
        spacing={2}
        direction="row"
        alignItems="flex-end"
        justify="center"
      >
        {order && order["xs"]
          ? //order[breakpoint] can never be undefined because breakpoint is checking this case already^
            order[breakpoint]!.map((index) => (
              <Fragment key={index}>{inputs[index - 1]}</Fragment>
            ))
          : inputs.map((input, index) => (
              <Fragment key={index}>{input}</Fragment>
            ))}
      </Grid>

      {button}
    </form>
  );
}
