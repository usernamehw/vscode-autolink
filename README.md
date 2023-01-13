![Version](https://img.shields.io/visual-studio-marketplace/v/usernamehw.autolink)
![Installs](https://img.shields.io/visual-studio-marketplace/i/usernamehw.autolink)
![Rating](https://img.shields.io/visual-studio-marketplace/r/usernamehw.autolink)

Match links in document with external location.

## Example

```js
"autolink.queries": [
    {
        "linkPattern": "github#(\\d{1,6})",// RegExp. Will match `github#202` text
        "linkText": "https://github.com/Microsoft/vscode/issues/${0}",// will replace `${0}` with matched group
    },
],
```

![demo.gif](img/demo.gif)



<!-- SETTINGS_START -->
## Settings (1)

|Setting|Default|Description|
|-|-|-|
|autolink.queries|\[\]|Make links from text in the document.|
<!-- SETTINGS_END -->