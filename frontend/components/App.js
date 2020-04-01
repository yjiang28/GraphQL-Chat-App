import { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { useApolloClient } from "@apollo/react-hooks";
import {
	makeStyles,
	ThemeProvider,
	createMuiTheme
} from "@material-ui/core/styles";
import NavBar from "./NavBar";
import ChatRoom from "./ChatRoom";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const useStyles = makeStyles(theme => ({
	"@global": {
		body: {
			width: "100vw",
			height: "100vh",
			margin: 0
		},
		"*": {
			boxSizing: "border-box"
		}
	}
}));

const theme = createMuiTheme({
	navHeight: 64,
	palette: {
		primary: {
			main: "#222"
		}
	},
	typography: {
		fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif'
	}
});

const App = ({ me, pathname, query }) => {
	useStyles();
	const client = useApolloClient();

	useEffect(() => {
		client.writeData({ data: { me } });
	}, [me]);

	return (
		<ThemeProvider theme={theme}>
			<NavBar me={me} />
			{me ? (
				<ChatRoom me={me} query={query} />
			) : pathname.toLowerCase() === "/signup" ? (
				<SignUp />
			) : (
				<SignIn />
			)}
		</ThemeProvider>
	);
};

App.propTypes = {
	me: PropTypes.object,
	pathname: PropTypes.string.isRequired,
	query: PropTypes.object.isRequired
};

export default App;
