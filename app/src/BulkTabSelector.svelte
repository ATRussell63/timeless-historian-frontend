<script>
  import * as Select from "$lib/components/ui/select";
  import { account_leagues, stashes_per_league, api_jewel_data, bulk_result, search_result, waiting_on_api } from "./store";
  import { PUBLIC_CURRENT_LEAGUE } from "$env/static/public";
  import { leagues } from "$lib/data/leagues";
  // import { stashes_standard } from "$lib/data/stashes";
  import { filterUnsupportedStashTypes, flattenStashes, getAccountStashes, getJewelsFromStashTab } from "$lib/api";
  import { parse_jewel_seed, parse_jewel_general } from "$lib/parse"
  import StashBrowser from "./StashBrowser.svelte";
  import ResultsBrowser from "./ResultsBrowser.svelte";
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { RefreshCw } from "lucide-svelte";
  import { onMount, tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  import { mode } from "mode-watcher";
  import { lighten } from "polished";
  import { forceHidden } from "./resultsBrowserStore";
  import * as Card from '$lib/components/ui/card'
  import { Label } from "$lib/components/ui/label/index.js";
  import { isBright } from "$lib/utils.js";
  import { stashMetadata } from "./resultsBrowserStore";

  // clear any previous search data
  console.log('clearing search results')
  search_result.set(null)

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
  let selected_stash_size = $state(0);
  let open = $state(false);
  let selected_stash = $state("");
  let triggerRef = $state(null);
  // let niceHack = $state(1);

  function ffToBlue(colorString) {
    // for whatever reason blue comes out of the api as 'ff'
    return colorString === '#ff' ? '#0033FF' : colorString
  }

  async function getStashesForLeague() {
    const raw_stashes = await getAccountStashes(selected_league)
    // console.log('raw stashes here')
    // console.log(raw_stashes)

    const filtered_stashes = filterUnsupportedStashTypes(
      flattenStashes(raw_stashes),
    );
    stashes = filtered_stashes.map((s) => ({
      // if value isn't unique then multiple items highlight so we just include the id in the value
      value: s.name + ' ' + s.id,
      label: s.name,
      stash_obj: s,
      color: ffToBlue("#" + s?.metadata.colour),
    }));

    console.log('getStashesForLeague: stashes')
    console.log(stashes)
  }

  async function selectLeagueTrigger() {
    console.log(`getting stashes for ${selected_league}`);

    forceHidden.set(true)
    bulk_result.set(null)
    // forces redraw of stashes
    // niceHack = niceHack * -1;

    // if we already have the stashes for the requested league we can just swap and display it
    if (stashes_per_league[selected_league]) {
      stashes = stashes_per_league[selected_league]
    }
    else {
      // get the stash data again and clear the selected stash
      getStashesForLeague()
      selected_stash = ''
    }
  }

  async function refreshStashData() {
    // re-fetch the stashes for the currently selected league
    if (selected_league == '') {
      // TODO - button should be disabled if league isn't selected
      console.log('refreshStashData: No selected league')
      return
    }
    else {
      console.log('refreshStashData: refreshing stash data...')
      getStashesForLeague()

      if (stashes.find((s) => s.stash_obj.name === selected_stash)) {
        console.log('refreshStashData: no need to deselect the stash')
        console.log('refreshStashData: refreshing tab:')
        const s = stashes.find((s => s.stash_obj.name === selected_stash)).stash_obj
        console.log(s)
        selectStashTrigger(s, true)
      } else {
        console.log('refreshStashData: resetting selection...')
        forceHidden.set(true)
        bulk_result.set(null)
        selected_stash = ''
      }
    }
  } 

  function safe_getter(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  function setPath(obj, path, value) {
    if (path.length === 0) return value;
    const [key, ...rest] = path;
    return {
      ...obj,
      [key]: setPath(obj?.[key] ?? {}, rest, value)
    };
  }

  async function bulkSearch(jewels) {
    let counter = 0
    let request_body = jewels.map((j) => ({
        i: counter++,
        x: j.x,
        y: j.y,
        jewel_type: j.name,
        seed: parse_jewel_seed(j.explicitMods[0]),
        general: parse_jewel_general(j.explicitMods[0]),
        mf_mods: j.explicitMods.length == 4 ? [j.explicitMods[1], j.explicitMods[2]] : []
    }))
    console.log('bulkSearch: body')
    console.log(request_body)

    let url = '/api/search/bulk'
    if (!import.meta.env.PROD) {
        url = 'http://localhost:5000' + url.replace('/api', '')
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({jewels: request_body})
        });

        const data = await response.json()
        console.log('bulkSearch: response from backend:')
        console.log(data)
        bulk_result.set(data.results)
    } catch (err) {
        console.log(err)
        // TODO maybe throw a toast or something
    }
  }

  async function selectStashTrigger(stash, force=false) {
    forceHidden.set(true)
    selected_stash_size = stash.type === 'QuadStash' ? 24 : 12

    const s_id = stash.id
    console.log('selectStashTrigger: heres api_jewel_data:')
    console.log($api_jewel_data)
    if (!safe_getter($api_jewel_data, selected_league + '.' + s_id) || force) {
      // get the jewels from ggg
      const jewels = await getJewelsFromStashTab(selected_league, s_id)
      console.log('selectStashTrigger: jewels')
      console.log(jewels)
      
      api_jewel_data.update(current => setPath(current, [selected_league, s_id], jewels))

      console.log($api_jewel_data)
    }

    // get hits from backend
    if ($api_jewel_data[selected_league][s_id].length > 0) {
      bulkSearch($api_jewel_data[selected_league][s_id])
    } else {
      bulk_result.set([])
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

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }

  function lightenColor(color, amount = 0.15) {
    try {
      // console.log(color)
      return lighten(amount, color);
    } catch {
      return color;
    }
  }

  onMount(() => {
    // init league dropdown with user's last selection if there is any
    const prevSelectedLeague = localStorage.getItem('selected_league')
    if (prevSelectedLeague) {
      selected_league = prevSelectedLeague
      selectLeagueTrigger()
    }
  })

</script>

<div class="flex flex-row space-x-5">
  <div class='flex flex-col  gap-4 px-0 mt-10 mx-auto'>
    <Card.Root class='transparentBackground'>
      <Card.Content class='flex flex-col gap-2'>
        <Select.Root
          type="single"
          value={selected_league}
          onValueChange={(v) => {
            selected_league = v;
            localStorage.setItem('selected_league', v)
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
        <div class='flex flex-row gap-4'>
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
                  <Command.Group value="stashes" class='py-0 px-0'>
                    {#each stashes as stash}
                      <Command.Item
                        class='rounded-none'
                        style="
                              --stashColor: {stash.color};
                              --stashColorLight: {lightenColor(stash.color)};
                              color: {isBright(stash.color) ? 'black' : 'white'}"
                        value={stash.value}
                        onSelect={() => {
                          selected_stash = stash.label;
                          selectStashTrigger(stash.stash_obj);
                          stashMetadata.set({
                            name: stash.label,
                            color: stash.color
                          })
                          closeAndFocusTrigger();
                        }}
                      >
                        <CheckIcon
                          class={cn(selected_stash !== stash.value && "text-transparent")}
                        />
                        {stash.label}
                      </Command.Item>
                    {/each}
                  </Command.Group>
                </Command.List>
              </Command.Root>
            </Popover.Content>
          </Popover.Root>
          <Button
            onclick={refreshStashData}>
            <RefreshCw />
          </Button>
        </div>
        </Card.Content>
    </Card.Root>
  </div>

  <div class='mx-auto'>
    <StashBrowser sideLen={800} cellsPerSide={selected_stash_size} mode={mode}/>
  </div>
</div>

{#if $search_result && !$forceHidden}
<div class='flex flex-row'>
    <span class='pageTitle mt-5'>Search Results</span>
</div>
{/if}

<div class='flex flex-row w-[1618px]'>
  <ResultsBrowser totalW={1618} />
</div>

<!-- <style>
  .commandStash &[aria-selected="true"] {
    background-color: var(--stashColor);
  }
</style> -->