import type {$Fetch} from "nitropack/types";

declare module "@vue/runtime-core" {

    interface NuxtApp {
        $fetch: $Fetch
    }
}