import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "@tanstack/react-location";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { signUpAsync } from "../../api/authApi";
import InputField from "../../components/common/InputField";
import SubmitButton from "../../components/common/SubmitButton";
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
  const form = useForm<SignUpInputs>({
    resolver: yupResolver(signUpSchema),
  });
  const logInMut = useMutation(signUpAsync);
  const queryClient = useQueryClient();

  const onSubmit = useCallback(
    async (params: SignUpInputs) => {
      const { email, password, name, username } = params;
      const { user, accessToken } = await logInMut.mutateAsync({
        email,
        password,
        name,
        username,
      });

      localStorage.setItem("access-token", accessToken);

      queryClient.setQueriesData(["current-user"], user);
    },

    [logInMut, queryClient]
  );

  return (
    <div className="w-full max-w-lg mx-auto px-6 my-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Create Account</h1>
      </header>

      {logInMut.isError && (
        <div className="w-full p-4 bg-red-500/20 mb-6">
          <p className="text-red-500 dark:text-red-400">
            {(logInMut.error as AxiosError).response?.status === 403
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
            className="text-indigo-500 font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
