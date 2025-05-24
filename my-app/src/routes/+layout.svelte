<script>
import '../app.css';
import Sidebar from '../Sidebar.svelte';
import TopNav from '../TopNav.svelte';
import {Button} from '$lib/components/ui/button';

let { children } = $props();</script>

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
  <main class="col-span-8 px-6 py-4 rounded-t-xl">
    <!-- Your main content here -->
	 {@render children()}
    <!-- <h1 class="text-2xl font-bold">Main Content Area</h1> -->
  </main>

  <!-- Right Margin -->
  <div class="col-span-2">
	
    <!-- Right margin content if needed -->
  </div>
</div>
<footer>
	<p>
		Contact: timeless_auditor@gmail.com | This website is not fan-made and not affiliated with Grinding Gear Games | Fontin (PoE Font) created by <a href="https://www.exljbris.com">exljbris</a>
	</p>
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
	}

	footer {
		background-color: #0D0D0D;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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
