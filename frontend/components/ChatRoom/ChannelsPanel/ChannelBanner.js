import PropTypes from "prop-types";
import {
	Paper,
	Avatar,
	IconButton,
	Grid,
	Typography,
	withStyles
} from "@material-ui/core";
import { processUsername } from "../../../scripts/utils";

const styles = theme => ({
	container: {
		position: "relative",
		height: theme.navHeight,
		display: "flex",
		justifyContent: "flex-start",
		alignItems: "center"
	}
});

const ChannelBanner = ({ classes, me }) => {
	const username = processUsername(me.username);

	return (
		<Paper classes={{ root: classes.container }} elevation={0} square>
			<Grid
				container
				spacing={2}
				justify="flex-start"
				alignItems="center"
			>
				<Grid item>
					<IconButton>
						<Avatar alt={username} src={me.avatar} />
					</IconButton>
				</Grid>
				<Grid item>
					<Typography>{username}</Typography>
				</Grid>
			</Grid>
		</Paper>
	);
};

ChannelBanner.propTypes = {
	me: PropTypes.object
};

export default withStyles(styles)(ChannelBanner);
