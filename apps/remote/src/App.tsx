import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<button
				type="button"
				onClick={() => {
					throw new Error("Remote World Broken");
				}}
			>
				Break Remote a different versions world
			</button>
		</div>
	);
}

export default App;
