import {Slate, Editable, withReact, RenderElementProps} from 'slate-react'
import {createEditor, Descendant} from 'slate'
import {useEffect, useMemo, useState} from 'react'
import '../App.css'

// Import the core binding
import { withYjs, slateNodesToInsertDelta, YjsEditor } from '@slate-yjs/core';

// Persistence with IndexedDB
import {IndexeddbPersistence, storeState} from 'y-indexeddb'

// Import yjs
import * as Y from 'yjs';
import {ParagraphElement} from "../editorNodes";


const wrapTextInParagraph = (text: string) => ({
  'type': 'paragraphBlock',
  children: [{text}]
}) as ParagraphElement

const exampleParagraph = wrapTextInParagraph('A line of text in a paragraph.')

const CodeElement = (props: RenderElementProps) => {
  return (
      <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}
const ParaBlock = (props: RenderElementProps) => {
  return <div>
    <span>{}</span>
    <div>
      <p {...props.attributes} className="text-red-500">{props.children}</p>
    </div>
  </div>
}

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>
}

const renderElement = (props: RenderElementProps) => {
  switch (props.element?.type) {
    case 'paragraphBlock':
      return <ParaBlock {...props} children={props.children}/>
    case 'codeBlock':
      return <CodeElement {...props} children={props.children}/>
    default:
      return <DefaultElement {...props} children={props.children}/>
  }
}

const MainEditor = ({text, connectionEnabled}: {text?: string, connectionEnabled: boolean}) => {

  const initialValue = useMemo(() => text ? [wrapTextInParagraph(text)] : [exampleParagraph], [text])

  // Create a yjs document and get the shared type
  const sharedType = useMemo(() => {
    if (! connectionEnabled) return;
    const yDoc = new Y.Doc()
    const roomName = 'main-doc'
    // Add offline persistence
    const persistence = new IndexeddbPersistence(roomName, yDoc)
    const docContent = yDoc.get("content", Y.XmlText)

    persistence.once('synced', async (t: typeof persistence) => {
      await persistence.whenSynced;
      // Only add initial value if text is totally blank (?)
      if (t.doc.get('content', Y.XmlText).toString().trim().length === 0) {
        console.log("applying initial value delta")
        yDoc.get('content', Y.XmlText).applyDelta(slateNodesToInsertDelta(initialValue))
        await storeState(t)
        console.log('storeState call went through')
      } else {
        console.log("NOT applying initial value delta")
      }
    })

    return docContent
  }, [])
  /*@ts-expect-error sharedType’s type doesn't matter in the case when connectionEnabled is false.*/
  const editor = useMemo(() => connectionEnabled ? withYjs(withReact(createEditor()), sharedType) : withReact(createEditor()), [])

  const [value, setValue] = useState([] as Descendant[])

  const [initialized, setInitialized] = useState(false as boolean);
  // Connect editor in useEffect to comply with concurrent mode requirements.
  useEffect(() => {
    if (connectionEnabled) {
      /*@ts-expect-error This type is correct when connectionEnabled is true.*/
      YjsEditor.connect(editor as YjsEditor);
      /*@ts-expect-error This type is correct when connectionEnabled is true.*/
      return () => YjsEditor.disconnect(editor as YjsEditor);
    } else if (!initialized) {
      setValue(initialValue)
      setInitialized(true)
    }

  }, [editor, connectionEnabled, initialized]);

  return (
    // Add the editable component inside the context.
    <Slate editor={editor} initialValue={value} onChange={setValue}>
      <Editable
          renderElement={renderElement}
          onKeyDown={
        event => {
          if (event.key === 'Enter') {
            if (event.getModifierState("Shift")) {
              return;
            }
            event.preventDefault()
            editor.splitNodes()
            editor.insertNode({type: 'paragraphBlock', children: [{text: 'FOOBAR'}]} as ParagraphElement)
          }
        }
      }
      />
    </Slate>
  )
}

export default MainEditor
