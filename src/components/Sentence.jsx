import './styles.css'
import React, { useCallback, useEffect, useState } from 'react'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent } from '@tiptap/react'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import { Link } from 'react-router-dom';

const Sentence = (props) => {

  const { darkMode } = props;

  const [cursorAtStart, setCursorAtStart] = useState(true);
  const [color, setColor] = useState("");
  var randomWords = require('random-words');
  const [wordLength, setWordLength] = useState(10);
  const [text, setText] = useState(randomWords({ exactly: wordLength, join: ' ' }));
  const [prompt, setPrompt] = useState(`<p><span style="font-family: monospace; color: #808080">${text}</span></p>`);

  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);

  const [occurrence, setOccurrence] = useState([]);
  const [wrongKeys, setWrongKeys] = useState([]);
  const [showWrongKeys, setShowWrongKeys] = useState(false);
  const [promptFinished, setPromptFinished] = useState(false);
  const [flashRed, setFlashRed] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Color,
      TextStyle,
      FontFamily,
    ],
    content: prompt,
    onUpdate: ({ editor }) => {
      const pos = editor.view.state.selection.$cursor.pos;
    },
  })

  useEffect(() => {
    if (cursorAtStart && editor) {
      editor.commands.focus(0);
      setCursorAtStart(false);
    }
  }, [setCursorAtStart, editor, cursorAtStart])

  const getSortedWrongKeys = () => {
    const counts = wrongKeys.reduce((acc, key) => {
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const sortedKeys = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

    return sortedKeys;
  };

  const handleKeyUp = useCallback((event) => {
    const pos = editor.view.state.selection.$cursor.pos;

    if (pos - 1 === editor.getText().length && started === true) {
      setCompleted(true);
      setStarted(false);
      setEndTime(Date.now());
      console.log("Stop")
      setPromptFinished(true);
    }

  }, [editor, setCompleted, setStarted, startTime], setPromptFinished);

  const handleTabKeydown = useCallback((event) => {
    const pos = editor.view.state.selection.$cursor.pos;


    if (event.key === "Backspace") {
      console.log(event.key, "key pressed");
      event.preventDefault();
      return;
    }

    if (event.key === "Enter") {
      reset();
      return;
    }

    if (promptFinished === true) {
      event.preventDefault();
      return;
    }

    if (event.key === editor.getText().slice(pos - 1, pos) && started === false) {
      setStarted(true);
      console.log("Start")
      setPromptFinished(false);
      setStartTime(Date.now());
    }

    if (event.key === editor.getText().slice(pos - 1, pos)) {
      editor.commands.deleteRange({ from: pos, to: pos + 1 });

      if (darkMode) {
        editor.chain().focus().setColor('rgb(255, 255, 255)').run();
      }
      else {
        editor.chain().focus().setColor('rgb(0, 0, 0)').run();
      }
    } else {
      setWrongKeys([...wrongKeys, event.key])
      setOccurrence(getSortedWrongKeys())
      flashError();
      event.preventDefault();
      // editor.chain().focus().setColor('rgb(255, 0, 0)').run();
    }

  }, [editor, started, setWrongKeys, wrongKeys, setOccurrence, completed, promptFinished, setFlashRed]);

  // hooks for keypress and keyup
  useEffect(() => {
    if (editor && editor.view && editor.view.dom) {
      editor.view.dom.addEventListener('keydown', handleTabKeydown);
      return () => {
        editor.view.dom.removeEventListener('keydown', handleTabKeydown);
      };
    }
  }, [editor, handleTabKeydown]);

  useEffect(() => {
    if (editor && editor.view && editor.view.dom) {
      editor.view.dom.addEventListener('keyup', handleKeyUp);
      return () => {
        editor.view.dom.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [editor, handleKeyUp]);

  useEffect(() => {
    if (started === false && completed === true) {
      const minutes = (endTime - startTime) / 1000 / 60;

      const wpm = Math.round((text.length / 5) / minutes);
      const cpm = Math.round(text.length / minutes);

      console.log(`Typing speed: ${wpm}  WPM`);

      setCompleted(false);
      setWpm(wpm);
      setCpm(cpm);
    }
  }, [started, completed, endTime, startTime, text, setCompleted, setWpm, setCpm]);

  function reset() {
    var randomWords = require('random-words');
    let text = randomWords({ exactly: wordLength, join: ' ' });
    setText(text);
    setWordLength(wordLength);
    setPrompt(`<p><span style="font-family: monospace; color: #808080">${text}</span></p>`);

    editor.commands.setContent(`<p><span style="font-family: monospace; color: #808080">${text}</span></p>`);
    editor.commands.focus(1);
    setEndTime(0);
    setStartTime(0);
    setStarted(false);
    setCompleted(false);
    setPromptFinished(false);
  }

  function changeLength(num) {
    setWordLength(num);
    var randomWords = require('random-words');
    let text = randomWords({ exactly: num, join: ' ' });
    setWordLength(num);
    setText(text);
    setPrompt(`<p><span style="font-family: monospace; color: #808080}">${text}</span></p>`);
    editor.commands.setContent(`<p><span style="font-family: monospace; color: #808080">${text}</span></p>`);
    editor.commands.focus(1);
  }

  // remember to set menu postion on click
  useEffect(() => {

    if (!editor) {
      return;
    }

    function handleClick(event) {
      console.log("click")
      editor.commands.focus(1);

      if (!editor.commands.focus()) {
        event.preventDefault();
      }
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [editor]);


  function flashError() {
    setFlashRed(true)
    setTimeout(() => {
      setFlashRed(false)
    }, 200)
  }

  useEffect(() => {

    let color;

    if (darkMode && started) {
      color = 'rgb(56, 56, 56)';
    } else if (darkMode && !started) {
      color = 'rgb(36, 36, 36)';
    } else if (!darkMode && started) {
      color = 'rgb(210, 210, 210)'
    } else if (!darkMode && !started) {
      color = 'rgb(200, 200, 200)'
    }

    setColor(color);

  }, [darkMode, started, setColor])




  return (
    <div style={{ backgroundColor: darkMode ? 'rgb(26, 26, 26)' : null }}>
      <div
        style={{
          backgroundColor: color,
        }}
        className='sentence'
      >

        <div className={started ? "buttons-typing" : 'buttons'}
          style={{
            backgroundColor: flashRed ? "#ba3c3c" : null
          }}>
          <div id="reset-button" onClick={reset}>Next Prompt</div>
          |
          <div id="reset-button"> WPM: {wpm}</div>
          |
          <div id="reset-button"> CPM: {cpm}</div>
          |
          <div id="reset-button" onClick={() => setShowWrongKeys(!showWrongKeys)}>
            {wrongKeys ? "Hide Errors" : "Show Errors"}
          </div>
          |
          <div id={wordLength === 1 ? "button-selected" : "reset-button"} onClick={() => changeLength(1)}>1</div>
          <div id={wordLength === 5 ? "button-selected" : "reset-button"} onClick={() => changeLength(5)}>5</div>
          <div id={wordLength === 10 ? "button-selected" : "reset-button"} onClick={() => changeLength(10)}>10</div>
          <div id={wordLength === 20 ? "button-selected" : "reset-button"} onClick={() => changeLength(20)}>20</div>
          <div id={wordLength === 50 ? "button-selected" : "reset-button"} onClick={() => changeLength(50)}>50</div>
          <div id={wordLength === 100 ? "button-selected" : "reset-button"} onClick={() => changeLength(100)}>100</div>
        </div>

        {showWrongKeys && (
          <div className="wrong-chars-container">
            <p id='wrong-chars-title'>Wrong Keys</p>
            <p id='wrong-chars'>
              {occurrence.map((key, index) => (
                <span key={index}>{key} </span>
              ))}
            </p>
          </div>
        )}

        <EditorContent editor={editor} />
      </div>
      {promptFinished && (<p className="instructions">Press 'Enter' to reset.</p>)}

    </div>

  )
}

export default Sentence