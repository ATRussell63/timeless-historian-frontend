<script>
	import DataNav from "../../DataNav.svelte";
	import { cn } from "$lib/utils";
	import { isMobile } from "$lib/breakpoints";
	import { size_breakpoint } from "../../store";
	import KalguurSymbol from "$lib/images/KalguurSymbol.svg";

	let { children } = $props();

	let backgroundStyle = $derived.by(() => {
		const bg_size = isMobile($size_breakpoint) ? '700px 700px' : '120% 120%';
		const bg_position = isMobile($size_breakpoint) ? 'top 20% right 50%' : 'bottom 110% right 60%';
		return `background-repeat: no-repeat; background-size: ${bg_size}; background-position: ${bg_position}; background-image: url(${KalguurSymbol});`
	});

</script>

<DataNav />
<div
  	class={cn("dataInsetCard flex flex-col border rounded-xl h-full mx-6 mb-2")}
	style={backgroundStyle}
>
  	{@render children()}
  	<!-- <SvelteToast /> -->
</div>