<slot />

<style>
	:root {
		font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
		line-height: 1.5;
		font-weight: 400;

		color-scheme: light dark;
		color: white;
		background-color: black;

		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;

		--layer-overlay: 100;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(body, html) {
		margin: 0;
		padding: 0;
	}
</style>
