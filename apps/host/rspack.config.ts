import { rspack } from "@rspack/core";
import * as RefreshPlugin from "@rspack/plugin-react-refresh";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { sentryWebpackPlugin } from "@sentry/webpack-plugin";
import { withZephyr } from "zephyr-webpack-plugin";

const isDev = process.env.NODE_ENV === "development";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default withZephyr()({
	context: __dirname,
	devServer: {
		port: 3000,
	},
	entry: {
		main: "./src/main.tsx",
	},
	resolve: {
		extensions: ["...", ".ts", ".tsx", ".jsx"],
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset",
			},
			{
				test: /\.(jsx?|tsx?)$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true,
								},
								transform: {
									react: {
										runtime: "automatic",
										development: isDev,
										refresh: isDev,
									},
								},
							},
							env: { targets },
						},
					},
				],
			},
		],
	},
	plugins: [
		sentryWebpackPlugin({
			moduleMetadata: ({ release }) => ({
				dsn: "https://c1bf01fb681268d6c21c095375c7a0f7@o4508279640817664.ingest.us.sentry.io/4508279642914816",
				release,
			}),
			org: process.env.SENTRY_ORG,
			project: process.env.SENTRY_PROJECT,

			// Auth tokens can be obtained from https://sentry.io/orgredirect/organizations/:orgslug/settings/auth-tokens/
			authToken: process.env.SENTRY_AUTH_TOKEN,
		}),
		new rspack.HtmlRspackPlugin({
			template: "./index.html",
		}),
		new ModuleFederationPlugin({
			name: "host",
			remotes: {
				remote: "remote@http://localhost:3001/remoteEntry.js",
			},
			shared: ["react", "react-dom"],
		}),
		isDev ? new RefreshPlugin() : null,
	].filter(Boolean),
	optimization: {
		minimizer: [
			//@ts-expect-error - it works
			new rspack.SwcJsMinimizerRspackPlugin(),
			//@ts-expect-error - it works
			new rspack.LightningCssMinimizerRspackPlugin({
				minimizerOptions: { targets },
			}),
		],
	},
	experiments: {
		css: true,
	},
});
