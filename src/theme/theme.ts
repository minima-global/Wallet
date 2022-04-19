import ManropRegular from './Manrope-Regular.woff2';
import FrostedBlue from './frosted-blue.jpg';
import uiBackground from '../assets/images/LM.jpeg';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
let theme = createTheme({
    palette: {
        primary: {
            main: '#317aff',
        },
        secondary: {
            main: '#ff512f',
        },
        background: {
            default: 'rgba(22, 24, 28, 0.05)',
        },
        text: {
            primary: '#363a3f',
        },
        warning: {
            main: '#fdefbe',
        },
        success: {
            main: '#b6f4ee',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
        error: {
            main: 'rgb(211, 47, 47)',
        },
        darkBlack: { main: '#0D0E10' },
        menu: { main: 'rgba(255, 255, 255, 0.95)' },
    },
    typography: {
        fontFamily: ['Manrope-regular'].join(','),
        h4: {
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '27px',
            letterSpacing: '0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1,
        },
        h1: {
            fontSize: 52,
        },
        h6: {
            fontWeight: 300,
            fontSize: 16,
        },
        body1: {
            fontSize: 17,
            fontWeight: 300,
            lineHeight: 1.04,
        },
    },
    shape: {
        borderRadius: 8,
    },

    spacing: 8,

    components: {
        MuiCssBaseline: {
            styleOverrides: `
            @font-face {
                font-family: Manrope-regular;
                src: url(${ManropRegular}) format('woff2');
            },
            body {
                background-image: url(${uiBackground});
                background-size: cover;
            }
          `,
        },
    },
});

theme = createTheme(theme, {
    components: {
        MuiSelect: {
            styleOverrides: {
                root: {
                    paddingTop: 14,
                    paddingBottom: 14,
                    backgroundColor: '#fff'
                }
            }
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    "&:last-child": {
                        paddingBottom: 16
                      }
                }
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FDBEBE',
                    color: '#363A3F',
                    fontWeight: 400,
                    padding: 5,
                    margin: 0,
                    
                    '&$error': {
                        color: 'black'
                    },
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0
                },
                "&$error": {
                    color: 'black'
                }
            },
            root: {
                "&$error": {
                    color: 'black'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    fontSize: '1rem',
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 800,
                    letterSpacing: 1,
                    lineHeight: '21px',
                    minHeight: 44,
                    '&:hover': {
                        backgroundColor: '#0D55D9'
                    },
                    '&:disabled': {
                        backgroundColor: '#5A94FF',
                        color: '#fff'
                    }
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.text.primary,

                },
            },
        },
        
        MuiDrawer: {
            styleOverrides: {
                paperAnchorLeft: {
                    backgroundColor: theme.palette.menu.main,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: 8,
                    input: {
                        paddingLeft: 16,
                        borderRadius: 8,
                        fontWeight: '400',
                        fontSize: '1rem',
                        textOverflow: 'ellipsis',
                        paddingRight: 16,

                        '&::placeholder': {
                            color: '#91919D',
                            fontSize: '1rem',
                            fontWeight: '100',

                        },
                        '&:focus': {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                        },


                    },

                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 8,
                    minHeight: 64,

                }
            }
        },
        MuiListSubheader: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    paddingBottom: 0
                }
            }
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    paddingLeft: 0,
                    paddingRight: 0,
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                root: {
                    '&:focus': {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                    }
                },
            },
        }
    },
});

export default theme;

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: React.CSSProperties['color'];
        };
    }

    interface Palette {
        neutral: Palette['primary'];
        darkBlack: Palette['primary'];
        menu: Palette['primary'];
    }
    interface PaletteOptions {
        neutral: PaletteOptions['primary'];
    }

    interface PaletteColor {
        darker?: string;
    }
    interface SimplePaletteColorOptions {
        darker?: string;
    }

    interface PaletteOptions {
        darkBlack?: PaletteOptions['primary'];
        menu?: PaletteOptions['primary'];
    }
}
