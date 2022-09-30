import { writable } from 'svelte/store'

export const headerIsOpen = writable(false)
export const pageLoaded = writable(true);