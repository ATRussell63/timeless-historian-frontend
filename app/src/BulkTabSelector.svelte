<script>
  import * as Select from "$lib/components/ui/select";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card";
  import { Label } from "$lib/components/ui/label/index.js";
  import StashBrowser from "./StashBrowser.svelte";
  import ResultsBrowser from "./ResultsBrowser.svelte";

  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { RefreshCw } from "lucide-svelte";
  import { onMount, tick } from "svelte";
  import { cn } from "$lib/utils.js";
  import { mode } from "mode-watcher";
  import { lighten } from "polished";

  import { isBright } from "$lib/utils.js";
  import { forceHidden, stashMetadata } from "./resultsBrowserStore";
  import { PUBLIC_CURRENT_LEAGUE } from "$env/static/public";
  import { parse_jewel_seed, parse_jewel_general } from "$lib/parse";
  import {
    filterUnsupportedStashTypes,
    flattenStashes,
    getAccountStashes,
    getJewelsFromStashTab,
    getAccountLeagues,
  } from "$lib/api";
  import {
    account_leagues,
    stashes_per_league,
    api_jewel_data,
    bulk_result,
    search_result,
    waiting_on_api,
    mobile_layout,
    cells_per_side
  } from "./store";

  // clear any previous search data
  bulk_result.set(null);
  search_result.set(null);

  const current_leagues = $derived(
    $account_leagues
      .filter((l) => l?.category?.id === PUBLIC_CURRENT_LEAGUE)
      .map((l) => ({ value: l.name, label: l.name })),
  );
  const other_leagues = $derived(
    $account_leagues
      .filter((l) => l?.category?.id !== PUBLIC_CURRENT_LEAGUE)
      .map((l) => ({ value: l.name, label: l.name })),
  );

  let selected_league = $state("");
  let stashes = $state("");
  let open = $state(false);
  let selected_stash = $state("");
  let triggerRef = $state(null);
  function ffToBlue(colorString) {
    // for whatever reason blue comes out of the api as 'ff'
    return colorString === "#ff" ? "#0033FF" : colorString;
  }

  async function getStashesForLeague() {
    const raw_stashes = await getAccountStashes(selected_league);
    const filtered_stashes = filterUnsupportedStashTypes(
      flattenStashes(raw_stashes),
    );
    stashes = filtered_stashes.map((s) => ({
      // if value isn't unique then multiple items highlight so we just include the id in the value
      value: s.name + " " + s.id,
      label: s.name,
      stash_obj: s,
      color: ffToBlue("#" + s?.metadata.colour),
    }));
  }

  async function selectLeagueTrigger() {
    forceHidden.set(true);
    bulk_result.set(null);

    // if we already have the stashes for the requested league we can just swap and display it
    if (stashes_per_league[selected_league]) {
      stashes = stashes_per_league[selected_league];
    } else {
      // get the stash data again and clear the selected stash
      getStashesForLeague();
      selected_stash = "";
    }
  }

  async function refreshStashData() {
    // re-fetch the stashes for the currently selected league
    if (selected_league == "") {
      // TODO - button should be disabled if league isn't selected
      return;
    } else {
      getStashesForLeague();

      if (stashes.find((s) => s.stash_obj.name === selected_stash)) {
        const s = stashes.find(
          (s) => s.stash_obj.name === selected_stash,
        ).stash_obj;
        selectStashTrigger(s, true);
      } else {
        forceHidden.set(true);
        bulk_result.set(null);
        selected_stash = "";
      }
    }
  }

  function safe_getter(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  function setPath(obj, path, value) {
    if (path.length === 0) return value;
    const [key, ...rest] = path;
    return {
      ...obj,
      [key]: setPath(obj?.[key] ?? {}, rest, value),
    };
  }

  async function bulkSearch(jewels) {
    let counter = 0;
    let request_body = jewels.map((j) => ({
      i: counter++,
      x: j.x,
      y: j.y,
      jewel_type: j.name,
      seed: parse_jewel_seed(j.explicitMods[0]),
      general: parse_jewel_general(j.explicitMods[0]),
      mf_mods:
        j.explicitMods.length == 4
          ? [j.explicitMods[1], j.explicitMods[2]]
          : [],
    }));

    let url = "/api/search/bulk";
    if (!import.meta.env.PROD) {
      url = "http://localhost:5000" + url.replace("/api", "");
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jewels: request_body }),
      });

      const data = await response.json();
      bulk_result.set(data.results);
    } catch (err) {
      console.log(err);
      // TODO maybe throw a toast or something
    }
  }

  async function selectStashTrigger(stash, force = false) {
    forceHidden.set(true);
    cells_per_side.set(stash.type === "QuadStash" ? 24 : 12);
    const s_id = stash.id;

    if (!safe_getter($api_jewel_data, selected_league + "." + s_id) || force) {
      // get the jewels from ggg
      const jewels = await getJewelsFromStashTab(selected_league, s_id);
      api_jewel_data.update((current) =>
        setPath(current, [selected_league, s_id], jewels),
      );
    }

    // get hits from backend
    if ($api_jewel_data[selected_league][s_id].length > 0) {
      bulkSearch($api_jewel_data[selected_league][s_id]);
    } else {
      bulk_result.set([]);
    }
  }

  const leagueTrigger = $derived(
    current_leagues
      .concat(other_leagues)
      .find((f) => f.value === selected_league)?.label ?? "Select a League",
  );

  const selectedValue = $derived(
    frameworks.find((f) => f.value === value)?.label,
  );

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  function lightenColor(color, amount = 0.15) {
    try {
      return lighten(amount, color);
    } catch {
      return color;
    }
  }

  onMount(async () => {
    if ($account_leagues.length === 0) {
      let acc_leagues = await getAccountLeagues();
      console.log("Account leagues: ");
      console.log(acc_leagues);
      account_leagues.set(acc_leagues);
    }

    // init league dropdown with user's last selection if there is any
    const prevSelectedLeague = localStorage.getItem("selected_league");
    console.log($account_leagues);
    if (
      prevSelectedLeague &&
      $account_leagues.map((l) => l.name).includes(prevSelectedLeague)
    ) {
      selected_league = prevSelectedLeague;
      selectLeagueTrigger();
    }
  });
