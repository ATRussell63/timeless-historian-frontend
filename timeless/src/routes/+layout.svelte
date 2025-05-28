<script>
	import '../app.css';
	import Sidebar from '../Sidebar.svelte';
	import TopNav from '../TopNav.svelte';
	import {Button} from '$lib/components/ui/button';
	import { cn } from '$lib/utils'
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { data_summary } from "../store";
    import { afterNavigate } from '$app/navigation';
	import ThemeSelector from '../ThemeSelector.svelte';
	import { mode, ModeWatcher } from 'mode-watcher';
	import { version } from '$app/environment';
	let { children, data } = $props();
	data_summary.set(data)

</script>
<ModeWatcher />
<div class={cn('app ' + (mode.current === 'dark' ? 'dark' : ''))}>
<TopNav></TopNav>
<div class="flex flex-row min-h-screen justify-center">
	<!-- Left Margin -->
	<div class="flex flex-col gap-5 mr-5 items-end">
		<Sidebar/>
		<ThemeSelector/>
	</div>

  <!-- Main Content -->
  <main class={cn("flex flex-col basis-1/3 max-w-[1700px] border rounded-t-xl")} style="margin-top: 0px;">
	 {@render children()}
  </main>

  <!-- Right Margin -->
  <div class="flex flex-col w-[185px]">
	
    <!-- Right margin content if needed -->
  </div>
</div>
<footer class='flex flex-row justify-center gap-2'>
	<span class='ml-auto'>Contact: timeless_auditor@gmail.com</span><span>|</span>This website is fan-made and is not affiliated with Grinding Gear Games<span>|</span><span>Fontin (PoE Font) created by <a target="_blank" rel="noopener noreferrer" href="https://www.exljbris.com">exljbris</a></span>
	<span class='ml-auto mr-3'>{version}</span>
</footer>
</div>

<style>
	.app {
		position:relative;
		overflow:hidden;
	}

	.app::before {
		content: "";
		position: absolute;
		width: 400%;
		height: 400%;
		top: -200%;
		left: -100%;
		z-index: -1;
		background-image: url('$lib/images/TH-Logo-Tiled-Offset-Gray-O.svg');
		background-color: #CCCCCC;
		background-size: 1280px 755px;
		/* background-size: 25%; */
		transform: rotate(-32deg);
	}

	.dark.app::before {
		content: "";
		position: absolute;
		width: 400%;
		height: 400%;
		top: -200%;
		left: -100%;
		z-index: -1;
		background-image: url('$lib/images/TH-Logo-Tiled-Offset-Gray-Dark.svg');
		background-color: hsl(0 0 12%);
		background-size: 1280px 755px;
		/* background-size: 25%; */
		transform: rotate(-32deg);
	}


	main {
		background-color: hsl(var(--background));
	}

	footer {
		background-color: black;
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
