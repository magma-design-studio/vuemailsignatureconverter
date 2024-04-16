<script setup>

import { computed } from 'vue'

import {
    mimeWordsEncode,
    headerLineEncode,
    quotedPrintableEncode
} from 'emailjs-mime-codec'

const props = defineProps({
    source: {
        type: HTMLElement
    },
    filename: {
        default() {
            return window.location.host.replace(/:/, '_')
        }
    },
    hideInstructions: {
        default() {
            return false
        }
    }
})

function getAppliedStyles(element) {
    var styles = [];
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var j = 0; j < rules.length; j++) {
            var rule = rules[j];
            if (element.matches(rule.selectorText)) {
                styles.push(rule.style);
            }
        }
    }
    return styles;
}

const getGlobalStyles = (element) => {
    var styles = [];
    var sheets = document.styleSheets;
    for (var i = 0; i < sheets.length; i++) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var j = 0; j < rules.length; j++) {
            var rule = rules[j];

            if (rule.type == CSSRule.FONT_FACE_RULE || rule.media && rule.media.mediaText) {
                styles.push(rule.cssText)
            }
        }
    }
    return styles;
}

const getHtml = (originalElement, sub = false) => {
    // Das Element klonen
    var cloneElement = !sub ? originalElement.cloneNode(true) : originalElement
    originalElement = !sub ? originalElement : sub

    // Inline-Styles auf den Klon anwenden
    var computedStyles = getAppliedStyles(originalElement);
    var inlineStyles = "";



    for (var s = 0; s < computedStyles.length; s++) {
        const sheet = computedStyles[s]
        for (var i = 0; i < sheet.length; i++) {
            var propertyName = sheet[i];
            var propertyValue = sheet.getPropertyValue(propertyName);

            inlineStyles += propertyName + ": " + propertyValue + "; ";

        }
    }


    // console.log(inlineStyles)
    if (inlineStyles)
        cloneElement.setAttribute("style", inlineStyles);

    // Rekursiv auf alle Kinder des geklonten Elements anwenden
    var children = cloneElement.children;
    for (var i = 0; i < children.length; i++) {
        getHtml(children[i], originalElement.children[i]);
    }

    // Den geklonten Knoten dem DOM hinzufügen
    // originalElement.appendChild(cloneElement);
    // if (!sub) {
    //     console.log(cloneElement)
    // }

    return cloneElement

}

const getSignatureHtml = () => {
    let html = `<style type="text/css">${getGlobalStyles(props.source).join("\n")}</style>`
    html += getHtml(props.source).innerHTML
    html = html.replace(/ data-v-[a-z0-9]+=""/g, '')

    return `<meta charset="UTF-8"><body>${html}</body>`
}

const onClickCopyHtml = () => {


    navigator.clipboard.writeText(getSignatureHtml())
        .then(function () {
            console.log('HTML-Inhalt erfolgreich in die Zwischenablage kopiert.');
        })
        .catch(function (err) {
            console.error('Fehler beim Kopieren des HTML-Inhalts: ', err);
        })

    alert('HTMl was copied to clipboard!')
}

const onClickDownloadMailsignature = async () => {
    // var selection = window.getSelection();
    // var range = document.createRange();
    // range.selectNodeContents($t.value);
    // selection.removeAllRanges();
    // selection.addRange(range);

    // Kopiere den selektierten Inhalt in die Zwischenablage
    // document.execCommand('copy');

    let text = ''

    for (const [key, value] of Object.entries({
        'Content-Transfer-Encoding': 'quoted-printable',
        'Content-Type': `text/html;\r\n\tcharset=utf-8`,
        'Message-Id': '<C0E8D3F3-07A7-4F40-97AB-225D4DC44627>',
        'Mime-Version': '1.0 (Mac OS X Mail 15.0 \\(3693.20.0.1.32\\))'
    })) {
        text += headerLineEncode(key, value + '\r\n')
    }

    text += mimeWordsEncode('\r\n')

    // // text = mimeEncode(text)
    // text = mimeWordsEncode(`Content-Transfer-Encoding: quoted-printable
    // Content-Type: text/html;
    // 	charset=utf-8
    // Message-Id: <C0E8D3F3-07A7-4F40-97AB-225D4DC44627>
    // Mime-Version: 1.0 (Mac OS X Mail 15.0 \\(3693.20.0.1.32\\))

    // `);



    // let html = `<style type="text/css">${getGlobalStyles(props.source).join("\n")}</style>`
    // html += getHtml(props.source).innerHTML
    // html = html.replace(/ data-v-[a-z0-9]+=""/g, '')

    text += quotedPrintableEncode(getSignatureHtml())

    // console.log(text)
    // return

    const blob = new Blob([text.replace(/\r\n/g, "\n")], { type: 'text/html' });

    // console.log(blob)
    // return

    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${props.filename}.mailsignature`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

}

const plist = computed(_ => `&lt;dict&gt;
    &lt;key&gt;SignatureIsRich&lt;/key&gt;
    &lt;true/&gt;
    &lt;key&gt;SignatureName&lt;/key&gt;
    &lt;string&gt;<span class="highlight">${props.filename}</span>&lt;/string&gt;
    &lt;key&gt;SignatureUniqueId&lt;/key&gt;
    &lt;string&gt;<span class="highlight">${props.filename}</span>&lt;/string&gt;
&lt;/dict&gt;
`)
</script>

<template>
    <div class="processor">
        <button type="button" @click="onClickDownloadMailsignature">Download .mailsignature</button>
        <button type="button" @click="onClickCopyHtml">Copy HTML Code</button>

        <template v-if="!hideInstructions">
            <h1>Installation Instructions for Apple Mail Signature</h1>
            <ol>
                <li>Close Apple Mail.</li>
                <li>Place this file in <code>/Users/<span class="highlight">&lt;User&gt;</span>/Library/Mail/V<span class="highlight">&lt;VersionNumber&gt;</span>/MailData/Signatures</code>.</li>
                <li>Open the file <code>AllSignatures.plist</code> in the same folder.</li>
                <li>Add the following value at the end of the array (before &lt;/array&gt;):
                <pre><code v-html="plist"></code></pre></li>
                <li>Save the <code>AllSignatures.plist</code> file, close it, and lock it via the file's information dialog (select the file → <span class="key">cmd</span> + <span class="key">i</span> → check the "Locked" checkbox).</li>
                <li>Open Apple Mail.</li>
                <li>Unlock the <code>AllSignatures.plist</code> file.</li>
                <li>You will find the signature in the Apple Mail settings under "Signatures," where you can assign it to your account and possibly set it as the default.</li>
            </ol>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.processor {
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 4px solid black;
    border-bottom: 4px solid black;
    background-color: rgb(241, 241, 241);
    border-radius: 1em;
    padding: 1em;
    margin-bottom: .5em;

    *,
    button {
        font-family: monospace;
    }

    button {
        background: transparent;
        padding: .25em .5em;
        border-radius: 100em;
        box-shadow: 1px 1px 0px 1px #000000;
        transition: box-shadow .15s ease;
        margin-right: 1em;

        &:focus-within {
            box-shadow: 1px 1px 0px -1px #000000;

        }
    }

    h1 {
        font-weight: normal;
        font-size: 1.5em;
        margin: .67em 0;
    }

    :deep(.highlight) {
        background-color: var(--app-highlight-color, rgba(69, 239, 131, .75));
    }

    .key {
        display: inline-block;
        border-radius: .25em;
        background-color: rgba(0, 0, 0, .75);
        color: white;
        margin: -.15em 0;
        padding: .15em .25em;
    }
}
</style>
