<script>
	import "../app.css";
	import { Button } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { derived } from "svelte/store";
	import { data_summary, mobile_layout } from "../store";
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

	let { children, data } = $props();
	data_summary.set(data);

	onMount(async () => {
		const isMobile = () => {
			mobile_layout.set(window.innerWidth < 640);
		};

		isMobile();
		window.addEventListener("resize", isMobile);

		const oauth_code = $page.url.searchParams.get("code");
		const oauth_state = $page.url.searchParams.get("state");

		// referred from ggg oauth authorization
		if (oauth_code && oauth_state) {
			if (oauth_state !== localStorage.getItem("oauth_state")) {
				console.log(
					`ERROR: oauth_state received does not match stored value. ${oauth_state} !== ${localStorage.getItem("oauth_state")}`,
				);
			} else {
				await getAccessCode(oauth_code);
			}
		}

		if (!import.meta.env.PROD) {
			localStorage.setItem(
				"access_token",
				"71db05ae96d7a7b40ab6ae7a0e07ca50f4dec89e",
			);
			localStorage.setItem("token_exp", Date.now() + 36000);
		}

		// verify that token has not expired yet
		if (localStorage.getItem("token_exp") < Date.now()) {
			console.log("Access token is expired, logging out.");
			logout();
		} else if (localStorage.getItem("account_name") === null) {
			// token is not expired but we haven't populated the account data yet
			let acc_name = await getAccountName();
			console.log("Account name received is " + acc_name);
			localStorage.setItem("account_name", acc_name);
		}

		account_name.set(localStorage.getItem("account_name"));

		return () => {
			window.removeEventListener("resize", isMobile);
		};
	});

</script>

<ModeWatcher disableTransitions={false} />
<div class={cn("app " + (mode.current === "dark" ? "dark" : ""))}>
	{#if $mobile_layout}
		<MobileNavMenu />
	{/if}
	<div class="flex flex-row min-h-screen justify-center">
		<!-- Left Margin -->
		{#if !$mobile_layout}
			<div class="flex flex-col gap-5 mr-5 items-end mt-[78px]">
				<Sidebar />
				<ThemeSelector />
			</div>
		{/if}

		<!-- Main Content -->
		<div
			class="flex flex-col basis-1/3 grow px-2 w-full sm:max-w-[600px] 2xl:max-w-[1700px]"
		>
			{#if !$mobile_layout}
				<TopNav></TopNav>
			{/if}
			<main
				class={cn("flex flex-col border rounded-t-xl h-full")}
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
	{#if $mobile_layout}
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
			<span class="ml-auto">Copyright © 2025 Aaron Russell</span>
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
			<span class="mr-auto"
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
