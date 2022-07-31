import "../styles/Form.css";

import { FormEventHandler, Fragment } from "react";
import { FormState, RenderInput, useInputStyles } from "../pages/Institution";
import {
  Grid,
  GridDirection,
  GridItemsAlignment,
  GridJustification,
  GridSpacing,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Path, useForm } from "react-hook-form";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import {
  faEdit,
  faEnvelope,
  faKeyboard,
} from "@fortawesome/free-regular-svg-icons";

import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../hooks/useAuth";
import useViewport from "../hooks/useViewport";

const useButtonStyles = makeStyles({
  button: {
    display: "flex",
    justifyContent: "center",
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
    handleSubmit,
    clearErrors,
    control,
    setValue,
    setError,
    watch,
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
    watch,
    setValue,
  };

  const inputs = [
    <Grid item xs={12}>
      <EmailInputField formState={formState} />
    </Grid>,
    <Grid item xs={12}>
      {RenderInput({
        name: "password",
        type: "password",
        placeholder: "Passwort",
        required: "Passwort muss angegeben werden",
        icon: faKey,
        formState,
      })}
    </Grid>,
  ];

  return (
    <Form
      button={
        <Button
          type="submit"
          label="Login"
          buttonStyle={formButton}
          textColor="white"
          backgroundColor={theme.palette.primary.main}
        />
      }
      inputs={inputs}
      onSubmit={handleSubmit(async ({ email, password }) => {
        if (await auth.signin(email, password)) navigate("/");
        else setError("email", { message: "Email oder Passwort ist falsch" });
      })}
      width="40%"
      otherElements={{
        middle: (
          <Link className="separator" to="/forgotpassword">
            Passwort vergessen?
          </Link>
        ),
      }}
      containerStyling={{ spacing: 1 }}
    />
  );
}

type ForgotPasswordFormInputs = {
  email: string;
};

export function ForgotPasswordForm() {
  const formButton = useButtonStyles();
  const formInput = useInputStyles();
  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({ mode: "onChange" });
  const formState: FormState<ForgotPasswordFormInputs> = {
    clearErrors,
    control,
    errors,
    formInput,
    watch,
    setValue,
  };
  const navigate = useNavigate();
  const theme = useTheme();
  const inputs = [
    <Grid item xs={12}>
      <EmailInputField formState={formState} />
    </Grid>,
  ];

  return (
    <Form
      onSubmit={handleSubmit(({ email }) => navigate("/login"))}
      inputs={inputs}
      maxWidth="50ch"
      button={
        <Button
          type="submit"
          label="Weiter"
          buttonStyle={formButton}
          textColor="white"
          backgroundColor={theme.palette.primary.main}
        />
      }
      containerStyling={{ alignItems: "center" }}
    />
  );
}

export type RegisterForm1Inputs = {
  code: number;
};

export function RegisterForm1() {
  const formButton = useButtonStyles();
  const formInput = useInputStyles();
  const {
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterForm1Inputs>({ mode: "onChange" });
  const formState: FormState<RegisterForm1Inputs> = {
    clearErrors,
    control,
    errors,
    formInput,
    watch,
    setValue,
  };
  const navigate = useNavigate();
  const { validateInviteCode } = useAuth();
  const theme = useTheme();
  const inputs = [
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
    </Grid>,
  ];

  return (
    <Form
      onSubmit={handleSubmit(({ code }) => {
        if (validateInviteCode(code))
          navigate("./1", { state: { registerState: { code } } });
        setError("code", { message: "Code falsch" });
      })}
      inputs={inputs}
      maxWidth="40ch"
      button={
        <Button
          textColor="white"
          backgroundColor={theme.palette.primary.main}
          type="submit"
          label="Registrieren"
          buttonStyle={formButton}
        />
      }
    />
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
  const location = useLocation();
  const {
    registerState: { code, email, firstName, lastName },
  } = location.state as {
    registerState: {
      email?: string;
      code: number;
      firstName?: string;
      lastName?: string;
    };
  };

  const {
    handleSubmit,
    clearErrors,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterForm2Inputs>({
    mode: "onChange",
    defaultValues: {
      email,
      firstName: firstName || "",
      lastName: lastName || "",
    },
  });
  const formState: FormState<RegisterForm2Inputs> = {
    clearErrors,
    control,
    errors,
    formInput,
    watch,
    setValue,
  };
  const navigate = useNavigate();
  const theme = useTheme();
  const inputs = [
    <Grid item xs={12}>
      {RenderInput({
        name: "firstName",
        placeholder: "Vorname",
        autoComplete: "given-name",
        required: "Vorname muss angegeben werden",
        icon: faEdit,
        formState,
        autofocus: true,
      })}
    </Grid>,
    <Grid item xs={12}>
      {RenderInput({
        name: "lastName",
        placeholder: "Nachname",
        autoComplete: "family-name",
        required: "Nachname muss angegeben werden",
        icon: faKeyboard,
        formState,
      })}
    </Grid>,
    <Grid item xs={12}>
      <EmailInputField formState={formState} />
    </Grid>,
  ];

  const onSubmit = handleSubmit(({ firstName, lastName, email }) =>
    navigate("../2", {
      state: {
        registerState: { code, firstName, lastName, email },
      },
    })
  );

  return (
    <Form
      onSubmit={onSubmit}
      inputs={inputs}
      maxWidth="50ch"
      button={
        <Button
          textColor="white"
          backgroundColor={theme.palette.primary.main}
          type="submit"
          label="Weiter"
          buttonStyle={formButton}
        />
      }
      next={
        <FontAwesomeIcon
          icon={faChevronCircleRight}
          type="submit"
          onClick={onSubmit}
        />
      }
    />
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
    handleSubmit,
    setError,
    setValue,
    control,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<RegisterForm3Inputs>({ mode: "onChange" });
  const formState: FormState<RegisterForm3Inputs> = {
    clearErrors,
    control,
    errors,
    formInput,
    watch,
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
  const inputs = [
    <Grid item xs={12}>
      {RenderInput({
        name: "password",
        type: "password",
        placeholder: "Passwort",
        autoComplete: "new-password",
        required: "Passwort muss angegeben werden ",
        pattern: {
          value:
            /^(?=.*[a-zäöüß])(?=.*[A-ZÄÖÜ])(?=.*\d)(?=.*[@$!%*?&|<>'_;-])[A-Za-zäöüÄÖÜß\d@$!%*?&'|<>_; -]{8,}$/,
          message:
            "Passwort muss aus mindestens acht Zeichen bestehen; inklusive Sonderzeichen",
        },
        icon: faKey,
        formState,
        autofocus: true,
      })}
    </Grid>,
    <Grid item xs={12}>
      {RenderInput({
        name: "passwordRepeated",
        type: "password",
        autoComplete: "new-password",
        placeholder: "Passwort bestätigen",
        required: "Passwort muss angegeben werden",
        icon: faKey,
        formState,
      })}
    </Grid>,
  ];

  const onSubmit = handleSubmit(async ({ password, passwordRepeated }) => {
    if (password === passwordRepeated) {
      await auth.register(
        registerState.code,
        registerState.firstName,
        registerState.lastName,
        registerState.email,
        password
      );
      navigate("/");
    } else
      setError("password", {
        message: "Passwörter stimmen nicht überein",
      });
  });

  return (
    <Form
      onSubmit={onSubmit}
      inputs={inputs}
      maxWidth="50ch"
      button={
        <Button
          textColor="white"
          type="submit"
          label="Weiter"
          buttonStyle={formButton}
          backgroundColor={theme.palette.primary.main}
        />
      }
      next={<FontAwesomeIcon icon={faChevronCircleRight} onClick={onSubmit} />}
      previous={
        <FontAwesomeIcon
          icon={faChevronCircleLeft}
          onClick={() => navigate("../1", { state: { registerState } })}
        />
      }
    />
  );
}

export function EmailInputField<T extends { email: string }>({
  formState,
  disabled,
}: {
  formState: FormState<T>;
  disabled?: boolean;
}) {
  return RenderInput({
    name: "email" as Path<T>,
    placeholder: "Email",
    required: "Email muss angegeben werden",
    autoComplete: "email",
    pattern: {
      value: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      message: "gültige Email mit @ und so.",
    },
    icon: faEnvelope,
    disabled,
    formState,
  });
}

export type OrderType = {
  xs?: number[];
  md?: number[];
  lg?: number[];
  xl?: number[];
};

export default function Form({
  inputs,
  button,
  next,
  previous,
  onSubmit,
  order,
  width = "80%",
  maxWidth = "50ch",
  otherElements,
  containerStyling = {
    spacing: 2,
    direction: "row",
    alignItems: "flex-end",
    justify: "center",
  },
}: {
  inputs: Array<JSX.Element>;
  button: JSX.Element;
  next?: JSX.Element;
  previous?: JSX.Element;
  onSubmit: FormEventHandler<HTMLFormElement>;
  order?: OrderType;
  width?: string;
  maxWidth?: string;
  otherElements?: Partial<{
    start: JSX.Element;
    middle: JSX.Element;
    end: JSX.Element;
  }>;
  containerStyling?: Partial<{
    spacing: GridSpacing;
    direction: GridDirection;
    alignItems: GridItemsAlignment;
    justify: GridJustification;
  }>;
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
    <form onSubmit={onSubmit} style={{ width, maxWidth }}>
      <Grid
        container
        spacing={containerStyling.spacing}
        direction={containerStyling.direction}
        alignItems={containerStyling.alignItems}
        justifyContent={containerStyling.justify}
      >
        {otherElements?.start}
        {order && order["xs"]
          ? //order[breakpoint] can never be undefined because breakpoint is checking this case already^
            order[breakpoint]!.map((index) => (
              <Fragment key={index}>{inputs[index - 1]}</Fragment>
            ))
          : inputs.map((input, index) => (
              <Fragment key={index}>{input}</Fragment>
            ))}
      </Grid>
      {otherElements?.middle}
      <Grid
        container
        justifyContent="space-between"
        alignItems="baseline"
        direction="row"
      >
        <Grid item>{previous}</Grid>
        <Grid item>{button}</Grid>
        <Grid item>{next}</Grid>
      </Grid>
      {otherElements?.end}
    </form>
  );
}
