module.exports = {
  content: ['./demo/index.html', './demo/app.js'],
  theme: { extend: {
    colors: {
      'scolo-navy': { DEFAULT: '#10213A', 600: '#1C3A63' },
      'scolo-gold': { DEFAULT: '#D6A23C', 600: '#B9852A' },
      'scolo-cream': { DEFAULT: '#F3EEE4', soft: '#FAF7F0', deep: '#E8E0CE' },
      'scolo-dark': '#1A1A1A',
      success: { DEFAULT: '#2F7D4F', light: '#E3F1E7' },
      warn:    { DEFAULT: '#B9852A', light: '#FBF3E1' },
      danger:  { DEFAULT: '#C1352C', light: '#F6E0DE' },
      info:    { DEFAULT: '#3A6EA5', light: '#E4EBF3' },
    },
    fontFamily: { heading: ['Montserrat', 'sans-serif'], body: ['Inter', 'sans-serif'] },
  } },
};
