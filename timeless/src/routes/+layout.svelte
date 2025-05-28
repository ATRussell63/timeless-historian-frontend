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

	let { children } = $props();

	onMount(() => {
		// get the data summary info
		async function get_data_summary() {
			try {
				const response = await fetch('http://localhost:5000/data/summary', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				});
				console.log('made the request')
				const data = { response: await response.json() };
				console.log(data)
				data_summary.set(data)
			} catch (err) {
				console.log(err)
			}
		}

		get_data_summary()
	})

</script>

<div class='app'>
<TopNav></TopNav>
<div class="flex flex-row min-h-screen justify-center">
	<!-- Left Margin -->
	<div class="flex flex-col">
		<Sidebar/>
	</div>

  <!-- Main Content -->
  <main class={cn("flex flex-col basis-1/3 max-w-[1700px] rounded-t-xl")} style="margin-top: 0px;">
	 {@render children()}
  </main>

  <!-- Right Margin -->
  <div class="flex flex-col w-[185px]">
	
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
