import { LoadingButton } from "@mui/lab";
import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { GraphQLError } from "graphql";
import {
  useForm,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../graphql/generated";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const {
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();
  const navigate = useNavigate();
  const [register, { error }] = useRegisterMutation();
  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      await register({
        variables: {
          data: {
            username: data.username,
            email: data.email,
            password: data.password,
          },
        },
      });
      navigate("/");
    } catch (err) {}
    if (error) {
      console.log(error.graphQLErrors[0]);
      switch (error.graphQLErrors[0].extensions.code) {
        case "INVALID_EMAIL":
          setError("email", {
            type: "manual",
            message: "Invalid email!",
          });
          break;
        case "INVALID_PASSWORD":
          setError("password", {
            type: "manual",
            message: `${
              (error.graphQLErrors[0].extensions.feedback as any)
                .warning ||
              (
                error.graphQLErrors[0].extensions.feedback as any
              ).suggestions.join() ||
              "Invalid password!"
            }`,
          });
          break;
        case "INVALID_USERNAME":
          setError("username", {
            type: "manual",
            message: "Invalid username!",
          });
        case "USERNAME_ALREADY_EXISTS":
          setError("username", {
            type: "manual",
            message: "Username already exists!",
          });
      }
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "300px",
        rowGap: "1rem",
        margin: "0 auto",
        height: "80vh",
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h2" mt="25vh">
        Register
      </Typography>
      <Controller
        name="username"
        control={control}
        rules={{ required: "Username is required!" }}
        render={({ field }) => (
          <TextField
            label="Username"
            {...field}
            error={!!errors.username}
            helperText={
              !!errors.username &&
              (errors.username.message as string)
            }
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: "Password is required!" }}
        render={({ field }) => (
          <TextField
            type="password"
            label="Password"
            {...field}
            error={!!errors.password}
            helperText={
              !!errors.password &&
              (errors.password.message as string)
            }
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "Confirm your password!",
          validate: (value) => value === getValues("password"),
        }}
        render={({ field }) => (
          <TextField
            type="password"
            error={!!errors.confirmPassword}
            helperText={
              !!errors.confirmPassword && "Passwords must match!"
            }
            label="Confirm Password"
            {...field}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        rules={{ required: "Email is required!" }}
        render={({ field }) => (
          <TextField
            label="Email Address"
            {...field}
            error={!!errors.email}
            helperText={
              !!errors.email && (errors.email.message as string)
            }
          />
        )}
      />
      <LoadingButton
        type="submit"
        variant="outlined"
        loading={isSubmitting}>
        Register
      </LoadingButton>
    </Box>
  );
};

export default Register;
