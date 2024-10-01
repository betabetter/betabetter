import MainEditor from "./components/MainEditor.tsx";
import Header from "./components/Header.tsx";
export default function App() {
	return <div className="h-full w-full">
		<Header/>
		<MainEditor connectionEnabled={true}/>
	</div>
}