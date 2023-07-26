const renderer = new marked.Renderer();
renderer.codespan = function(text) {
	return `<code class="my-custom-class">${text}</code>`;
};
renderer.code = function(code, language, isEscaped) {
	// Check whether the given language is valid for highlight.js.
	const validLang = !!(language && hljs.getLanguage(language));
	// Highlight only if the language is valid.
	const highlighted = validLang ? hljs.highlight(code, { language }).value : code;
	// Render the highlighted code with `hljs` class.
	if (language) {
		return `<pre class="my-custom-code-class hljs ${language}" style="padding: 0;"><div style="background-color: black; color: white;"><p style="padding: 5px; margin: 0; display: flex; justify-content: space-between;">${language}<button class="copy-btn"><i class="fas fa-copy"></i></button></p></div><code class="hljs ${language}" style="padding: 15px;">${highlighted}</code></pre>`;
	} else {
		return `<pre class="my-custom-code-class" style="padding: 0;"><code class="hljs ${language}" style="padding: 15px;">${highlighted}</code></pre>`;
	}
};
renderer.link = function( href, title, text ) {
	return '<a target="_blank" href="'+ href +'" title="' + title + '">' + text + '</a>';
}

marked.setOptions({
	silent: true,
	renderer,
	highlight: function(code, lang) {
		return hljs.highlightAuto(code, [lang]).value;
	}
});