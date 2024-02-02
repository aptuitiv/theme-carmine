module.exports = {
    "plugins": ["stylelint-order", "stylelint-selector-bem-pattern"],
    "extends": ["stylelint-config-standard"],
    "rules": {
        "color-named": "never",
        // Override the stylelint-config-standard rule to allow custom properties in formats that aren't kebab-case
        "custom-property-pattern": null,
        "import-notation": "string",
        "order/properties-alphabetical-order": true,
        // Set the BEM pattern rule
        "plugin/selector-bem-pattern": {
            "ignoreCustomProperties": [".*"],
            "preset": "suit",
            "utilitySelectors": "^\\.(?:[a-z][a-z-0-9]*)+$"
        },
        "selector-class-pattern": null,
        "selector-id-pattern": null
    }
}
