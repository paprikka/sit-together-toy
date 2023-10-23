<slot />
<svelte:head>
	<meta name="theme-color" content="#000000" />
	<title>Sit (together)</title>
</svelte:head>

<style>
	:root {
		font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
		line-height: 1.5;
		font-weight: 400;

		--color-bg: black;

		--color-text-h: 30deg;
		--color-text-s: 60.98%;
		--color-text-l: 83.92%;

		--color-text: hsl(var(--color-text-h) var(--color-text-s) var(--color-text-l));

		color-scheme: light dark;
		color: var(--color-text);
		background-color: var(--color-bg);

		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;

		--layer-overlay: 100;
		--step--2: clamp(0.7038rem, 0.8082rem + -0.1348vw, 0.7813rem);
		--step--1: clamp(0.9375rem, 0.9375rem + 0vw, 0.9375rem);
		--step-0: clamp(1.125rem, 1.0815rem + 0.2174vw, 1.25rem);
		--step-1: clamp(1.35rem, 1.24rem + 0.55vw, 1.6663rem);
		--step-2: clamp(1.62rem, 1.4109rem + 1.0457vw, 2.2213rem);
		--step-3: clamp(1.9438rem, 1.5901rem + 1.7685vw, 2.9606rem);
		--step-4: clamp(2.3325rem, 1.771rem + 2.8076vw, 3.9469rem);
		--step-5: clamp(2.7994rem, 1.9433rem + 4.2804vw, 5.2606rem);
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(body, html) {
		margin: 0;
		padding: 0;
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
</style>
