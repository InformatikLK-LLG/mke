import "../styles/Form.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEnvelope,
  faKeyboard,
} from "@fortawesome/free-regular-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <form
      onSubmit={handleSubmit(({ email, password }) => {
        auth.signin(email, password);
        navigate("/");
      })}
    >
      <label id="email">
        <FontAwesomeIcon className="inputIcon" icon={faEnvelope} />
        <input placeholder="Email" {...register("email")} type="email" />
      </label>
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
  const { register, handleSubmit } = useForm<ForgotPasswordFormInputs>();
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(({ email }) => navigate("/login"))}>
      <label>
        <FontAwesomeIcon className="inputIcon" icon={faEnvelope} />
        <input
          placeholder="Email"
          {...register("email", { required: true })}
          type="email"
        />
      </label>
      <Button type="submit" label="Submit!" />
    </form>
  );
}

type RegisterForm1Inputs = {
  code: string;
};

export function RegisterForm1() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm1Inputs>({ mode: "onBlur" });
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(({ code }) => navigate("./1"))}>
      <label>
        <FontAwesomeIcon className="inputIcon" icon={faKeyboard} />
        <input
          placeholder="Code"
          {...register("code", {
            required: "Einladungscode ist notwendig.",
            maxLength: { value: 6, message: "too many characters and stuff" },
            pattern: /^-?[0-9]d*.?d*$/i,
          })}
          type="text"
          onChange={(event) => {
            if (isNaN(Number(event.target.value)))
              setValue(
                "code",
                event.target.value.slice(0, event.target.value.length - 1)
              );
          }}
        />
      </label>
      <Button className="formButton" type="submit" label="Registrieren" />
      {errors.code && <span>{errors.code.message}</span>}
    </form>
  );
}

type RegisterForm2Inputs = {
  firstName: string;
  lastName: string;
  email: string;
};

export function RegisterForm2() {
  const { register, handleSubmit } = useForm<RegisterForm2Inputs>();
  const navigate = useNavigate();

  return (
    <form
      onSubmit={handleSubmit(({ firstName, lastName, email }) =>
        navigate("../2")
      )}
    >
      <label>
        <FontAwesomeIcon className="inputIcon" icon={faEdit} />
        <input
          placeholder="Vorname"
          {...register("firstName", { required: true })}
        />
      </label>
      <label>
        <FontAwesomeIcon className="inputIcon" icon={faEdit} />
        <input
          placeholder="Nachname"
          {...(register("lastName"), { required: true })}
        />
      </label>
      <label>
        <FontAwesomeIcon className="inputIcon" icon={faEnvelope} />
        <input
          placeholder="Email"
          {...(register("email"), { required: true })}
          type="email"
        />
      </label>
      <Button type="submit" label="Submit!" />
    </form>
  );
}

type RegisterForm3Inputs = {
  password: string;
  passwordRepeated: string;
};

export function RegisterForm3() {
  const { register, handleSubmit } = useForm<RegisterForm3Inputs>();
  const navigate = useNavigate();

  return (
    <form
      onSubmit={handleSubmit(({ password, passwordRepeated }) => navigate("/"))}
    >
      <label>
        <FontAwesomeIcon className="inputIcon" icon={faKey} />
        <input
          placeholder="Passwort"
          {...register("password", { required: true })}
          type="password"
        />
      </label>
      <label>
        <FontAwesomeIcon className="inputIcon" icon={faKey} />
        <input
          placeholder="Passwort bestätigen"
          {...register("passwordRepeated", { required: true })}
          type="password"
        />
      </label>
      <Button type="submit" label="Submit!" />
    </form>
  );
}
