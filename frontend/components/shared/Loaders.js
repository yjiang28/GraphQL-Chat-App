const DualBallLoader = props => (
	<svg
		style={{
			margin: "auto",
			padding: "auto",
			background: "transparent",
			display: "block"
		}}
		width="100px"
		height="12px"
		role="img"
		{...props}
	>
		<circle cx="6" cy="6" fill="#888" r="6">
			<animate
				attributeName="cx"
				repeatCount="indefinite"
				dur="1s"
				keyTimes="0;0.5;1"
				values="30;70;30"
				begin="-0.5s"
			></animate>
		</circle>
		<circle cx="6" cy="6" fill="#AAA" r="6">
			<animate
				attributeName="cx"
				repeatCount="indefinite"
				dur="1s"
				keyTimes="0;0.5;1"
				values="30;70;30"
				begin="0s"
			></animate>
		</circle>
		<circle cx="6" cy="6" fill="#888" r="6">
			<animate
				attributeName="cx"
				repeatCount="indefinite"
				dur="1s"
				keyTimes="0;0.5;1"
				values="30;70;30"
				begin="-0.5s"
			></animate>
			<animate
				attributeName="fill-opacity"
				values="0;0;1;1"
				calcMode="discrete"
				keyTimes="0;0.499;0.5;1"
				dur="1s"
				repeatCount="indefinite"
			></animate>
		</circle>
	</svg>
);

const TypingLoader = props => (
	<svg
		style={{
			margin: "auto",
			padding: "auto",
			background: "transparent",
			display: "block"
		}}
		width="57px"
		height="18px"
		role="img"
		{...props}
	>
		<circle cx="6" cy="6" r="6" fill="#fe718d">
			<animate
				attributeName="cy"
				calcMode="spline"
				keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
				repeatCount="indefinite"
				values="12;6;12;12"
				keyTimes="0;0.3;0.6;1"
				dur="1s"
				begin="-0.6s"
			></animate>
		</circle>{" "}
		<circle cx="21" cy="0" r="6" fill="#f47e60">
			<animate
				attributeName="cy"
				calcMode="spline"
				keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
				repeatCount="indefinite"
				values="12;6;12;12"
				keyTimes="0;0.3;0.6;1"
				dur="1s"
				begin="-0.44999999999999996s"
			></animate>
		</circle>{" "}
		<circle cx="36" cy="0" r="6" fill="#f8b26a">
			<animate
				attributeName="cy"
				calcMode="spline"
				keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
				repeatCount="indefinite"
				values="12;6;12;12"
				keyTimes="0;0.3;0.6;1"
				dur="1s"
				begin="-0.3s"
			></animate>
		</circle>{" "}
		<circle cx="51" cy="0" r="6" fill="#abbd81">
			<animate
				attributeName="cy"
				calcMode="spline"
				keySplines="0 0.5 0.5 1;0.5 0 1 0.5;0.5 0.5 0.5 0.5"
				repeatCount="indefinite"
				values="12;6;12;12"
				keyTimes="0;0.3;0.6;1"
				dur="1s"
				begin="-0.15s"
			></animate>
		</circle>
	</svg>
);

export { DualBallLoader, TypingLoader };
