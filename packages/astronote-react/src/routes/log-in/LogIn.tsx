import { Link, Navigate } from "@tanstack/react-location";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AxiosError } from "axios";
import { LogInInputs } from "../../types/forms";
import { logInAsync } from "../../api/authApi";
import InputField from "../../components/common/input-field/input-field";
import SubmitButton from "../../components/common/button/submit-button";
import { useAuth } from "../../contexts/authContext";
import AuthHeader from "../../components/auth-header";

const logInSchema = yup
  .object()
  .shape({
    email: yup.string().required().email().label("Email"),
    password: yup.string().required().label("Password"),
  })
  .required();

const LogIn = () => {
  const [logInError, setLogInError] = useState(null);
  const form = useForm<LogInInputs>({
    resolver: yupResolver(logInSchema),
  });
  const { user, setUser } = useAuth();

  const onSubmit = useCallback(async (inputs: LogInInputs) => {
    setLogInError(null);
    try {
      const { user, accessToken } = await logInAsync(inputs);
      setUser(user);
      localStorage.setItem("access-token", accessToken);
    } catch (e: any) {
      console.log("FAILED TO LOGIN", e);
      setLogInError(e);
    }
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AuthHeader />

      <div className="mx-auto my-16 w-full max-w-lg px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Log In</h1>
        </header>

        {logInError && (
          <div className="mb-6 w-full bg-red-500/20 p-4">
            <p className="text-red-500 dark:text-red-400">
              {(logInError as AxiosError).response?.status === 403
                ? "Invalid Credentials"
                : "Something went wrong!"}
            </p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <InputField
            {...form.register("email")}
            type="email"
            placeholder="john@domain.com"
            errorText={form.formState.errors.email?.message}
            label="Email"
          />

          <InputField
            {...form.register("password")}
            type="password"
            placeholder="••••••••"
            errorText={form.formState.errors.password?.message}
            label="Password"
          />

          <SubmitButton loading={form.formState.isSubmitting}>
            Log In
          </SubmitButton>

          <p className="text-gray-600 dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default LogIn;
