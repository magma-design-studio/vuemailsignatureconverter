import { defineAsyncComponent } from 'vue'

export const mailSignatureConverter = (app) => {
  app.component(
    "mailSignatureConverter",
    defineAsyncComponent(() => import("./components/converter.vue"))
  )

  app.component(
    "mailSignatureEditable",
    defineAsyncComponent(() => import("./components/editable.vue"))
  )
}