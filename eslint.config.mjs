import globals from 'globals';

export default [
    {
        files: ['src/*.js'],
        languageOptions: {
            ecmaVersion: 5,
            sourceType: 'script',
            globals: {
                ...globals.browser,
                L:      'readonly',
                UTM:    'readonly',
                UTMREF: 'readonly',
                QTH:    'readonly',
                NAC:    'readonly',
            }
        },
        rules: {
            'no-undef':       'error',
            'no-unused-vars': ['warn', { varsIgnorePattern: '^(UTM|UTMREF|QTH|NAC)$' }],
            'eqeqeq':         'error',
        }
    },
    {
        files: ['Gruntfile.js'],
        languageOptions: {
            ecmaVersion: 2015,
            sourceType: 'commonjs',
            globals: globals.node
        }
    }
];
