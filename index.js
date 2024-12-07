let equations = document.querySelectorAll(".equation")
let lastFullSelection = ""
let lastSelection = ""

function getSelectionText() {
    let text = "";
    const activeEl = document.activeElement;
    const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;

    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
      (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
        text = window.getSelection().toString();
    }

    return text;
}

function setCaretPosition(elem, caretPos) {
    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

document.onmouseup = document.onkeyup = document.onselectionchange = function() {
    let selText = getSelectionText()
    
    if (selText != "") {
        lastFullSelection = getSelectionText()
    }

    lastSelection = selText
}

let replacers = {
    "pi": "π",
    "*": "·",
}

let wrappers = {
    "{": "}",
    "(": ")",
    "|": "|"
}

function getChangeIndex(newVal, oldVal) {
    for (let i = 0; i < newVal.length; i++) {
        if (newVal[i] != oldVal[i]) {
            return i
        }
    }
    if (newVal.length != oldVal.length) {
        return 0
    }
    return -1
}

for (let i = 0; i < equations.length; i++) {
    let oldText = ""
    equations[i].oninput = function(event) {
        let changeIndex = getChangeIndex(equations[i].value, oldText)
        let data = event.data

        for (let k in replacers) {
            if (equations[i].value.includes(k)) {
                equations[i].value = equations[i].value.replace(k, replacers[k])
                data = replacers[k]
                setCaretPosition(equations[i], changeIndex)
            }
        }

        if (data == "+" || data == "=" || data == "·") {
            equations[i].value = equations[i].value.slice(0, changeIndex) + " " + data + " " +
                equations[i].value.slice(changeIndex + 1, equations[i].value.length)
            setCaretPosition(equations[i], changeIndex + 3)
        }

        if (data == ",") {
            equations[i].value = equations[i].value.slice(0, changeIndex) + data + " " +
                equations[i].value.slice(changeIndex + 1, equations[i].value.length)
            setCaretPosition(equations[i], changeIndex + 2)
        }
        
        if (lastSelection != "") {
            for (let k in wrappers) {
                if (data == k) {
                    equations[i].value = oldText.slice(0, changeIndex) + k + lastFullSelection + wrappers[k] +
                        oldText.slice(changeIndex + lastFullSelection.length, oldText.length)
                    setCaretPosition(equations[i], changeIndex + lastFullSelection.length + 1)
                }
            }
        } else {
            if (Object.keys(wrappers).includes(data)) {
                equations[i].value = equations[i].value.slice(0, changeIndex) + data + wrappers[data] +
                    equations[i].value.slice(changeIndex + 1, equations[i].value.length)
                setCaretPosition(equations[i], changeIndex + 1)
            }
        }

        oldText = equations[i].value
    }
}