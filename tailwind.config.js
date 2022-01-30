module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      screens: {
        tall: {
          raw: '(min-height: 600px)'
        }
      }
    }
  },
  plugins: []
}
