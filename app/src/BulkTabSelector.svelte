<script>
  import * as Select from "$lib/components/ui/select";
  import { account_leagues, stash_data } from "./store";
  import { PUBLIC_CURRENT_LEAGUE } from "$env/static/public";
  import { leagues } from "$lib/data/leagues";
  import { stashes_standard } from "$lib/data/stashes";
  import { filterUnsupportedStashTypes, flattenStashes, getAccountStashes } from "$lib/api";

  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

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

  async function getStashesForLeague() {
    console.log(`getting stashes for ${selected_league}`);
    
    // if we already have the stashes for the requested league we can just swap and display it
    if (stash_data[selected_league]) {
      stashes = stash_data[selected_league]
    }
    else {
      const raw_stashes = await getAccountStashes(selected_league)
      // console.log('raw stashes here')
      // console.log(raw_stashes)
      // shadcn-svelte's Command component does not natively support searching based on label value
      // we need to embed the name of the stash tab in the value with a known separator
      // since poe supports basically all characters we make a random string for this session only
      const randomString = Math.random().toString(36).substring(2)
      localStorage.setItem('stashSeparator', randomString);
      const filtered_stashes = filterUnsupportedStashTypes(
        flattenStashes(raw_stashes),
      );
      stashes = filtered_stashes.map((s) => ({
        value: s.name + randomString + s.id,
        label: s.name,
        color: s?.metadata.colour,
      }));
    }
  }

  const leagueTrigger = $derived(
    current_leagues
      .concat(other_leagues)
      .find((f) => f.value === selected_league)?.label ?? "Select a League",
  );
  const stashTrigger = $derived.by(() => {
    if (leagueTrigger !== "Select a League") {
      return (
        stashes.find((f) => f.value === selected_stash)?.label ??
        "Select a Stash"
      );
    } else {
      return " - ";
    }
  });

  let open = $state(false);
  let selectedStash = $state("");
  let triggerRef = $state(null);

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

  function getStashNameFromItemValue(itemValue) {
    const sep = localStorage.getItem('stashSeparator')
    return itemValue.split(sep)[0]
  }

  function stashFilter(
    commandValue,
    search,
    commandKeywords
  ) {
    const stashId = getStashNameFromItemValue(commandValue)
    return stashId.toLowerCase().includes(search) ? 1 : 0;
  }

</script>

<div class="flex flex-row space-x-5">
  <Select.Root
    type="single"
    onValueChange={(v) => {
      selected_league = v;
      getStashesForLeague();
    }}
  >
    <Select.Trigger class="w-[180px]">
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

  <Popover.Root bind:open>
    <Popover.Trigger bind:ref={triggerRef}>
      {#snippet child({ props })}
        <Button
          {...props}
          variant="outline"
          class="w-[200px] justify-between"
          role="combobox"
          aria-expanded={open}
        >
          {getStashNameFromItemValue(selectedStash) || "Select a stash..."}
          <!-- <ChevronsUpDownIcon class="opacity-50" /> -->
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0">
      <Command.Root filter={stashFilter}>
        <Command.Input placeholder="Search stashes..." />
        <Command.List>
          <Command.Empty>No stashes found.</Command.Empty>
          <Command.Group value="stashes">
            {#each stashes as stash}
              <Command.Item
                style={`color: #${stash.color}`}
                value={stash.value}
                onSelect={() => {
                  selectedStash = stash.value;
                  closeAndFocusTrigger();
                }}
              >
                <CheckIcon
                  class={cn(selectedStash !== stash.value && "text-transparent")}
                />
                {stash.label}
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</div>
