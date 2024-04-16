<script setup>

import { ref, computed, watch, getCurrentInstance, shallowRef, useSlots, onMounted } from 'vue'

const $i = ref()
const slots = useSlots()

console.log(slots)


const props = defineProps({
    placeholder: {},
    type: {
        default() {
            return 'text'
        }
    },
    list: {
        type: [Boolean, Array],
        default() {
            return false
        }
    }
})

const placeholder = ref(props.placeholder)
const value = ref()
const input = ref(false)

const uid = shallowRef(getCurrentInstance().uid)
const listId = shallowRef(`editable-list-${uid.value}`)

const inputAttrs = computed(_ => {
    let a = {}

    if (props.list && props.list.length) a.list = listId.value

    return a
})

const printAttrs = computed(_ => {
    let a = {}

    if (!value.value)
        a['data-placeholder'] = placeholder.value

    return a
})

const onChange = () => {
    value.value = typeof value.value == 'string' ? value.value.toLowerCase() : value.value
}

watch(input, _input => {
    if (_input)
        setTimeout(() => {
            $i.value.focus()
        })
})

onMounted(_ => {
    if(!placeholder.value && 'default' in slots) {
        placeholder.value = slots.default()[0].children
    }
})

</script>

<template>
    <span tabindex="0" v-if="!input" @click="input = true" @focus="input = true" v-html="value" v-bind="printAttrs"></span>
    <span class="input" v-else>
        <input ref="$i" v-bind="inputAttrs" v-model="value" :placeholder="placeholder.replace(/'/g, '')"
            @blur="input = false" @focusout="input = false" :type="type" @change="onChange" />
        <datalist v-if="list && list.length" :id="listId">
            <option v-for="item of list" :value="item">{{ item }}</option>
        </datalist>
    </span>
</template>

<style scoped lang="scss">
span {
    &:not(.input) {
        &:empty {
            background-color: var(--app-highlight-color, rgba(69, 239, 131, .75));

            &::after {
                opacity: .5;
                content: attr(data-placeholder);
            }
        }
    }

}

input {
    appearance: none;
    border: 0 none;
    font-family: inherit;
    font-size: inherit;
    padding: 0;

    &:focus-visible {
        outline-color: var(--app-highlight-color, rgba(69, 239, 131, .75));
        outline-style: auto;
        outline-width: 4px;

    }
}
</style>