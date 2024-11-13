import { useState } from "react";
import RemoteApp from "remote/App";
import "./App.css";
import {
	init,
	makeFetchTransport,
	moduleMetadataIntegration,
	makeMultiplexedTransport,
} from "@sentry/browser";

const EXTRA_KEY = "ROUTE_TO";

const transport = makeMultiplexedTransport(makeFetchTransport, (args) => {
	const event = args.getEvent();
	if (
		event?.extra &&
		EXTRA_KEY in event.extra &&
		Array.isArray(event.extra[EXTRA_KEY])
	) {
		return event.extra[EXTRA_KEY];
	}
	return [];
});

init({
	dsn: "https://c1bf01fb681268d6c21c095375c7a0f7@o4508279640817664.ingest.us.sentry.io/4508279642914816",
	integrations: [moduleMetadataIntegration()],
	transport,
	beforeSend: (event) => {
		//@ts-expect-error - it works
		if (event?.exception?.values?.[0].stacktrace.frames) {
			const frames = event.exception.values[0].stacktrace.frames;
			// Find the last frame with module metadata containing a DSN
			const routeTo = frames
				.filter((frame) => frame.module_metadata?.dsn)
				.map((v) => v.module_metadata)
				.slice(-1); // using top frame only - you may want to customize this according to your needs

			if (routeTo.length) {
				event.extra = {
					...event.extra,
					[EXTRA_KEY]: routeTo,
				};
			}
		}

		return event;
	},
});

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<button
				type="button"
				onClick={() => {
					throw new Error("Break the world");
				}}
			>
				Break Stuff
			</button>

			<h1>Host Application</h1>
			<div className="card" style={{ border: "1px solid red" }}>
				<h1>Remote Application</h1>
				<RemoteApp />
			</div>
		</div>
	);
}

export default App;
