<script>
	import '../app.css';
	import Sidebar from '../Sidebar.svelte';
	import TopNav from '../TopNav.svelte';
	import {Button} from '$lib/components/ui/button';
	import { cn } from '$lib/utils'
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import VaalSymbol from '$lib/images/VaalSymbol.svg?url'
	import EternalSymbol from '$lib/images/EternalSymbol.svg?url'
	import TemplarSymbol from '$lib/images/TemplarSymbol.svg?url'
	import KaruiSymbol from '$lib/images/KaruiSymbol.svg?url'
	import MarakethSymbol from '$lib/images/MarakethSymbol.svg?url'
    import { afterNavigate } from '$app/navigation';

	let { children } = $props();

	const isAbout = $page.url.pathname.startsWith('/about');

	const backgroundZoom = isAbout ? '120%' : '120%';
	let backgroundURL = $state(KaruiSymbol);

	afterNavigate(() => {
		// randomize background url
		// console.log(backgroundURL);
		// const urls = [EternalSymbol, KaruiSymbol, MarakethSymbol, TemplarSymbol, VaalSymbol]
		// backgroundURL = urls[Math.floor(Math.random() * urls.length)];
		// console.log(backgroundURL);
	})

	

</script>

<div class='app'>
<TopNav></TopNav>
<div class="grid grid-cols-12 min-h-screen">
  <!-- Left Margin -->
  <div class="col-span-2 relative">
    <div class="absolute right-0">
      <Sidebar/>
    </div>
  </div>

  <!-- Main Content -->
  <main class={cn("col-span-8 px-6 pt-3 rounded-t-xl")} style="margin-top: 0px; background-size: {backgroundZoom} {backgroundZoom}; background-image: url({backgroundURL});">
	 {@render children()}
  </main>

  <!-- Right Margin -->
  <div class="col-span-2">
	
    <!-- Right margin content if needed -->
  </div>
</div>
<footer class='flex flex-row justify-center gap-2'>
	<span>Contact: timeless_auditor@gmail.com</span><span>|</span>This website is fan-made and is not affiliated with Grinding Gear Games<span>|</span><span>Fontin (PoE Font) created by <a target="_blank" rel="noopener noreferrer" href="https://www.exljbris.com">exljbris</a></span>
</footer>
</div>

<style>
	.app {
		background-image: url('$lib/images/TH-Logo-Tiled-Lavender.svg');
		background-size: 1280px 1280px;
	}

	main {
		background-color: white;
		/* background-image: url('$lib/images/KaruiSymbol.svg'); */
		/* background-size: 120% 120%; */
		background-position: bottom 100% left 50%;
	}

	footer {
		background-color: #0D0D0D;
		display: flex;
		padding: 8px;
		font-size: 12px;
		color: white;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 8px 0;
		}
	}
</style>
