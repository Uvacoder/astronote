import { yupResolver } from "@hookform/resolvers/yup";
import { Link, Navigate } from "@tanstack/react-location";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { signUpAsync } from "../../api/authApi";
import AuthHeader from "../../components/auth-header";
import InputField from "../../components/common/input-field/input-field";
import SubmitButton from "../../components/common/button/submit-button";
import { useAuth } from "../../contexts/authContext";
import { SignUpInputs } from "../../types/forms";

const signUpSchema = yup
  .object()
  .shape({
    username: yup.string().required().label("Username"),
    name: yup.string().required().label("Name"),
    email: yup.string().required().email().label("Email"),
    password: yup.string().required().label("Password"),
  })
  .required();

const SignUp = () => {
  const [signUpError, setSignUpError] = useState(null);

  const form = useForm<SignUpInputs>({
    resolver: yupResolver(signUpSchema),
  });
  const { user, setUser } = useAuth();

  const onSubmit = useCallback(
    async (inputs: SignUpInputs) => {
      try {
        const { user, accessToken } = await signUpAsync(inputs);
        localStorage.setItem("access-token", accessToken);
        setUser(user);
      } catch (e: any) {
        console.log("FAILED TO SIGNUP", e);
        setSignUpError(e);
      }
    },

    [setUser]
  );

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AuthHeader />
      <div className="mx-auto my-16 w-full max-w-lg px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Create Account</h1>
        </header>

        {signUpError && (
          <div className="mb-6 w-full bg-red-500/20 p-4">
            <p className="text-red-500 dark:text-red-400">
              {(signUpError as AxiosError).response?.status === 403
                ? "Invalid Credentials"
                : "Something went wrong!"}
            </p>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <InputField
            {...form.register("username")}
            type="text"
            placeholder="johndoe123"
            errorText={form.formState.errors.username?.message}
            label="Username"
          />

          <InputField
            {...form.register("name")}
            type="text"
            placeholder="John Doe"
            errorText={form.formState.errors.name?.message}
            label="Name"
          />

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
            Sign Up
          </SubmitButton>

          <p className="text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default SignUp;
