<script>
    import THLogoBlack from "$lib/images/TH-Logo-Black.svg";
    import THLogoWhite from "$lib/images/TH-Logo-White.svg";
    import VaalSymbol from "$lib/images/VaalSymbol.svg";
    import * as Card from "$lib/components/ui/card";
    import { derived } from "svelte/store";
    import { size_breakpoint } from "../../store";
    import { isMobile } from "$lib/breakpoints";
    import { mode } from "mode-watcher";

    // TODO - want to conditionally turn on repeat-off at some point
    let backgroundStyle = $derived.by(() => {
        const bg_size = isMobile($size_breakpoint) ? '900px 900px' : '140% 140%';
        const bg_position = isMobile($size_breakpoint) ? 'top 0% right 50%' : 'bottom 50% right 50%';
        return `background-size: ${bg_size}; background-position: ${bg_position}; background-image: url(${VaalSymbol});`
    });

</script>

<svelte:head>
    <title>Timeless Historian - About</title>
</svelte:head>


<div class="flex flex-col lg:mb-2 px-2 lg:px-6 pt-3 gap-20 lg:min-w-[700px]" style={backgroundStyle}>
    <div class="flex flex-row justify-center mt-20 items-center">
        <div class="flex flex-row items-center justify-center gap-8 lg:gap-20">
            {#if mode.current !== 'dark'}
            <img
                class="h-[20px] lg:h-[48px]"
                src={THLogoBlack}
                alt="TH Logo"
            />
            {:else}
            <img
                class="h-[25px] lg:h-[48px]"
                src={THLogoWhite}
                alt="TH Logo"
            />
            {/if}
            <h3 style="font-family: Trajan;" class='text-[30px] lg:text-[60px]'>About</h3>
            {#if mode.current !== 'dark'}
            <img
                class="h-[20px] lg:h-[48px]"
                src={THLogoBlack}
                alt="TH Logo"
            />
            {:else}
            <img
                class="h-[25px] lg:h-[48px]"
                src={THLogoWhite}
                alt="TH Logo"
            />
            {/if}
        </div>
    </div>
    <div class="flex flex-col w-full px-2 lg:max-w-[1250px] mt-0 mx-auto lg:mt-20 lg:mb-30 items-center">
        <Card.Root class="transparentBackground">
            <Card.Content>
                <div class="flex flex-row justify-center mb-2 lg:mb-4 text-[24px] lg:text-[32px]">
                    <h1>Background</h1>
                </div>
                <div class="flex flex-col gap-2 px-0 text-[14px] lg:text-[16px] lg:px-6">
                    <p>
                        In the early leagues after Legion, only the most
                        dedicated players were able to hunt down the best jewel
                        for their build.
                    </p>
                    <p>
                        The jewel economy was entirely reliant on sellers
                        marketing each item separately via the forums or TFT.
                        Sellers had to equip the jewel in-game and stitch
                        together screenshots of each affected notable.
                    </p>
                    <p>
                        Many players didn't shop around and just accepted jewels
                        sight-unseen if they granted the right keystone.
                    </p>
                    <p>
                        Everything has changed for buyers since the jewel seeds
                        were cracked.
                    </p>
                    <p>
                        Any build maker can easily find not only the optimal
                        seed, but often many viable fallbacks as well. Path of
                        Building will even generate bulk trade queries to make
                        the browsing process easier.
                    </p>
                    <p>
                        Ironically, not much has changed for sellers. There are
                        3 options:
                    </p>
                    <div class="flex flex-col gap-2 mx-4 lg:mx-10">
                        <h2 class='my-2 text-[16px] lg:text-[18px]'>• Dump tabs</h2>
                        <p>
                            This is by far the fastest method and arguably the
                            best way to make money from selling bulk jewels.
                        </p>
                        <p>
                            The seller makes a guess at an above-mean price for
                            an arbitrary jewel, lists everything at that price,
                            and steadily decreases it until hopefully everything
                            sells.
                        </p>
                        <p>
                            This <strong>is</strong> the best method if you assume
                            that there is a lot of demand for low quality items (such
                            as at league start). However, it outright ignores the
                            potential for jackpots.
                        </p>
                        <h2 class='my-2 text-[16px] lg:text-[18px]'>• Trade queries</h2>
                        <p>
                            In a perfectly rational world, this would be the
                            most effective way to price timeless jewels.
                            However, many (most?) people use dump tabs, and
                            therefore they use arbitrary prices.
                        </p>
                        <p>
                            Still, in my experience this method can work for
                            Lethal Pride and Brutal Restraint. Outside of The
                            Traitor, most of the keystones granted by these
                            jewels are not important to buyers.
                        </p>
                        <p>
                            However, things get complicated when you're
                            comparing against a dozen items with varying
                            generals and devotion mods. Militant Faith in
                            particular has huge variance.
                        </p>
                        <h2 class='my-2 text-[16px] lg:text-[18px]'>• Actually look at the tree</h2>
                        <p>
                            Just import it into PoB and look at the nodes,
                            right?
                        </p>
                        <p>
                            The task of thoroughly appraising each jewel
                            involves running the gauntlet of 21 jewel sockets,
                            quickly scanning every notable and <strong
                                >then</strong
                            > performing a metagame analysis of whether the stats
                            granted are appealing. Needless to say, this method is
                            unrealistic.
                        </p>
                    </div>
                    <p>
                        <br />
                        Dump tabs seem like the only viable option for people running
                        dozens of 5-way Domains per day. I don't expect this website
                        will change much for people generating that volume of jewels.
                    </p>
                    <p>
                        However, as the league progresses people will have more
                        to spend on their ideal jewel, and that's where careful
                        appraisal pays off.
                    </p>
                    <br />
                    <p>
                        I farmed a lot of Legion in a recent private league
                        hosted by Pohx. It occurred to me that in that setting,
                        the trade site was not very useful. Even in an league of
                        20,000+ players, most of the jewel seeds didn't exist.
                        Some of my jewels sold, but I wasn't satisfied by
                        randomly chucking them into dump tabs.
                    </p>
                    <p>
                        It occurred to me that it would be great if there was a
                        community compiled spreadsheet of notable timeless
                        jewels I could reference. If I had more dopamine hits
                        while farming jewels I might still be in there making
                        myself blind with KB of Clustering.
                    </p>
                    <p>
                        <br />
                        And that's it: the goal of Timeless Historian is to make
                        the experience of farming 5-ways more exciting.
                    </p>
                    <br />
                </div>
            </Card.Content>
        </Card.Root>
    </div>
    <div class="flex flex-row justify-center">
        {#if mode.current !== 'dark'}
        <img
            class="h-[32px] lg:h-[48px]"
            src={THLogoBlack}
            alt="TH Logo"
        />
        {:else}
        <img
            class="h-[32px] lg:h-[48px]"
            src={THLogoWhite}
            alt="TH Logo"
        />
        {/if}
    </div>
    <div class="flex flex-col w-full px-2 lg:max-w-[1250px] mt-0 mx-auto mb-8 lg:mt-20 items-center">
        <Card.Root class="transparentBackground">
            <Card.Content>
                <div class="flex flex-row justify-center mb-2 lg:mb-4 text-[24px] lg:text-[32px]">
                    <h1>FAQ</h1>
                </div>
                <div class="flex flex-col gap-2 px-0 text-[14px] lg:text-[16px] lg:px-6">
                    <h2 class='mt-4 mb-2 text-[16px] lg:text-[18px]'>What is this site?</h2>
                    <p>
                        Timeless Historian is a historial database for timeless
                        jewels. The site periodically polls characters from the
                        Softcore and Hardcore Trade ladders and records any
                        timeless jewels it finds. You can search the database
                        using a jewel in your inventory to see if Timeless
                        Historian has seen any characters using the same seed.
                    </p>
                    <p>
                        This site attempts to answer the question 'Does anyone
                        use this jewel?' or 'Is this jewel good for anyone?'.
                    </p>
                    <p>
                        What it <strong>isn't</strong> is a price checking tool or
                        a replacement for the official trade site.
                    </p>
                    <h2 class='mt-4 mb-2 text-[16px] lg:text-[18px]'>Why are SSF leagues not listed?</h2>
                    <p>
                        The theory behind Timeless Historian relies on the idea
                        that every equipped jewel reflects a decision.
                    </p>
                    <p>
                        In a trade league, players can choose between thousands
                        of jewels. In Softcore Trade it's not unthinkable that
                        your one-in-a-million ideal jewel will eventually exist
                        in the league. Obviously the same can't be said of SSF.
                    </p>
                    <p>
                        This site doesn't record jewels in SSF because they
                        reflect a decision between tens of jewels versus
                        thousands.
                    </p>

                    <h2 class='mt-4 mb-2 text-[16px] lg:text-[18px]'>Is there an API?</h2>
                    <p>
                        I don't currently have any plans to make a public API.
                    </p>

                    <h2 class='mt-4 mb-2 text-[16px] lg:text-[18px]'>
                        There are no results for any of the jewels I'm
                        searching!
                    </h2>
                    <p>
                        As time passes the database will develop a more complete
                        picture of which jewels people are using, and you can
                        expect more average search results. That said, a null
                        result is still meaningful.
                    </p>

                    <h2 class='mt-4 mb-2 text-[16px] lg:text-[18px]'>How can I submit a bug report or other feedback?</h2>
                    <p>You can email me at timeless_auditor@gmail.com.</p>
                    <p>Thank you for visiting!</p>
                </div>
            </Card.Content>
        </Card.Root>
    </div>
</div>


<style>
    p {
        font-family: Roboto;
    }

    h2 {
        font-family: Fontin-Bold;
    }

    h1 {
        font-family: Trajan;
    }
</style>
