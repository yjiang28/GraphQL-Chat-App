import PropTypes from "prop-types";
import { IconButton } from "@material-ui/core";
import AccountBoxIcon from "@material-ui/icons/AccountBox";

const ProfileButton = ({ me }) => {
	return (
		<IconButton aria-label={"Profile"} color="inherit">
			<AccountBoxIcon />
		</IconButton>
	);
};

ProfileButton.propTypes = {
	me: PropTypes.object.isRequired
};

export default ProfileButton;
