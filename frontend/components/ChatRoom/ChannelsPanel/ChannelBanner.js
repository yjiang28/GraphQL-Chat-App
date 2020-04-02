import { useState } from "react";
import PropTypes from "prop-types";
import {
	Paper,
	Avatar,
	IconButton,
	Grid,
	Menu,
	MenuItem,
	Typography,
	withStyles,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { processUsername } from "../../../scripts/utils";

const styles = (theme) => ({
	container: {
		position: "relative",
		height: theme.navHeight,
	},
	root: {
		width: "100%",
		height: "100%",
	},
});

const ChannelBanner = ({ classes, me }) => {
	const username = processUsername(me.username);
	const [anchorEl, setAnchorEl] = useState(null);

	return (
		<Paper classes={{ root: classes.container }} elevation={0} square>
			<Grid
				container
				spacing={2}
				justify="space-between"
				alignItems="center"
				classes={{ root: classes.root }}
			>
				<Grid item>
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
				</Grid>
				<Grid>
					<IconButton
						edge="end"
						aria-label="delete"
						onClick={(e) => {
							setAnchorEl(e.currentTarget);
						}}
					>
						<SettingsIcon />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						getContentAnchorEl={null}
						anchorOrigin={{
							vertical: "center",
							horizontal: "right",
						}}
						keepMounted
						transformOrigin={{
							vertical: "center",
							horizontal: "left",
						}}
						open={Boolean(anchorEl)}
						onClose={() => {
							setAnchorEl(null);
						}}
					>
						<MenuItem>Delete</MenuItem>
					</Menu>
				</Grid>
			</Grid>
		</Paper>
	);
};

ChannelBanner.propTypes = {
	me: PropTypes.object,
};

export default withStyles(styles)(ChannelBanner);
