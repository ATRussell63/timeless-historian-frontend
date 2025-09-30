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
	import KofiIcon from '$lib/images/Ko-fi_icon.png';
	import { getAccessCode } from '$lib/oauth';
	import { getAccountName, getAccountLeagues, getLeagueStashList } from '$lib/api';
	import { account_name, account_leagues } from '../store';

	let { children, data } = $props();
	data_summary.set(data)

	onMount(async () => {
		// referred from ggg oauth authorization
		const oauth_code = $page.url.searchParams.get('code');
		const oauth_state = $page.url.searchParams.get('state');
		if (oauth_code && oauth_state) {
			if (oauth_state !== localStorage.getItem('oauth_state')) {
				console.log(`ERROR: oauth_state received does not match stored value. Received state: ${oauth_state}`)
			}
			else {
				console.log('Received oauth code')
				console.log(oauth_code)
				getAccessCode(oauth_code)
			}
		}

		localStorage.setItem('access_token', '87d5c62513a2071d090ab9b1432daeeb2c15d563');
		localStorage.setItem('token_exp', Date.now() + 36000)

		// verify that token has not expired yet
		if (localStorage.getItem('token_exp') < Date.now()) {
			console.log('Access token is expired, clearing storage.')
			localStorage.removeItem('token_exp')
			localStorage.removeItem('access_token')
			localStorage.removeItem('account_name')
		} else if (localStorage.getItem('account_name') === null) {
			// token is not expired but we haven't populated the account data yet
			let acc_name = await getAccountName()
			console.log('Account name received is ' + acc_name)
			localStorage.setItem('account_name', acc_name)

			// TODO - get all stashes
			// populate leagues so there's no delay on bulk page
			

			// let stashes = await getLeagueStashList(acc_leagues)
			// stash_data.set(stashes)
			// localStorage.setItem('stash_data', stashes)
			// console.log('Account Stashes:')
			// console.log(stashes)
		}

		account_name.set(localStorage.getItem('account_name'))

		let acc_leagues = await getAccountLeagues()
		console.log('Account leagues: ')
		console.log(acc_leagues)
		account_leagues.set(acc_leagues)
		localStorage.setItem('account_leagues', acc_leagues)
	})

</script>
<ModeWatcher disableTransitions={false} />
<div class={cn('app ' + (mode.current === 'dark' ? 'dark' : ''))}>

<div class="flex flex-row min-h-screen justify-center">
	<!-- Left Margin -->
	<div class="flex flex-col gap-5 mr-5 items-end mt-[78px]">
		<Sidebar/>
		<ThemeSelector/>
	</div>

  <!-- Main Content -->
   <div class='flex flex-col basis-1/3 max-w-[1700px]'>
  <TopNav></TopNav>
  <main class={cn("flex flex-col border rounded-t-xl h-full")} style="margin-top: 0px;">
	
	 {@render children()}
  </main>
   </div>

  <!-- Right Margin -->
  <div class="flex flex-col w-[203px]">
	
    <!-- Right margin content if needed -->
  </div>
</div>
<footer class='flex flex-row justify-center gap-2'>
	<span class='ml-auto'>Copyright © 2025 Aaron Russell</span>
	<span>|</span>
	<span>Contact: timeless_auditor@gmail.com</span>
	<span>|</span>
	<a target="_blank" rel="noopener noreferrer" href="https://ko-fi.com/timelesshistorian">
		<div class='flex flex-row gap-1 items-center'>
		<img class='w-4 h-4' alt='kofi' src={KofiIcon}/>Support the site on Ko-fi
		</div>
	</a>
	<span>|</span>
	<span>This website is fan-made and is not affiliated with Grinding Gear Games</span>
	<span>|</span>
	<span class='mr-auto'>Fontin (PoE Font) created by <a target="_blank" rel="noopener noreferrer" href="https://www.exljbris.com">exljbris</a></span>
	<!-- <span class='absolute mr-3'>{version}</span> -->
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
		background-color: #666666;
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
