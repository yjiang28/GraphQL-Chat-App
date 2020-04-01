import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import Router from "next/router";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Link,
  Grid,
  Typography,
  withStyles
} from "@material-ui/core";
import TextInputField from "./shared/TextInputField";
import { CURRENT_USER_QUERY } from "../gqls/queries/userQueries";
import { SIGN_UP_MUTATION } from "../gqls/mutations/userMutations";

const styles = theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
});

const SignUp = ({ classes }) => {
  const [userInputError, setUserInputError] = useState({
    username: false,
    email: false
  });

  const [SignUp, { data }] = useMutation(SIGN_UP_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    onCompleted: data => {
      Router.push("/");
    },
    onError: e => {
      console.log("SignUp: SIGN_UP_MUTATION:", e);
      const { graphQLErrors } = e;

      if (graphQLErrors) {
        let updatedError = { ...userInputError };
        if (
          graphQLErrors[0] &&
          graphQLErrors[0].extensions &&
          graphQLErrors[0].extensions.invalidArgs
        )
          graphQLErrors[0].extensions.invalidArgs.forEach(arg => {
            updatedError[arg] = true;
          });
        setUserInputError(updatedError);
      }
    }
  });

  const onSubmit = e => {
    e.preventDefault();
    setUserInputError({
      username: false,
      email: false
    });

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    SignUp({
      variables: { username, email, password }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <TextInputField
              name="username"
              label="Username"
              display_error={true}
              error_message={
                userInputError.username &&
                "This username has already been taken."
              }
            />
            <TextInputField
              name="email"
              label="Email Address"
              type="email"
              display_error={true}
              error_message={
                userInputError.email &&
                "This email has already been registered."
              }
            />
            <TextInputField
              name="password"
              label="Password"
              type="password"
              display_error={true}
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default withStyles(styles)(SignUp);
