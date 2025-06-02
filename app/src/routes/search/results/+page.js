import { redirect } from "@sveltejs/kit";
import { search_result } from "../../../store";
import { get } from "svelte/store";

export function load() {
    const sr = get(search_result);

    if (!sr) {
        console.log('redirecting')
        throw redirect(302, '/search')
    }

    return {
        body: sr.body,
        response: sr.response
    };
}