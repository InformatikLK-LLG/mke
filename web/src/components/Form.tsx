import "../styles/Form.css";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEnvelope, faKeyboard } from "@fortawesome/free-regular-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";

type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm({}) {
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
        <input placeholder="Password" {...register("password")} type="password" />
      </label>
      <Link to="/forgotpassword">Passwort vergessen?</Link>
      <Button className="formButton" type="submit" label="Login" />
    </form>
  );
}

type ForgotPasswordForm = {
  email: string;
};

export function ForgotPasswordForm({}) {
  const { register, handleSubmit } = useForm<ForgotPasswordForm>();
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(({ email }) => navigate("/login"))}>
      <label>Email</label>
      <input {...register("email")} type="email" />
      <Button type="submit" label="Submit!" />
    </form>
  );
}

type RegisterForm1Inputs = {
  code: number;
};

export function RegisterForm1() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm1Inputs>();
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(({ code }) => navigate("./1"))}>
      <label>Code</label>
      <input
        {...register("code", { required: true, maxLength: { value: 6, message: "too many characters and stuff" } })}
        type="number"
      />
      <Button type="submit" label="Submit!" />
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
    <form onSubmit={handleSubmit(({ firstName, lastName, email }) => navigate("../2"))}>
      <label>First Name</label>
      <input {...register("firstName")} />
      <label>Last Name</label>
      <input {...register("lastName")} />
      <label>Email</label>
      <input {...register("email")} type="email" />
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
    <form onSubmit={handleSubmit(({ password, passwordRepeated }) => navigate("/"))}>
      <label>Passwort</label>
      <input {...register("password")} type="password" />
      <label>Passwort bestätigen</label>
      <input {...register("passwordRepeated")} type="password" />
      <Button type="submit" label="Submit!" />
    </form>
  );
}
