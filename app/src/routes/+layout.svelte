<script>
	import "../app.css";
	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { derived } from "svelte/store";
	import { size_breakpoint } from "../store";
	import { afterNavigate } from "$app/navigation";
	import ThemeSelector from "../ThemeSelector.svelte";
	import { mode, ModeWatcher } from "mode-watcher";
	import { version } from "$app/environment";
	import KofiIcon from "$lib/images/Ko-fi_icon.png";
	import { getAccessCode } from "$lib/oauth";
	import { SvelteToast } from "@zerodevx/svelte-toast";
	import Sidebar from "../Sidebar.svelte";
	import TopNav from "../TopNav.svelte";
	import MobileNavMenu from "../mobileNavMenu.svelte";

	import {
		getAccountName,
		getAccountLeagues,
		getLeagueStashList,
	} from "$lib/api";
	import { account_name, account_leagues, logout } from "../store";
	import { getPageBreakpoint, isMobile } from "$lib/breakpoints";

	let { children } = $props();

	let mounted = $state(false);

	onMount(async () => {
		const setBP = () => {
			size_breakpoint.set(getPageBreakpoint());
		};

		setBP();
		window.addEventListener("resize", setBP);
		mounted = true;

		if (!import.meta.env.PROD) {
			localStorage.setItem(
				"access_token",
				"a29dde2ee00d4b9a958b6fc09343e5f74c4e0131",
			);
			localStorage.setItem("token_exp", Date.now() + 36000);

			return () => {
				window.removeEventListener("resize", setBP);
			};
		}

		const oauth_code = $page.url.searchParams.get("code");
		const oauth_state = $page.url.searchParams.get("state");
		const storedToken = localStorage.getItem("token_exp");
		const isExpired = storedToken && parseInt(storedToken) < Date.now();
		const hasAccount = localStorage.getItem("account_name") !== null;

		if (!isExpired && hasAccount) {
			account_name.set(localStorage.getItem("account_name"));
			let leagues = localStorage.getItem("account_leagues");
			console.log(leagues)
			account_leagues.set(leagues);
			return () => {
				window.removeEventListener("resize", setBP);
			};
		}

		if (oauth_code && oauth_state) {
			if (oauth_state === localStorage.getItem("oauth_state")) {
				await getAccessCode(oauth_code);
			} else {
				console.error("OAuth state mismatch");
				return () => {
					window.removeEventListener("resize", setBP);
				};
			}
		}

		if (!isExpired) {
			try {
				let acc_name = await getAccountName();
				localStorage.setItem("account_name", acc_name);
				account_name.set(acc_name);
			} catch (e) {
				console.error("Failed to fetch account details", e);
			}
			try {
				let leagues = await getAccountLeagues();
				console.log('got leagues from getAccountLeagues')
				console.log(leagues)
				localStorage.setItem("account_leagues", leagues);
				account_leagues.set(leagues);
			} catch (e) {
				console.error("failed to fetch leagues", e)
			}
		} else {
			logout();
		}

		return () => {
			window.removeEventListener("resize", setBP);
		};
	});

</script>

<ModeWatcher disableTransitions={false} />
{#if mounted}
<div class={cn("app " + (mode.current === "dark" ? "dark" : ""))}>
	{#if isMobile($size_breakpoint)}
		<MobileNavMenu />
	{/if}
	<div class="flex flex-row min-h-screen justify-center">
		<!-- Left Margin -->
		{#if !isMobile($size_breakpoint)}
			<div class="flex flex-col sm:gap-2 lg:gap-2 sm:mr-0 lg:ml-2 items-end mt-[78px]">
				<Sidebar />
				<ThemeSelector />
			</div>
		{/if}

		<!-- Main Content -->
		<div
			class="flex flex-col basis-1/3 grow px-2 w-full sm:max-w-[550px] md:max-w-[700px] lg:max-w-[850px] xl:min-w-[1000px] 2xl:min-w-[1400px]"
		>
			{#if !isMobile($size_breakpoint)}
				<TopNav />
			{/if}
			<main
				class={cn("flex flex-col border rounded-t-xl h-full w-full")}
				style="margin-top: 0px;"
			>
				{@render children()}
				<SvelteToast />
			</main>
		</div>

		<!-- Right Margin -->
		<div class="flex flex-col lg:w-[203px]">
			<!-- Right margin content if needed -->
		</div>
	</div>
	{#if isMobile($size_breakpoint)}
		<footer class="flex flex-row justify-center gap-2">
			<div class="flex flex-col gap-1">
				<div class="flex flex-row text-[10px] gap-1">
					<span class="">Copyright © 2025 Aaron Russell</span>
					<span>|</span>
					<span>Contact: timeless_auditor@gmail.com</span>
				</div>
				<div class="flex flex-row text-[10px] gap-1">
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://ko-fi.com/timelesshistorian"
					>
						<div class="flex flex-row gap-1 items-center">
							<img
								class="w-4 h-4"
								alt="kofi"
								src={KofiIcon}
							/>Support the site on Ko-fi
						</div>
					</a>
					<span>|</span>
					<span class="mr-auto"
						>Fontin (PoE Font) created by <a
							target="_blank"
							rel="noopener noreferrer"
							href="https://www.exljbris.com">exljbris</a
						></span
					>
				</div>
				<div class="flex flex-row text-[10px]">
					<span
						>This website is fan-made and is not affiliated with
						Grinding Gear Games</span
					>
				</div>
			</div>
		</footer>
	{:else}
		<footer class="flex flex-row justify-center gap-2">
			<span>Copyright © 2025 Aaron Russell</span>
			<span>|</span>
			<span>Contact: timeless_auditor@gmail.com</span>
			<span>|</span>
			<a
				target="_blank"
				rel="noopener noreferrer"
				href="https://ko-fi.com/timelesshistorian"
			>
				<div class="flex flex-row gap-1 items-center">
					<img class="w-4 h-4" alt="kofi" src={KofiIcon} />Support the
					site on Ko-fi
				</div>
			</a>
			<span>|</span>
			<span
				>This website is fan-made and is not affiliated with Grinding
				Gear Games</span
			>
			<span>|</span>
			<span
				>Fontin (PoE Font) created by <a
					target="_blank"
					rel="noopener noreferrer"
					href="https://www.exljbris.com">exljbris</a
				></span
			>
			<!-- <span class='absolute mr-3'>{version}</span> -->
		</footer>
	{/if}
</div>
{/if}

<style>
	.app {
		position: relative;
		overflow: hidden;
	}

	.app::before {
		content: "";
		position: absolute;
		width: 400%;
		height: 400%;
		top: -200%;
		left: -100%;
		z-index: -1;
		background-image: url("$lib/images/TH-Logo-Tiled-Offset-Gray-O.svg");
		background-color: #666666;
		background-size: 1280px 755px;
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
		background-image: url("$lib/images/TH-Logo-Tiled-Offset-Gray-Dark.svg");
		background-color: hsl(0 0 12%);
		background-size: 1280px 755px;
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
