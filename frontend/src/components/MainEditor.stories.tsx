import MainEditor from './MainEditor';

export default {
	component: MainEditor,
	title: 'Main Editor',
	tags: ['autodocs'],
}

export const Blank = {
	args: {
		text: " ",
		connectionEnabled: false
	}
}

export const OneSentence = {
	args: {
		text: "Lorem ipsum etc etc",
		connectionEnabled: false
	}
}
