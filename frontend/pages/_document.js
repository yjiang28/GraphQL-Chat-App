import Document, { Head, Main, NextScript } from "next/document";
import ReactDOMServer from "react-dom/server";
import { resetServerContext } from "react-beautiful-dnd";
import { ServerStyleSheets } from "@material-ui/core/styles";

resetServerContext();

export default class MyDocument extends Document {
	static getInitialProps({ renderPage }) {
		const sheets = new ServerStyleSheets();
		const page = renderPage(App => props =>
			sheets.collect(<App {...props} />)
		);
		const styleTags = sheets.getStyleElement();
		return { ...page, styleTags };
	}

	render() {
		return (
			<html>
				<Head>{this.props.styleTags}</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
