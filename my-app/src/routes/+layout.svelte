<script>
// import Header from './Header.svelte';
import '../app.css';
// import SideMenu from './SideMenu.svelte';
// import { Button } from 'flowbite-svelte';
import Sidebar from '../Sidebar.svelte';
import TopNav from '../TopNav.svelte';
// import {Card, CardContent} from '$lib/components/ui/card';
import {Button} from '$lib/components/ui/button';
// import TH_Logo from '$lib/images/TH-Logo-Tiled.svg'
let { children } = $props();</script>

<!-- <div class="app">


 	<TopNav></TopNav>

  	<div class="flex">

	<div class="w-1/6 p-4 flex" style='background-color: black;'>
    	<Sidebar></Sidebar>
	</div>

    <main class="w-4/6 h-screen">
	{@render children()}
	</main>
		
    <div class="w-1/6"></div>
  	</div>

  	<footer>
		<p>
			visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to learn about SvelteKit
		</p>
	</footer>

</div> -->
<div class='app pt-5'>
<TopNav></TopNav>
<div class="grid grid-cols-12 min-h-screen">
  <!-- Left Margin -->
  <div class="col-span-2 relative">
    <div class="absolute right-0 top-4">
      <Sidebar/>
    </div>
  </div>

  <!-- Main Content -->
  <main class="col-span-8 px-4 py-0 rounded-t-xl">
    <!-- Your main content here -->
	 {@render children()}
    <!-- <h1 class="text-2xl font-bold">Main Content Area</h1> -->
  </main>

  <!-- Right Margin -->
  <div class="col-span-2">
	
    <!-- Right margin content if needed -->
  </div>
</div>
</div>

<style>
	.app {
		/* display: flex; */
		/* flex-direction: column; */
		/* min-height: 100vh; */
		/* width: 100%; */
		/* background-color: primary; */
		background-image: url('$lib/images/TH-Logo-Tiled-Lavender.svg');
		background-size: 1280px 1280px;
	}

	main {
		background-color: white;
		margin-top: 20px;
		/* box-shadow: 0px 0px 14px 1px #000000; */
		/* box-shadow:
		-8px 0 8px -6px rgba(0, 0, 0, 0.5), 
		-8px 0 8px -6px rgba(0, 0, 0, 0.5),
		8px 0 8px -6px rgba(0, 0, 0, 0.5); */
	}

	/* main {
		flex: 1;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	} */

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
