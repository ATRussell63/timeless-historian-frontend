<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import THLightLogo from '$lib/images/TH-Logo-White-Fatso.svg'
    import THPurpleLogo from '$lib/images/TH-Logo-Purple-Fatso.svg'
    import THBlackLogo from '$lib/images/TH-Logo-Black.svg'
    import { page } from '$app/stores';
    // import { set, get, derived } from 'svelte/store';
    import { writable } from "svelte/store";
    // import {} from 'svelte';
    import { cn } from "$lib/utils";
    let props = $props();

    // inline the svg for convenience
//     function urlEncodeSvg(svgString) {
//         const encodedSvg = encodeURIComponent(svgString);
//         return `data:image/svg+xml,${encodedSvg}`;
//     }

//     const th_purple = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
// 	 width="256px" height="256px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
// <path fill="#472E89" d="M217.991,144.908v-33.815V59.126v-0.635C217.991,28.91,256,16.448,256,16.448V8.843H0v7.605
// 	c0,0,38.003,12.462,38.003,42.042v0.635v51.967v33.815v51.965v0.64C38.003,227.088,0,239.555,0,239.555v7.603h256v-7.603
// 	c0,0-38.009-12.467-38.009-42.042v-0.64V144.908z M71.317,45.843h39.12v62.811h-39.12V45.843z M110.437,199.406
// 	c0,0-0.008,18.78-19.564,18.78c-19.556,0-19.556-20.674-19.556-20.674v-55.527h39.12v37.224V199.406z M182.873,199.406
// 	c0,0-0.007,18.78-19.567,18.78c-19.554,0-19.554-20.674-19.554-20.674v-18.304v-37.224h39.121V199.406z M183.011,108.654h-39.259
// 	V45.843h39.259V108.654z"/>
// <rect fill="#472E89" width="256" height="12.25"/>
// <rect y="244.5" fill="#472E89" width="256" height="11.5"/>
// </svg>`;
//     const th_purple_encoded = urlEncodeSvg(th_purple);
    // console.log(th_purple_encoded);
    
//     const th_white = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
// 	 width="256px" height="256px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
// <path fill="#FFFFFF" d="M217.991,144.908v-33.815V59.126v-0.635C217.991,28.91,256,16.448,256,16.448V8.843H0v7.605
// 	c0,0,38.003,12.462,38.003,42.042v0.635v51.967v33.815v51.965v0.64C38.003,227.088,0,239.555,0,239.555v7.603h256v-7.603
// 	c0,0-38.009-12.467-38.009-42.042v-0.64V144.908z M71.317,45.843h39.12v62.811h-39.12V45.843z M110.437,199.406
// 	c0,0-0.008,18.78-19.564,18.78c-19.556,0-19.556-20.674-19.556-20.674v-55.527h39.12v37.224V199.406z M182.873,199.406
// 	c0,0-0.007,18.78-19.567,18.78c-19.554,0-19.554-20.674-19.554-20.674v-18.304v-37.224h39.121V199.406z M183.011,108.654h-39.259
// 	V45.843h39.259V108.654z"/>
// <rect fill="#FFFFFF" width="256" height="12.25"/>
// <rect y="244.5" fill="#FFFFFF" width="256" height="11.5"/>
// </svg>`;
//     const th_white_encoded = urlEncodeSvg(th_white);

    // let isHovered = signal(false);
    // let isHovered = writable(false);
    // const isHome = derived($page.url.pathname === '/');
    // const imageSrc = derived(
    //         [isHovered, isHome],
    //         ([$isHovered, $isHome]) =>
    //             ($isHovered || $isHome)
    //                 ? th_purple_encoded
    //                 : th_white_encoded
    //     );
    // const isActive = () => $page.url.pathname === '/';


    // const imageSrc = derived($isHovered || $isActive
	// 	? th_purple_encoded
	// 	: th_white_encoded);
</script>

<!-- class='h-12 sidebarButton'  -->

<Button 
    

    class='h-12 sidebarButton'
    variant='link'
    href='/'>
    <img class="mr-4 thLogo" src={THBlackLogo}>
    <span class='sidebarHomeButtonText'>Timeless Historian</span>
</Button>


    <!-- class={cn('h-12 sidebarButton',
        isActive() && 'sidebarButtonActive', 
        !isActive() && 'sidebarButtonNotActive'
    )} -->

<!-- ok, new plan
    the icon is always going to be white
    the backdrop is going to change color based on the isActive state
    and bob is your bloody uncle
-->