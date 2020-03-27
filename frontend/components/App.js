import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
		}
	}
}));

const App = ({ me, pathname, query }) => {
	useStyles();

	return (
		<Fragment>
			<NavBar me={me} />
			{me ? (
				<ChatRoom me={me} query={query} />
			) : pathname == "/signup" ? (
				<SignUp />
			) : (
				<SignIn />
			)}
		</Fragment>
	);
};

export default App;
