// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // devtools: { enabled: true },
  ssr:true,
  css: [
    "vuetify/lib/styles/main.sass", '@mdi/font/css/materialdesignicons.min.css'
  ],

  build: {
      transpile: ["vuetify"]
  },

  modules: [
    '@pinia/nuxt'
  ],
})
