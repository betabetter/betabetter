import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

export type CustomEditor = BaseEditor & ReactEditor

export type ParagraphElement = {
	type: 'paragraphBlock'
	children: CustomText[]
}

export type HeadingElement = {
	type: 'heading'
	level: number
	children: CustomText[]
}

export type CodeBlockElement = {
	type: 'codeBlock'
	children: CustomText[]
}

export type CustomElement = ParagraphElement | HeadingElement | CodeBlockElement

export type FormattedText = { text: string }

export type CustomText = FormattedText

declare module 'slate' {
	interface CustomTypes {
		Editor: CustomEditor
		Element: CustomElement
		Text: CustomText
	}
}