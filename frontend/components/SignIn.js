import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";
import {
  Avatar,
  Button,
  CssBaseline,
  Link,
  Grid,
  Typography,
  Container,
  withStyles,
} from "@material-ui/core";
import TextInputField from "./shared/TextInputField";
import { CURRENT_USER_QUERY } from "../gqls/queries/userQueries";
import { SIGN_IN_MUTATION } from "../gqls/mutations/userMutations";

const styles = (theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const SignIn = ({ classes }) => {
  const [userInputError, setUserInputError] = useState({
    email: false,
    password: false,
  });

  const [SignIn, _] = useMutation(SIGN_IN_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    onCompleted: (data) => {
      Router.push("/");
    },
    onError: (e) => {
      console.log("SignIn: SIGN_IN_MUTATION:", e);
      const { graphQLErrors } = e;
      if (graphQLErrors) {
        let updatedError = { ...userInputError };
        if (
          graphQLErrors[0] &&
          graphQLErrors[0].extensions &&
          graphQLErrors[0].extensions.invalidArgs
        )
          graphQLErrors[0].extensions.invalidArgs.forEach((arg) => {
            updatedError[arg] = true;
          });
        setUserInputError(updatedError);
      }
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (userInputError) setUserInputError({ email: false, password: false });
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    SignIn({
      variables: { email, password },
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <TextInputField
              name="email"
              label="Email Address"
              type="email"
              display_error={true}
              error_message={
                userInputError.email && "This email has not been registered."
              }
            />
            <TextInputField
              name="password"
              label="Password"
              type="password"
              display_error={true}
              error_message={
                userInputError.password && "The password is incorrect."
              }
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signup" variant="body2">
                Don't have an account yet? Sign up now!
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default withStyles(styles)(SignIn);
