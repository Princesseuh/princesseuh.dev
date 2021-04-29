const plugin = require('tailwindcss/plugin')

module.exports = {
  mode: 'jit',
  purge: [
    '**/*.njk',
    'safelist.txt'
  ],
  corePlugins: {
    preflight: false,

    // We disable those because they add stuff to the CSS file even when unused
    filter: false,
    ringWidth: false,
    ringColor: false,
    ringOffsetWidth: false,
    ringOffsetColor: false,
    boxShadow: false
  },
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px"
    },
    extend: {
      colors: {
        // This should have been included in Tailwind...
        inherit: 'inherit',

        // Theme
        // Color Names from colornames.org unless too long
        'sugar-cane': '#FEFFFE', // Main text color
        'creative-work': '#D8D9D8', // Used for subtle texts
        'baltic-sea': '#28262C', // Main background color
        'darker-skylines': '#211f24', // Footer background color
        'fin-lanka': '#201e24', // Alternative background color, used for footnotes and blockquotes
        'engineer-black': '#1f1f1f', // Background color used for code blocks
        'beach-watermelon': "#E46370", // Accent color, used mainly for links
        'pinky-unicorny': "#F291A0", // Alt Accent Color, used when links are hovered
      },
      width: {
        header: "min(1040px, 100%)",
        footer: "min(980px, 100%)",
        index: "min(880px, 100%)",
        articleList: "min(920px, 100%)",
        article: "min(800px, 100%)",
        wiki: "min(1280px, 100%)"
      },
      gridTemplateColumns: {
        wiki: '16% 61% 17%'
      }
    }
  },

  plugins: [
    plugin(function({ addComponents, theme }) {
      addComponents({
        '.header-link': {
          color: theme("colors.inherit"),
          marginRight: '1rem',
          '&:hover': {
            textDecoration: 'none'
          },
        },
        '.wiki-navigation': {
          "& > li": {
            marginBottom: "1rem"
          }
        },
        // TODO: Figure out a way to simplify this perhaps?
        '.cover-title': {
          position: 'absolute',
          color: theme("colors.sugar-cane"),
          bottom: '0',
          margin: '0',
          width: '100%',
          textAlign: 'center',
          fontSize: theme('fontSize.3xl'),
          lineHeight: '180px',
          // When applied through the CSS-in-JS syntax, opacity information doesn't stay on colors
          "@apply bg-pinky-unicorny bg-opacity-80 transition-opacity": {},
          opacity: '0',
          borderRadius: theme('borderRadius.sm'),
          '&:hover': {
            opacity: '100',
          }
        },
        '.social-icon': {
          color: 'inherit',
          width: "26px",
          height: "26px",
          display: "inline-block",
          marginRight: "1.2em",
        },
        '.social-twitter': {
          '&:hover': {
            color: "#1DA1F2"
          }
        },
        '.social-other': {
          '&:hover': {
            color: "#d8d9d8"
          }
        },
        '.toc': {
          transition: 'opacity .1s linear',
          position: 'sticky',
          top: "2rem",
          '& ol': {
            listStyleType: "none",
            margin: "0",
            padding: "0",
          },
          '& li > ol': {
            paddingLeft: '0.75rem',
            borderLeft: '1px solid rgba(146,149,152,.15)'
          },
          '& a': {
            color: theme("colors.creative-work")
          }
        }

      });
    }),
    plugin(function ({ addBase, theme }) {
      addBase({
        // Small reset, preflight include a lot of stuff we don't use so let's make our own
        '*, ::before, ::after': {
          boxSizing: 'border-box',

          // Border stuff needed for Tailwind's borders properties
          borderWidth: '0',
          borderStyle: 'solid',
          borderColor: '#e5e7eb'
        },

        'html': {
          lineHeight: '1.5'
        },

        'body, dl, dd, p': {
          margin: '0'
        },

        ':root': {
          "-moz-tab-size": '4',
          tabSize: '4'
        },

        // Custom stuff
        'a': {
          textDecoration: 'none',
          color: theme('colors.beach-watermelon'),
          transition: 'color .1s',
          '&:hover': {
            textDecoration: 'underline',
            textDecorationOffset: '3px',
            color: theme('colors.pinky-unicorny')
          }
        },

        'h1, h2, h3, h4, h5': {
          letterSpacing: '-.01em'
        },

        'dt': { fontWeight: 'bold' },
        'dd:not(:last-of-type)': {
          marginBottom: '1rem'
        },

        // Articles
        'article': {
          marginBottom: "3rem",
          transition: "opacity .1s linear"
        },

        '.post > *': {
          maxWidth: theme('width.article'),
          margin: '0 auto'
        },

        'article p, .post p, .post ul, .post pre': {
          marginBottom: '1em'
        },

        '.post > h1, .post > h2': {
          marginTop: '1.3rem',
          marginBottom: '.6rem'
        },

        '.post > h3': {
          marginBottom: '.6rem'
        },

        '.post li>p': {
          marginBottom: '.6rem'
        },

        '.post figure': {
          marginTop: '1.4rem',
          marginBottom: '1rem',
          maxWidth: '100%',
          textAlign: 'center'
        },

        '.post img': {
          maxWidth: "100%",
          height: "auto"
        },

        '.post figcaption': {
          textAlign: 'center',
          display: 'block',
          margin: '.15rem 0',
          fontStyle: 'italic',
          color: theme("colors.creative-work"),
          fontSize: '.95rem'
        },

        '.post > iframe': {
          margin: '0 auto 1rem',
          display: 'block'
        }
      })
    })

  ],
}
