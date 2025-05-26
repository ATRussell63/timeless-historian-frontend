<script>
import '../app.css';
import Sidebar from '../Sidebar.svelte';
import TopNav from '../TopNav.svelte';
import {Button} from '$lib/components/ui/button';

let { children } = $props();</script>

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
  <main class="col-span-8 px-6 pt-3 rounded-t-xl" style='margin-top: 0px;'>
    <!-- Your main content here -->
	 {@render children()}
    <!-- <h1 class="text-2xl font-bold">Main Content Area</h1> -->
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
		margin-top: 20px;
		background-image: url('$lib/images/EternalSymbol.svg');
		background-size: 180% 180%;
		background-position: bottom 50% left 50%;
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
