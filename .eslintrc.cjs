module.exports = {
	root: true,
	env: {
		node: true
	},
	"extends": [
		"plugin:vue/vue3-essential",
		"eslint:recommended",
		"@vue/typescript/recommended",
	],
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		"array-bracket-newline": [
			"warn",
			"always",
		],
		"array-element-newline": [
			"warn",
			"always",
		],
		"array-bracket-spacing": [
			"warn",
			"never",
		],
		"arrow-body-style": [
			"warn",
			"always",
		],
		"arrow-parens": [
			"warn",
			"always",
		],
		"brace-style": [
			"warn",
			"allman",
		],
		"camelcase": [
			"warn",
			{
				"properties": "always" 
			},
		],
		"comma-dangle": [
			"warn",
			{
				"arrays": "always",
				"objects": "ignore",
				"imports": "never",
				"exports": "never",
				"functions": "never"
			},
		],
		"comma-spacing": [
			"warn",
			{
				"before": false,
				"after": true 
			},
		],
		"dot-location": [
			"warn",
			"property",
		],
		"indent": [
			"warn",
			"tab",
		],
		"implicit-arrow-linebreak": [
			"warn",
			"beside",
		],
		"jsx-quotes": [
			"warn",
			"prefer-double",
		],
		"key-spacing": [
			"warn",
			{
				"afterColon": true,
				"beforeColon": false 
			},
		],
		"keyword-spacing": [
			"warn",
			{
				"before": true 
			},
		],
		"lines-between-class-members": [
			"warn",
			"always",
		],
		"line-comment-position": [
			"warn",
			{
				"position": "above" 
			},
		],
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-duplicate-imports": "warn",
		"no-mixed-spaces-and-tabs": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-trailing-spaces": process.env.NODE_ENV === "production" ? "error" : "off",
		"object-curly-newline": [
			"warn",
			{
				"ObjectExpression": "always",
				"ImportDeclaration": "never",
				"ExportDeclaration": {
					"multiline": true, "minProperties": 3 
				}
			},
		],
		"quotes": [
			"warn",
			"double",
		],
		"vue/array-bracket-newline": [
			"warn",
			{
				"minItems": 1 
			},
			
		],
		"vue/array-bracket-spacing": [
			"warn",
			"never",
		],
		"vue/comma-dangle": [
			"warn",
			{
				"arrays": "always",
				"objects": "never",
				"imports": "never",
				"exports": "never",
				"functions": "never"
			},
		],
		"vue/comma-spacing": [
			"warn",
			{
				"before": false,
				"after": true 
			},
		],
		"vue/component-definition-name-casing": [
			"warn",
			"PascalCase",
		],
		"vue/component-name-in-template-casing": [
			"warn",
			"PascalCase",
			{
				"registeredComponentsOnly": false,
				"ignores": [
				]
			},
		],
		"vue/component-tags-order": [
			"warn",
			{
				"order": [
					[
						"script",
						"template", 
					],
					"style", 
				]
			},
		],
		"vue/html-closing-bracket-spacing": [
			"error",
			{
				"startTag": "never",
				"endTag": "never",
				"selfClosingTag": "never"
			},
		],
		"vue/html-indent": [
			"warn",
			"tab",
			{
				"attribute": 1,
				"baseIndent": 1,
				"closeBracket": 0,
				"alignAttributesVertically": true,
				"ignores": [
				]
			},
		],
		"vue/html-self-closing": [
			"warn",
			{
				html: {
					normal: "never",
					void: "always"
				},
				"svg": "always",
				"math": "always"
			},
		],
		"vue/html-quotes": [
			"warn",
			"double",
			{
				"avoidEscape": false 
			}, 
		],
		"vue/key-spacing": [
			"warn",
			{
				"afterColon": true,
				"beforeColon": false 
			},
		],
		"vue/keyword-spacing": [
			"warn",
			{
				"before": true 
			},
		],
		"vue/max-len": [
			"warn",
			{
				"code": 124,
				"comments": 124,
				"template": 124,
				"tabWidth": 4,
				"ignoreComments": false,
				"ignoreHTMLAttributeValues": false,
				"ignoreHTMLTextContents": false,
				"ignorePattern": "",
				"ignoreRegExpLiterals": false,
				"ignoreStrings": false,
				"ignoreTrailingComments": false,
				"ignoreTemplateLiterals": false,
				"ignoreUrls": false
			},
		],
		"vue/max-attributes-per-line": [
			"warn",
			{
				"singleline": {
					"max": 4
				},      
				"multiline": {
					"max": 5
				}
			},
		],
		"vue/multiline-html-element-content-newline": [
			"warn",
			{
				"ignoreWhenEmpty": true,
				"ignores": [
				],
				"allowEmptyLines": true
			},
		],
		"vue/mustache-interpolation-spacing": [
			"warn",
			"always",
		],
		"vue/no-useless-v-bind": [
			"warn",
			{
				"ignoreIncludesComment": false,
				"ignoreStringEscape": false
			},
		],
		"vue/no-spaces-around-equal-signs-in-attribute": [
			"warn",
		],
		"vue/padding-line-between-blocks": [
			"warn",
			"always",
		],
		"vue/padding-line-between-tags": [
			"warn",
			[
				{
					"blankLine": "always",
					"prev": "*",
					"next": "*" 
				},
			],
		],
		"vue/padding-lines-in-component-definition": [
			"warn",
			{
				"betweenOptions": "always"			
			},
		],
		"vue/require-direct-export": [
			"warn",
			{
				"disallowFunctionalComponentFunction": false
			},
		],
		"vue/require-name-property": 1,
		"vue/script-indent": [
			"warn",
			"tab",
			{
				"baseIndent": 1,
				"switchCase": 1,
				"ignores": [
				]
			},
		],
		"vue/this-in-template": [
			"error",
			"never",
		],
		"vue/v-for-delimiter-style": [
			"warn",
			"in",
		],
		semi: [
			"warn",
			"always",
		],
		"@typescript-eslint/ban-types": [
			"warn",
		],
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/no-empty-function": [
			"warn",
		]
	},
	overrides: [
		{
			"files": [
				"**/__tests__/*.{j,t}s?(x)",
				"**/tests/unit/**/*.spec.{j,t}s?(x)",
				"*.vue",
			],
			"env": {
			},
			"rules": {
				"indent": "off"
			}
		},
	]
};
