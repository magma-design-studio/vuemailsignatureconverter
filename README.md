# Vue Mail Signature Converter

## What is it?

The Vue Mail Signature Converter can be used to create `.mailsignature` files. The plugin comes with the `<mailSignatureEditable />` Vue component, through which the signature can be filled with custom content.

Global or scoped styles are inserted into the signature as inline CSS. Responsive layouts and web fonts are taken into account.

## Setup

```vue
<script setup>
const $e = ref()
</script>

<template>
    <div ref="$e">
        <mailSignatureEditable class="default" placeholder="Your name" /><br />
        <mailSignatureEditable class="default" placeholder="Your title" :list=['Dr.', 'Prof.', 'Prof. Dr.'] /><br />
        <br />
        Phone +49 123 456789-<mailSignatureEditable class="default" placeholder="Your title" :list=['Dr.', 'Prof.', 'Prof. Dr.'] /><br />
        <br />
        ABC Company<br />
        123 Main Street<br />
        Anytown, State<br />
        12345<br />
        United States
    </div>

    <mailSignatureConverter :source="$e" />
</template>
```

## Build-in components

### `<mailSignatureEditable>`

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
     * e.g. ['Dr.', 'Propf.', 'Prof. Dr.']
     * Default: false
     */       
    list: Boolean | Array
}
```

### `<mailSignatureConverter>`

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
