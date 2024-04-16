[![Node version](https://img.shields.io/npm/v/vuemailsignatureconverter)](https://www.npmjs.com/package/vuemailsignatureconverter)


# Vue Mail Signature Converter

## What is it?

The Vue Mail Signature Converter can be used to create `.mailsignature` files for **Apple Mail signatures**. The plugin comes with the `<mailSignatureEditable />` Vue component, through which the signature can be filled with custom content.

Global or scoped styles are inserted into the signature as **inline CSS**. **Responsive layouts** and **web fonts** are taken into account.

## Setup

```bash
npm i vuemailsignatureconverter
```

main.js
```js
import { createApp } from 'vue'
import App from './App.vue'
import { mailSignatureConverter } from 'vueMailSignatureConverter'

createApp(App)
    .use(mailSignatureConverter) 
    .mount('#app')
```

App.vue
```vue
<script setup>
const $e = ref()
</script>

<template>
    <mailClientWindow>
        <div ref="$e">
            <mailSignatureEditable class="default" placeholder="Your name" /><br />
            <mailSignatureEditable class="default" placeholder="Your title" :list="['Dr.', 'Prof.', 'Prof. Dr.']" /><br />
            <br />
            Phone +49 123 456789-<mailSignatureEditable class="default" placeholder="Your Number" type="number" steps="1" /><br />
            <br />
            ABC Company<br />
            123 Main Street<br />
            Anytown, State<br />
            12345<br />
            United States
        </div>
    </mailClientWindow>
    <mailSignatureConverter :source="$e" />
</template>
```

## Build-in components

### `<mailSignatureEditable>`

This component allows for targeted editing of the signature. For example, your team has the opportunity to add their individual information to your signature.

#### Props

```javascript
interface mailSignatureEditableProps {
    /**
     * Specify a placeholder in case no content has been entered.
     */
    placeholder?: String
    /**
     * HTML <input> type attribute
     * Default: text
     */    
    type?: String
    /**
     * Specify a datalist dropdown. 
     * e.g. ['Dr.', 'Prof.', 'Prof. Dr.']
     * Default: false
     */       
    list: Boolean | Array
}
```

#### Placeholder via slot

```html
<mailSignatureEditable>Your name</mailSignatureEditable>
```

### `<mailSignatureConverter>`

With this component, your signature can be converted into a .mailsignature file at the push of a button and downloaded, or inserted as HTML into the clipboard. By default, instructions for implementation are included.

#### Props

```javascript
interface mailSignatureConverterProps {
    /**
     * Required. Specify source container
     */
    source: HTMLElement
    /**
     * .mailsignature Filename (without suffix)
     * Default: window.location.host (e.g. example.com)
     */    
    filename?: String
    /**
     * Disable installation instructions
     * Default: window.location.host (e.g. example.com)
     */        
    hideInstructions?: Boolean   
}
```

### `<mailClientWindow>`

Use this component as a simple mail client visualization
