module.exports = {
    "parser": "babel-eslint",
    "plugins": [ "react" ],
    "env": {
	"browser": true,
	"es6": true,
	"node": true
    },
    "parserOptions": {
	"ecmaFeatures": {
	    "arrowFunctions": true,
	    "blockBindings": true,
	    "classes": true,
	    "defaultParams": true,
	    "destructuring": true,
	    "forOf": true,
	    "generators": true,
	    "modules": true,
	    "spread": true,
	    "templateStrings": true,
	    "jsx": true
	}
    },
    "rules": {
	"consistent-return": [0],
	"key-spacing": [1],
	"quotes": [0],
	"new-cap": [0],
	"no-multiple-empty-lines": [1, {"max": 2}],
	"no-multi-spaces": [2 , {
	    "exceptions": {
	        "VariableDeclarator": true
	    }	     
        }],	
	"no-shadow": [0],
	"padded-blocks": [1, "never"],
	"no-unused-vars": [1],
	"no-use-before-define": [2, "nofunc"],
	"react/jsx-no-undef": 1,
	"react/jsx-uses-react": 1,
	"react/jsx-uses-vars": 1
    }
};