</script>

{#if !$mobile_layout}
<div class="flex flex-row lg:space-x-5">
  <div class="flex flex-col gap-4 px-0 items-center">
    <Card.Root class="transparentBackground">
      <Card.Content class="flex flex-col gap-2">
        <Select.Root
          type="single"
          value={selected_league}
          onValueChange={(v) => {
            selected_league = v;
            localStorage.setItem("selected_league", v);
            selectLeagueTrigger();
          }}
        >
          <Select.Trigger class="w-[250px]">
            {leagueTrigger}
          </Select.Trigger>
          <Select.Content>
            {#if current_leagues.length > 0}
              <Select.Group>
                <Select.Label>Current League</Select.Label>
                {#each current_leagues as league}
                  <Select.Item value={league.value} label={league.label}>
                    {league.label}
                  </Select.Item>
                {/each}
              </Select.Group>
            {/if}
            {#if current_leagues.length > 0}
              <Select.Group>
                <Select.Label>Others</Select.Label>
                {#each other_leagues as league}
                  <Select.Item value={league.value} label={league.label}>
                    {league.label}
                  </Select.Item>
                {/each}
              </Select.Group>
            {/if}
          </Select.Content>
        </Select.Root>
        <div class="flex flex-row gap-4">
          <Popover.Root bind:open>
            <Popover.Trigger bind:ref={triggerRef}>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="outline"
                  class="w-[250px] justify-between"
                  role="combobox"
                  aria-expanded={open}
                  disabled={selected_league === ""}
                >
                  {selected_stash || "Select a stash..."}
                  <!-- <ChevronsUpDownIcon class="opacity-50" /> -->
                </Button>
              {/snippet}
            </Popover.Trigger>
            <Popover.Content class="w-[250px] p-0">
              <Command.Root>
                <Command.Input placeholder="Search stashes..." />
                <Command.List>
                  <Command.Empty>No stashes found.</Command.Empty>
                  <Command.Group value="stashes" class="py-0 px-0">
                    {#each stashes as stash}
                      <Command.Item
                        class="rounded-none"
                        style="
                              --stashColor: {stash.color};
                              --stashColorLight: {lightenColor(stash.color)};
                              color: {isBright(stash.color)
                          ? 'black'
                          : 'white'}"
                        value={stash.value}
                        onSelect={() => {
                          selected_stash = stash.label;
                          selectStashTrigger(stash.stash_obj);
                          stashMetadata.set({
                            name: stash.label,
                            color: stash.color,
                          });
                          closeAndFocusTrigger();
                        }}
                      >
                        <CheckIcon
                          class={cn(
                            selected_stash !== stash.value &&
                              "text-transparent",
                          )}
                        />
                        {stash.label}
                      </Command.Item>
                    {/each}
                  </Command.Group>
                </Command.List>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
          <Button onclick={refreshStashData}>
            <RefreshCw />
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  </div>

  <div class="lg:mx-auto">
    <!-- <StashBrowser {mode} /> -->
  </div>
</div>
{:else}
<div class="flex flex-col gap-4 px-6 items-center">
  <Card.Root class="transparentBackground w-full">
    <Card.Content class="flex flex-col gap-2">
      <Select.Root
        type="single"
        value={selected_league}
        onValueChange={(v) => {
          selected_league = v;
          localStorage.setItem("selected_league", v);
          selectLeagueTrigger();
        }}
      >
        <Select.Trigger class="w-full lg:w-[250px]">
          {leagueTrigger}
        </Select.Trigger>
        <Select.Content>
          {#if current_leagues.length > 0}
            <Select.Group>
              <Select.Label>Current League</Select.Label>
              {#each current_leagues as league}
                <Select.Item value={league.value} label={league.label}>
                  {league.label}
                </Select.Item>
              {/each}
            </Select.Group>
          {/if}
          {#if current_leagues.length > 0}
            <Select.Group>
              <Select.Label>Others</Select.Label>
              {#each other_leagues as league}
                <Select.Item value={league.value} label={league.label}>
                  {league.label}
                </Select.Item>
              {/each}
            </Select.Group>
          {/if}
        </Select.Content>
      </Select.Root>
      <div class="flex flex-row gap-4">
        <Popover.Root bind:open>
          <Popover.Trigger bind:ref={triggerRef}>
            {#snippet child({ props })}
              <Button
                {...props}
                variant="outline"
                class="w-full lg:w-[250px] justify-between"
                role="combobox"
                aria-expanded={open}
                disabled={selected_league === ""}
              >
                {selected_stash || "Select a stash..."}
                <!-- <ChevronsUpDownIcon class="opacity-50" /> -->
              </Button>
            {/snippet}
          </Popover.Trigger>
          <Popover.Content class="w-[250px] p-0">
            <Command.Root>
              <Command.Input placeholder="Search stashes..." />
              <Command.List>
                <Command.Empty>No stashes found.</Command.Empty>
                <Command.Group value="stashes" class="py-0 px-0">
                  {#each stashes as stash}
                    <Command.Item
                      class="rounded-none"
                      style="
                            --stashColor: {stash.color};
                            --stashColorLight: {lightenColor(stash.color)};
                            color: {isBright(stash.color)
                        ? 'black'
                        : 'white'}"
                      value={stash.value}
                      onSelect={() => {
                        selected_stash = stash.label;
                        selectStashTrigger(stash.stash_obj);
                        stashMetadata.set({
                          name: stash.label,
                          color: stash.color,
                        });
                        closeAndFocusTrigger();
                      }}
                    >
                      <CheckIcon
                        class={cn(
                          selected_stash !== stash.value &&
                            "text-transparent",
                        )}
                      />
                      {stash.label}
                    </Command.Item>
                  {/each}
                </Command.Group>
              </Command.List>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
        <Button onclick={refreshStashData}>
          <RefreshCw />
        </Button>
      </div>
    </Card.Content>
  </Card.Root>
</div>
<!-- {#if $bulk_result} -->
<StashBrowser {mode} />
<!-- {/if} -->

{/if}

{#if $search_result && !$forceHidden}
  <div class="flex flex-row">
    <span class="pageTitle mt-5">Search Results</span>
  </div>
{/if}

{#if !$mobile_layout}
  <ResultsBrowser totalW={1618} />
  {:else}
  <ResultsBrowser totalW={180} />
{/if}

