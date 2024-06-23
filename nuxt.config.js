const os = require('os')
const networkInterfaces = os.networkInterfaces()

const getLocalExternalIp = () => {
  for (const interfaceName in networkInterfaces) {
    const addresses = networkInterfaces[interfaceName]
    for (const i in addresses) {
      const address = addresses[i]
      if (address.family === 'IPv4' && !address.internal) {
        return address.address
      }
    }
  }
  return 'localhost'
}

const localIp = getLocalExternalIp()
const apiUrl = `http://${localIp}:3000`

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  server: {
    host: '0.0.0.0',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'my-nuxt-server',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'bootstrap/dist/css/bootstrap.css',
    '@fortawesome/fontawesome-free/css/all.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
  ],

  axios: {
    baseURL: apiUrl,
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  target: 'static',

  serverMiddleware: [
    { path: '/api', handler: '~/api/index.js' }
  ],

  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'index',
          path: '/',
          component: resolve(__dirname, 'pages/index.vue')
        },
        {
          name: 'upload',
          path: '/upload',
          component: resolve(__dirname, 'pages/Upload.vue')
        },
        {
          name: 'download',
          path: '/download',
          component: resolve(__dirname, 'pages/Download.vue')
        }
      )
    }
  }
}
