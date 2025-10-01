<script lang="ts">
	// Types
	import type { NavigationItem } from '@/components/navigation'


	// Props
	let {
		items,
		currentPathname,
	}: {
		items: NavigationItem[]
		currentPathname: string
	} = $props()


	// State
	import { SvelteMap } from 'svelte/reactivity'

	let isOpen = $state(
		new SvelteMap<NavigationItem, boolean>()
	)

	let searchValue = $state(
		''
	)


	// Functions
	const hasCurrentPage = (item: NavigationItem) => (
		currentPathname === item.href
		|| (item.children?.some(hasCurrentPage) ?? false)
	)

	const fuzzyMatch = (text: string, query: string): number[] | null => {
		if (query === '') return null

		const textLower = text.toLowerCase()
		const queryLower = query.toLowerCase()
		const matches: number[] = []
		let textIndex = 0

		for (const char of queryLower) {
			textIndex = textLower.indexOf(char, textIndex)
			if (textIndex === -1) return null
			matches.push(textIndex)
			textIndex++
		}

		return matches
	}

	const matchesSearch = (item: NavigationItem, query: string): boolean => (
		query === ''
		|| fuzzyMatch(item.title, query) !== null
		|| (item.children?.some((child) => matchesSearch(child, query)) ?? false)
	)

	const highlightText = (text: string, query: string) => {
		const matches = fuzzyMatch(text, query)
		if (!matches) return text

		const parts: string[] = []
		let lastIndex = 0

		for (const index of matches) {
			if (index > lastIndex) {
				parts.push(text.slice(lastIndex, index))
			}
			parts.push(`<mark>${text[index]}</mark>`)
			lastIndex = index + 1
		}

		if (lastIndex < text.length) {
			parts.push(text.slice(lastIndex))
		}

		return parts.join('')
	}
</script>


<search>
	<input
		type="search"
		bind:value={searchValue}
		placeholder="Search (⌘+K)"
		{@attach element => {
			const abortController = new AbortController()

			let lastFocusedElement: HTMLElement | undefined = $state()

			globalThis.addEventListener(
				'keydown',
				event => {
					if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
						event.preventDefault()

						if(document.activeElement instanceof HTMLElement)
							lastFocusedElement = document.activeElement

						element.focus()
					}
				},
				{ signal: abortController.signal }
			)

			element.addEventListener(
				'blur',
				() => {
					lastFocusedElement?.focus()
					lastFocusedElement = undefined
				},
				{ signal: abortController.signal }
			)

			return () => {
				abortController.abort()
				lastFocusedElement?.focus()
				lastFocusedElement = undefined
			}
		}}
		onkeyup={event => {
			if (event.key === 'Escape')
				event.currentTarget.blur()
		}}
	/>

	{@render navigationItems(items)}
</search>


{#snippet navigationItems(items: NavigationItem[])}
	<menu>
		{#each (
			searchValue ?
				items.filter(item => matchesSearch(item, searchValue))
			:
				items
		) as item (item.id)}
			<li>
				{@render navigationItem(item)}
			</li>
		{/each}
	</menu>
{/snippet}


{#snippet navigationItem(item: NavigationItem)}
	{#if !item.children?.length}
		{@render linkable(item)}
	{:else}
		<details
			bind:open={
				() => (
					searchValue ?
						matchesSearch(item, searchValue)
					:
						isOpen.get(item) ?? isOpen.set(item, hasCurrentPage(item)).get(item)
				),
				_ => {
					if (!searchValue)
						isOpen.set(item, _)
				}
			}
			data-sticky-container
		>
			<summary data-sticky>
				{@render linkable(item)}
			</summary>

			{@render navigationItems(item.children)}
		</details>
	{/if}
{/snippet}


{#snippet linkable(item: NavigationItem)}
	{#if item.href}
		<a
			href={item.href}
			aria-current={currentPathname === item.href ? 'page' : undefined}
			{...item.href.startsWith('http') && {
				target: '_blank',
				rel: 'noreferrer',
			}}
		>
			{#if item.icon}
				<span class="icon">{@html item.icon}</span>
			{/if}

			<span>{@html searchValue ? highlightText(item.title, searchValue) : item.title}</span>
		</a>
	{:else}
		{#if item.icon}
			<span class="icon">{@html item.icon}</span>
		{/if}

		<span>{@html searchValue ? highlightText(item.title, searchValue) : item.title}</span>
	{/if}
{/snippet}


<style>
	search {
		display: grid;
		gap: 0.75rem;
	}

	menu {
		display: grid;
		gap: 2px;
		list-style: none;
		font-size: 0.975em;

		li {
			display: grid;
		}
	}

	a {
		color: inherit;
		font-weight: inherit;

		&:hover {
			color: var(--accent);
			text-decoration: none;
		}

		&[aria-current] {
			background-color: var(--background-primary);
			font-weight: 700;
		}
	}

	summary,
	a {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		> .icon {
			display: flex;
			font-size: 1.25em;
			width: 1em;
			height: 1em;
			line-height: 1;

			:global(
				img,
				svg
			) {
				border-radius: 0.125rem;
				width: 100%;
				height: 100%;
			}
		}

		:global(mark) {
			font-weight: 600;
			text-decoration: underline;
			background-color: transparent;
			color: inherit;
		}
	}

	summary,
	a:not(summary a) {
		padding: 0.45rem 0.45rem;
		border-radius: 0.375rem;
		font-weight: 500;

		transition-property: background-color, color, outline;

		&:hover:not(:has(a:hover)) {
			background-color: var(--background-primary);
			color: var(--accent);
		}

		&:focus {
			outline: 2px solid var(--accent);
			outline-offset: -1px;
		}

		&:active {
			background-color: var(--background-primary);
		}
	}

	details:not([open]) > summary::after {
		transform: perspective(100px) rotateX(180deg) rotate(-90deg);
	}

	summary ~ * {
		margin-inline-start: 2em;
		margin-block-start: 2px;

		margin-inline-start: 1.25em;
		margin-block-start: 2px;
		padding-inline-start: 0.75em;
		box-shadow: -1px 0 var(--border-color);
	}
</style>
