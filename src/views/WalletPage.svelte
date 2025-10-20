<script lang="ts">
	// Types/constants
	import {
		ratingToColor,
		Rating,
		type EvaluatedAttribute,
		type AttributeGroup,
		type Attribute,
		type EvaluatedGroup,
		ratingIcons,
	} from '@/schema/attributes'
	import { VariantSpecificity } from '@/schema/wallet'
	import { type Variant, hasSingleVariant } from '@/schema/variants'
	import { allRatedWallets, type WalletName } from '@/data/wallets'
	import { ContentType, isTypographicContent } from '@/types/content'
	import { objectEntries, objectKeys } from '@/types/utils/object'


	// Functions
	import {
		variants,
		variantToName,
		variantToRunsOn,
	} from '@/constants/variants'
	import {
		attributeTree,
		calculateAttributeGroupScore,
		calculateOverallScore,
	} from '@/schema/attribute-groups'
	import { renderStrings, slugifyCamelCase } from '@/types/utils/text'
	import { toFullyQualified } from '@/schema/reference'
	import { getAttributeOverride } from '@/schema/wallet'
	import { scoreToColor } from '@/utils/colors'
	import { allHardwareModels } from '@/data/hardware-wallets'


	// Components
	import Typography from '@/components/Typography.svelte'
	import Pie, { PieLayout } from '@/components/Pie.svelte'
	import RenderCustomContent from '@/views/RenderCustomContent.svelte'
	import ReferenceLinks from '@/views/ReferenceLinks.svelte'
	import ScoreBadge from '@/views/ScoreBadge.svelte'
	import Select from '@/components/Select.svelte'


	// Props
	const {
		walletName
	}: {
		walletName: WalletName,
	} = $props()


	// State
	import { SvelteURLSearchParams } from 'svelte/reactivity'

	let queryParams = $state<URLSearchParams>(
		globalThis.location && new SvelteURLSearchParams(globalThis.location.search)
	)

	$effect(() => {
		if(queryParams.toString() !== globalThis.location.search)
			globalThis.history.replaceState(null, '', `${globalThis.location.pathname}?${queryParams.toString()}`)
	})

	let highlightedAttributeId = $state<string | null>(
		null
	)

	// (Derived)
	const wallet = $derived(
		allRatedWallets[walletName]
	)

	let selectedVariant = $state<Variant | undefined>(
		undefined
	)
	$effect(() => {
		selectedVariant = hasSingleVariant(wallet.variants) ? undefined : queryParams.get('variant') as Variant ?? undefined
	})
	$effect(() => {
		if(!hasSingleVariant(wallet.variants) && selectedVariant)
			queryParams.set('variant', selectedVariant)
		else
			queryParams.delete('variant')
	})

	const evalTree = $derived(
		selectedVariant &&
			wallet.variants[selectedVariant]?.attributes
		||
			wallet.overall
	)

	const attrToRelevantVariants = $derived.by(() => {
		const map = new Map<string, Variant[]>()

		for (const [variant, variantSpecificityMap] of Object.entries(wallet.variantSpecificity)) {
			for (const [evalAttrId, variantSpecificity] of variantSpecificityMap) {
				switch (variantSpecificity) {
					case VariantSpecificity.ALL_SAME:
					case VariantSpecificity.EXEMPT_FOR_THIS_VARIANT:
						break
					case VariantSpecificity.ONLY_ASSESSED_FOR_THIS_VARIANT:
						map.set(evalAttrId, [variant as Variant])
						break
					default:
						const relevantVariants = map.get(evalAttrId)
						relevantVariants ? relevantVariants.push(variant as Variant) : map.set(evalAttrId, [variant as Variant])
				}
			}
		}

		return map
	})

	const overallScore = $derived(
		calculateOverallScore(wallet.overall)
	)
</script>


<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: evalTree
			? objectEntries(attributeTree).flatMap(([attrGroupId, attrGroup]) =>
					objectEntries(attrGroup.attributes as AttributeGroup<any>['attributes'])
						.map(([attrId, attribute]) => ({
							evalAttr: evalTree[attrGroupId][
								attrId as keyof (typeof evalTree)[typeof attrGroupId]
							] as EvaluatedAttribute<any> | undefined,
							attribute,
						}))
						.filter(
							({ evalAttr }) => evalAttr && evalAttr.evaluation.value.rating !== Rating.EXEMPT,
						)
						.map(({ attribute }) => ({
							'@type': 'Question',
							name: renderStrings(
								attribute.question.contentType === ContentType.MARKDOWN
									? attribute.question.markdown
									: attribute.question.contentType === ContentType.TEXT
										? attribute.question.text
										: attribute.displayName,
								{
									WALLET_NAME: wallet.metadata.displayName,
								},
							),
							acceptedAnswer: {
								'@type': 'Answer',
								text: renderStrings(
									attribute.why.contentType === ContentType.MARKDOWN
										? attribute.why.markdown
										: attribute.why.contentType === ContentType.TEXT
											? attribute.why.text
											: 'No explanation available',
									{
										WALLET_NAME: wallet.metadata.displayName,
									},
								),
							},
						})),
				)
			: [],
		about: {
			'@type': 'SoftwareApplication',
			name: wallet.metadata.displayName,
			description: renderStrings(
				wallet.metadata.blurb.contentType === ContentType.TEXT
					? wallet.metadata.blurb.text
					: `${wallet.metadata.displayName} wallet`,
				{
					WALLET_NAME: wallet.metadata.displayName,
				},
			),
			url: typeof wallet.metadata.url === 'string' ? wallet.metadata.url : wallet.metadata.url?.url,
			applicationCategory: 'Cryptocurrency Wallet',
			operatingSystem: objectKeys(wallet.variants)
				.map(variant => variantToRunsOn(variant))
				.join(', '),
		},
	})}</script>`}
</svelte:head>


<a href="#top" class="return-to-top">↑</a>

<div
	class="container"
	data-sticky-container
>
	<article
		data-scroll-container="block"
	>
		<div
			data-sticky="block"
			class="nav-title"
		>
			Table of contents
		</div>

		<header id="top" data-column="gap-6">
			<div data-row="wrap">
				<div data-row="wrap">
					<a
						class="wallet-name"
						href="#top"
					>
						<h1 data-row="gap-2">
							<img
								class="wallet-icon"
								alt={wallet.metadata.displayName}
								src={`/images/wallets/${wallet.metadata.id}.${wallet.metadata.iconExtension}`}
							/>
							<span>{wallet.metadata.displayName}</span>
						</h1>
					</a>

					{#if Object.keys(wallet.variants).length > 1}
						<Select
							bind:value={selectedVariant}
							options={[
								{ value: undefined, label: 'All versions' },
								...Object.keys(wallet.variants).map(v => ({ value: v, label: variants[v as Variant].label, icon: variants[v as Variant].icon }))
							]}
						/>
					{/if}
				</div>

				<div data-row="gap-2">
					<span>Walletbeat score: </span>
					<ScoreBadge score={overallScore} size="large" />
				</div>
			</div>

			<section class="wallet-overview" data-column="gap-6">
				<nav class="wallet-links" data-column="gap-2 wrap">
					<a
						href={typeof wallet.metadata.url === 'string' ? wallet.metadata.url : wallet.metadata.url?.url ?? '#'}
						class="wallet-link website"
						data-card="padding-2"
						data-row="gap-2 start"
						target="_blank"
						rel="noopener noreferrer"
					>
						Website
					</a>

					{#if wallet.metadata.repoUrl}
						<a
							href={typeof wallet.metadata.repoUrl === 'string' ? wallet.metadata.repoUrl : wallet.metadata.repoUrl?.url ?? '#'}
							class="wallet-link repo"
							data-card="padding-2"
							data-row="gap-2 start"
							target="_blank"
							rel="noopener noreferrer"
						>
							GitHub Repository
						</a>
					{/if}
				</nav>

				<div class="wallet-blurb">
					<Typography
						content={wallet.metadata.blurb}
						strings={{ WALLET_NAME: wallet.metadata.displayName }}
					/>
				</div>

				<footer class="wallet-platforms" data-card="padding-5">
					<p>
						<span class="platforms-label">Platforms: </span>
						{#each Object.keys(wallet.variants) as variant, i}
							{i > 0 ? ', ' : ''}<strong>{variantToRunsOn(variant as Variant)}</strong>
						{/each}.
					</p>

					{#if !hasSingleVariant(wallet.variants)}
						<p>
							The ratings below may vary depending on the version.
							{#if selectedVariant}
								You are currently viewing the ratings for the
								<strong>{variantToName(selectedVariant, false)}</strong> version.
							{:else}
								Select a version to see version-specific ratings.
							{/if}
						</p>
					{/if}

					{#if 'hardware' in wallet.variants}
						{@const brandModels = allHardwareModels.filter(m => m.brandId === wallet.metadata.id)}
						{#if brandModels.length > 1}
							<p>
								The ratings below may vary depending on the model.
								{#if selectedModel}
									You are currently viewing the ratings for the
									<strong>{brandModels.find(m => m.id === selectedModel)?.modelName}</strong> model.
								{:else}
									Select a model to see model-specific ratings.
								{/if}
							</p>
						{/if}
					{/if}
				</footer>
			</section>
		</header>

		{#each evalTree ? objectEntries(attributeTree) : [] as [attrGroupId, attrGroup]}
			{@const evalGroup = evalTree?.[attrGroupId]}

			{#if evalGroup}
				{@render attributeGroupSnippet({
					attrGroup,
					evalGroup,
				})}
			{/if}
		{/each}
	</article>
</div>


{#snippet attributeGroupSnippet({
	attrGroup,
	evalGroup,
}: {
	attrGroup: AttributeGroup<any>
	evalGroup: EvaluatedGroup<any>
})}
	{@const attributes = objectEntries(attrGroup.attributes as AttributeGroup<any>['attributes'])
		.map(([attrId, attribute]) => ({
			attribute,
			evalAttr: evalGroup[attrId] as EvaluatedAttribute<any> | undefined,
		}))
		.filter(({ evalAttr }) => evalAttr && evalAttr.evaluation.value.rating !== Rating.EXEMPT)
		.map(({ attribute, evalAttr }) => ({
			attribute,
			evalAttr: evalAttr!,
		}))}

	{#if attributes.length > 0}
		{@const score = evalGroup ? calculateAttributeGroupScore(attrGroup.attributeWeights, evalGroup) : null}
		{@const scoreLevel = score?.score ? score.score >= 0.7 ? 'high' : score.score >= 0.4 ? 'medium' : 'low' : undefined}

		<hr />

		<section
			class="attribute-group"
			id={slugifyCamelCase(attrGroup.id)}
			aria-label={attrGroup.displayName}
			data-column
			data-score={scoreLevel}
			data-icon={attrGroup.icon}
			style:--accent={scoreToColor(score?.score)}
		>
			<header data-sticky data-row>
				<a href={`#${slugifyCamelCase(attrGroup.id)}`}>
					<h2>
						{attrGroup.displayName}
					</h2>
				</a>

				<ScoreBadge
					{score}
				/>
			</header>

			{#if attrGroup.perWalletQuestion}
				<div class="section-caption">
					<Typography
						content={attrGroup.perWalletQuestion}
						strings={{ WALLET_NAME: wallet.metadata.displayName }}
					/>
				</div>
			{/if}

			<div class="attributes-overview-container">
				<section class="attributes-overview" data-card="radius-8">
					<div class="attributes-pie">
						<Pie
							layout={PieLayout.FullTop}
							radius={120}
							padding={20}
							levels={[{
								outerRadiusFraction: 0.95,
								innerRadiusFraction: 0.125,
								gap: 8,
								angleGap: 0,
							}]}
							slices={
								attributes
									.map(({ attribute, evalAttr }) => ({
										id: attribute.id,
										color: ratingToColor(evalAttr.evaluation.value.rating),
										weight: attrGroup.attributeWeights[attribute.id],
										arcLabel: evalAttr.evaluation.value.icon ?? evalAttr.attribute.icon,
										tooltip: attribute.displayName,
										tooltipValue: evalAttr.evaluation.value.rating,
										href: `#${slugifyCamelCase(attribute.id)}`,
									}))
							}
							highlightedSliceId={highlightedAttributeId}
							onSliceMouseEnter={id => {
								highlightedAttributeId = id
							}}
							onSliceMouseLeave={() => {
								highlightedAttributeId = null
							}}
						>
							{#snippet centerContentSnippet()}
								<circle
									r="8"
									fill={scoreToColor(score?.score)}
								>
									{#if score?.hasUnratedComponent}
										<title>
											*contains unrated components
										</title>
									{/if}
								</circle>
							{/snippet}
						</Pie>
					</div>

					<div class="attributes-list" data-column="gap-3">
						<h3>Attribute Details:</h3>

						<ul data-column="gap-2">
							{#each attributes as { attribute, evalAttr }}
								{@const attributeUrl = `#${slugifyCamelCase(attribute.id)}`}
								<li>
									<a
										href={attributeUrl}
										style:--accent={ratingToColor(evalAttr.evaluation.value.rating)}
										data-card="secondary padding-3"
										data-highlighted={highlightedAttributeId === attribute.id ? '' : undefined}
										onmouseenter={() => {
											highlightedAttributeId = attribute.id
										}}
										onmouseleave={() => {
											highlightedAttributeId = null
										}}
									>
										<span>{attribute.displayName}</span>
										<data
											data-badge="small"
											value={evalAttr.evaluation.value.rating}
										>{evalAttr.evaluation.value.rating}</data>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</section>
			</div>

			<div class="attributes" data-column>
				{#each attributes as { attribute, evalAttr }}
					{@render attributeSnippet({
						attrGroupId: attrGroup.id,
						attribute,
						evalAttr,
					})}
				{/each}
			</div>
		</section>
	{/if}
{/snippet}


{#snippet attributeSnippet({
	attrGroupId,
	attribute,
	evalAttr,
}: {
	attrGroupId: string
	attribute: Attribute<any>
	evalAttr: EvaluatedAttribute<any>
})}
	{@const relevantVariants = attrToRelevantVariants.get(attribute.id) ?? []}

	{@const override = getAttributeOverride(wallet, attrGroupId, attribute.id)}

	{@const howToImprove = override?.howToImprove !== undefined ? override.howToImprove : evalAttr.evaluation.howToImprove}

	{@const variantSpecificCaption = (() => {
		const thisVariantSpecificity = relevantVariants.length === 0 ? VariantSpecificity.ALL_SAME : relevantVariants.length === 1 ? VariantSpecificity.ONLY_ASSESSED_FOR_THIS_VARIANT : VariantSpecificity.NOT_UNIVERSAL

		switch (thisVariantSpecificity) {
			case VariantSpecificity.ALL_SAME:
				return null
			case VariantSpecificity.ONLY_ASSESSED_FOR_THIS_VARIANT:
				return selectedVariant ? `This rating is only relevant for the ${variantToName(selectedVariant, false)} version.` : null
			default:
				return selectedVariant ? `This rating is specific to the ${variantToName(selectedVariant, false)} version.` : 'This rating differs across versions. Select a specific version for details.'
		}
	})()}

	<section 
		class="attribute" 
		id={slugifyCamelCase(attribute.id)} 
		aria-label={attribute.displayName}
		style:--accent={ratingToColor(evalAttr.evaluation.value.rating)}
		data-rating={evalAttr.evaluation.value.rating.toLowerCase()}
		data-icon={attribute.icon}
	>
		<details
			data-card="radius-8 padding-0 border-accent"
			data-column="gap-0"
			open
		>
			<summary data-row>
				<header data-row>
					<div>
						<div data-row="start gap-2">
							<a href={`#${slugifyCamelCase(attribute.id)}`}>
								<h3 data-icon={attribute.icon}>
									{attribute.displayName}
								</h3>
							</a>

							{#if 0 < relevantVariants.length && relevantVariants.length < Object.keys(wallet.variants).length}
								<div
									class="variant-indicator"
									data-badge="small"
									data-row="gap-2"
									style:--accent="var(--color-accent-pink-light)"
									title={`Only rated on the ${variantToName(relevantVariants[0], false)} version`}
								>
									{#if relevantVariants.length === 1}
										<small>Only</small>
									{/if}

									{#each relevantVariants as variant}
										<span class="variant-badge" data-row="gap-1">
											{@html variants[variant].icon}
										</span>
									{/each}
								</div>
							{/if}
						</div>

						{#if attribute.question}
							<div class="subsection-caption">
								<Typography
									content={attribute.question}
									strings={{ WALLET_NAME: wallet.metadata.displayName }}
								/>
							</div>
						{/if}
					</div>

					<data
						data-badge="medium"
						value={evalAttr.evaluation.value.rating}
					>{evalAttr.evaluation.value.rating}</data>
				</header>
			</summary>

			<div
				class="rating-display"
				data-rating={evalAttr.evaluation.value.rating.toLowerCase()}
				data-card
			>
				<div class="rating-icon" data-row="center">
					{ratingIcons[evalAttr.evaluation.value.rating as Rating]}
				</div>
				<div class="rating-content">
					{#if isTypographicContent(evalAttr.evaluation.details)}
						<Typography
							content={evalAttr.evaluation.details}
							strings={{ WALLET_NAME: wallet.metadata.displayName }}
						/>
					{:else if evalAttr.evaluation.details}
						<div data-column>
							<RenderCustomContent
								content={evalAttr.evaluation.details}
								{wallet}
								value={evalAttr.evaluation.value}
								references={toFullyQualified(evalAttr.evaluation.references || [])}
							/>
						</div>
					{:else}
						<div data-column>
							<Typography
								content={{
									contentType: ContentType.TEXT,
									text: `No detailed evaluation available for ${attribute.displayName}`,
								}}
							/>
						</div>
					{/if}
				</div>
			</div>

			{#if variantSpecificCaption}
				<div class="variant-caption">
					{variantSpecificCaption}
				</div>
			{/if}

			{#if evalAttr.evaluation.impact}
				<div class="impact">
					<Typography
						content={evalAttr.evaluation.impact}
						strings={{ WALLET_NAME: wallet.metadata.displayName }}
					/>
				</div>
			{/if}

			<ReferenceLinks references={toFullyQualified(evalAttr.evaluation.references || [])} />

			{#if attribute.id === 'hardwareWalletSupport' && evalAttr.evaluation.value && typeof evalAttr.evaluation.value === 'object' && 'supportedHardwareWallets' in evalAttr.evaluation.value && Array.isArray(evalAttr.evaluation.value.supportedHardwareWallets) && evalAttr.evaluation.value.supportedHardwareWallets.length > 0}
				<div class="supported-hardware-wallets" data-card="secondary padding-3" data-column="gap-2">
					<h5>Supported Hardware Wallets:</h5>
					<div class="hw-wallet-list" data-row="gap-2 wrap">
						{#each evalAttr.evaluation.value.supportedHardwareWallets as hwWallet}
							<div
								class="hw-wallet-badge"
								data-type={typeof hwWallet === 'string' ? hwWallet.toLowerCase() : ''}
								data-row="gap-2"
							>
								{
									typeof hwWallet === 'string' ?
										{
											LEDGER: 'Ledger',
											TREZOR: 'Trezor',
											KEYSTONE: 'Keystone',
											GRIDPLUS: 'GridPlus',
											KEEPKEY: 'KeepKey',
											FIREFLY: 'FireFly',
										}[hwWallet]
										?? hwWallet
									:
										'Unknown'
								}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<div class="attribute-accordions" data-column>
				<details data-card="secondary padding-0 radius-4" data-column="gap-0">
					<summary>
						<h4>
							{evalAttr.evaluation.value.rating === Rating.PASS || evalAttr.evaluation.value.rating === Rating.UNRATED ? 'Why does this matter?' : 'Why should I care?'}
						</h4>
					</summary>

					<section>
						{#if attribute.why}
							<Typography
								content={attribute.why}
							/>
						{:else}
							<p>No explanation available.</p>
						{/if}
					</section>
				</details>

				<details data-card="secondary padding-0 radius-4" data-column="gap-0">
					<summary>
						<h4>
							{attribute.wording?.midSentenceName === null ? attribute.wording?.howIsEvaluated ?? 'How is this evaluated?' : `How is ${attribute.wording?.midSentenceName ?? 'this'} evaluated?`}
						</h4>
					</summary>

					<section>
						<div class="methodology" data-column="gap-6">
							{#if attribute.methodology}
								<Typography content={attribute.methodology} />
							{:else}
								<p>No methodology information available.</p>
							{/if}

							{#if attribute.ratingScale}
								<hr />

								{#if attribute.ratingScale.display === 'simple'}
									<div class="simple-scale" data-card="radius-4">
										<Typography content={attribute.ratingScale.content} />
									</div>
								{:else}
									<div class="example-scale" data-card="radius-4">
										{#if attribute.ratingScale.exhaustive}
											<h5>A few examples:</h5>
										{/if}

										<ul data-column>
											{#if attribute.ratingScale.pass}
												<li data-icon={ratingIcons[Rating.PASS]}>
													<Typography
														content={{
															contentType: ContentType.MARKDOWN,
															markdown: [
																'A wallet would get a **passing** rating if...',
																[attribute.ratingScale.pass]
																	.flat()
																	.map(
																		example =>
																			`* ${(example.description.contentType === ContentType.MARKDOWN ? example.description.markdown : example.description.text).trim()}`,
																	)
																	.join('\n'),
															].join('\n\n'),
														}}
													/>
												</li>
											{/if}

											{#if attribute.ratingScale.partial}
												<li data-icon={ratingIcons[Rating.PARTIAL]}>
													<Typography
														content={{
															contentType: ContentType.MARKDOWN,
															markdown: [
																'A wallet would get a **partial** rating if...',
																[attribute.ratingScale.partial]
																	.flat()
																	.map(
																		example =>
																			`* ${(example.description.contentType === ContentType.MARKDOWN ? example.description.markdown : example.description.text).trim()}`,
																	)
																	.join('\n'),
															].join('\n\n'),
														}}
													/>
												</li>
											{/if}

											{#if attribute.ratingScale.fail}
												<li data-icon={ratingIcons[Rating.FAIL]}>
													<Typography
														content={{
															contentType: ContentType.MARKDOWN,
															markdown: [
																'A wallet would get a **failing** rating if...',
																[attribute.ratingScale.fail]
																	.flat()
																	.map(
																		example =>
																			`* ${(example.description.contentType === ContentType.MARKDOWN ? example.description.markdown : example.description.text).trim()}`,
																	)
																	.join('\n'),
															].join('\n\n'),
														}}
													/>
												</li>
											{/if}
										</ul>
									</div>
								{/if}
							{/if}
						</div>
					</section>
				</details>

				{#if howToImprove}
					<details data-card="secondary padding-0 radius-4" data-column="gap-0">
						<summary>
							<h4>
								{#if attribute.wording?.midSentenceName === null}
									{#if attribute.wording?.whatCanWalletDoAboutIts}
										<Typography
											content={attribute.wording?.whatCanWalletDoAboutIts}
											strings={{ WALLET_NAME: wallet.metadata.displayName }}
										/>
									{:else}
										{`What can ${wallet.metadata.displayName} do about this?`}
									{/if}
								{:else}
									{`What can ${wallet.metadata.displayName} do about its ${attribute.wording?.midSentenceName || 'feature'}?`}
								{/if}
							</h4>
						</summary>

						<section>
							<Typography
								content={howToImprove}
								strings={{
									WALLET_NAME: wallet.metadata.displayName,
									WALLET_PSEUDONYM_SINGULAR: wallet.metadata.pseudonymType?.singular ?? null,
									WALLET_PSEUDONYM_PLURAL: wallet.metadata.pseudonymType?.plural ?? null,
								}}
							/>

							{#if override}
								<div class="note" data-card="secondary padding-3" data-row="gap-2">
									<div class="icon">ℹ️</div>
									<div>
										<p>
											{`Note: This recommendation is specific to ${wallet.metadata.displayName} from the Wallet Beat team, not our general recommendation for all wallets of this type.`}
										</p>
									</div>
								</div>
							{/if}
						</section>
					</details>
				{/if}
			</div>
		</details>
	</section>
{/snippet}


<style>
	.container {
		--content-maxWidth: 54rem;

		--wallet-icon-size: 3rem;
		--border-radius-lg: 1rem;
		--border-radius: 0.5rem;
		--border-radius-sm: 0.25rem;
		--nav-width: 20rem;

		display: grid;
		grid-template:
			'Content Nav'
			/ minmax(0, 1fr) auto
		;
		@media (max-width: 1024px) {
			grid-template:
				'Nav Content'
				/ auto minmax(0, 1fr)
			;
		}
		@media (max-width: 864px) {
			grid-template:
				[Nav-start]
				'Content'
				[Nav-end]
				/ [Nav-start] minmax(0, 1fr) [Nav-end]
			;
		}

		line-height: 1.6;

		position: relative;

		@supports (scroll-marker-group: before) {
			&[data-sticky-container] {
				--sticky-paddingInlineEnd: var(--nav-width);
			}
		}

		@supports not (scroll-marker-group: before) {
			&::before {
				content: '';
				grid-area: Nav;
			}
		}

		article {
			grid-area: Content;

			max-height: 100dvh;
			overflow: hidden auto;

			scroll-padding-block-start: 5rem;
			scroll-padding-block-end: 1rem;

			scroll-marker-group: before;

			display: grid;

			&::scroll-marker-group {
				z-index: 2;
				grid-area: Nav;

				scroll-padding-block: 0.5rem;
				box-sizing: border-box;
				position: sticky;
				top: 0;
				width: var(--nav-width);
				max-height: 100dvh;

				overflow-y: auto;
				scroll-behavior: smooth;

				display: grid;
				align-content: start;
				padding: calc(2.5rem + 1rem) 0.75rem 1rem;
				gap: 2px;

				background:
					linear-gradient(
						to right,
						transparent 1.66rem,
						var(--border-color) 1.66rem,
						var(--border-color) calc(1.66rem + 1px),
						transparent calc(1.66rem + 1px)
					) 
					0 calc(2.5rem + 1rem) / 100% calc(100% - calc(2.5rem + 1rem) - 1rem) no-repeat,
					var(--background-secondary)
				;
				border-inline: 1px solid var(--border-color);
			}

			@media (max-width: 864px) {
				&::scroll-marker-group {
					top: calc(var(--navigation-mobile-blockSize) + 4rem);
					max-height: calc(100dvh - var(--navigation-mobile-blockSize) - 4rem);

					transition-property: translate;
					transition-timing-function: var(--ease-out-expo);
					transition-duration: 0.3s;
				}

				&::scroll-marker-group:not(:focus-within) {
					translate: -100% 0;
				}
			}

			> :is(header, section, footer) {
				justify-content: center;
				padding: 3rem max(1.5rem, (100cqi - var(--content-maxWidth)) / 2);
			}
		}
	}

	a:has(> :is(h1, h2, h3)) {
		display: flex;
		align-items: center;

		color: inherit;
		text-decoration: none;

		&:hover {
			color: var(--accent);
		}

		&::before {
			content: '# ';
			display: inline-flex;
			justify-content: end;
			text-align: end;
			width: 0;
			padding-inline-end: 0.66rem;
			margin-inline-start: -0.66rem;
			font-size: 1.25rem;
			line-height: calc(1 / 0.7);

			transition-property: opacity;
		}

		&:not(:hover)::before {
			opacity: 0;
		}
	}

	@property --wallet-icon-size {
		syntax: "<length>";
		inherits: true;
		initial-value: 0;
	}

	@supports (animation-timeline: scroll()) {
		article {
			> header#top {
				view-timeline-name: --header-timeline;
				view-timeline-axis: block;

				.wallet-name {
					h1 img {
						position: sticky;
						position: absolute;
						top: 0;
						z-index: 2;

						transition-property: opacity;
						opacity: 1;

						animation: WalletIconAnimation var(--transition-easeOutExpo) both;
						animation-timeline: --header-timeline;
						animation-range: exit 0% exit 120%;
					}

					&:hover h1 img {
						opacity: 0.75;
					}
				}
			}

			a:has(> h2) {
				view-timeline-name: --heading-timeline;
				view-timeline-axis: block;

				animation: SectionHeadingAnimation var(--transition-easeInOutExpo) both;
				animation-timeline: view();
				animation-range: entry calc(100vh - 6rem) entry calc(100vh - 3rem);

				&::before {
					animation: SectionHeadingArrowAnimation var(--transition-easeInOutExpo) forwards;
					animation-timeline: --heading-timeline;
					animation-range: entry calc(100vh - 6rem) entry calc(100vh - 3rem);
				}
			}
		}

		@keyframes WalletIconAnimation {
			from {
				position: static;
				--wallet-icon-size: 3rem;
			}
			79% {
				opacity: 1;
				position: static;
				scale: 1;
			}
			80% {
				position: absolute;
				top: -5rem;
				scale: 0.25;
			}
			to {
				top: 1rem;
				--wallet-icon-size: 2.25rem;
			}
		}

		@keyframes SectionHeadingAnimation {
			to {
				margin-left: calc(var(--wallet-icon-size) + 1.25rem);
			}
		}

		@keyframes SectionHeadingArrowAnimation {
			from {
				opacity: 0;
			}
			to {
				content: '› ';
				opacity: 1;
			}
		}
	}

	.nav-title {
		z-index: 3;

		position: absolute;
		left: auto;
		right: 0;

		@media (max-width: 1024px) {
			right: auto;
			left: 0;
		}

		@media (max-width: 864px) {
			transition-property: translate;
			translate: -100% 0;
		}

		bottom: auto;
		padding: 1rem;
		width: calc(var(--nav-width) - 1px);

		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--border-color);

		font-size: 0.875rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 500;

		pointer-events: none;

		@supports not (scroll-marker-group: before) {
			display: none;
		}
	}

	.wallet-name {
		h1 {
			font-size: 2.25rem;
		}
	}

	.wallet-icon {
		width: var(--wallet-icon-size);
		height: var(--wallet-icon-size);
		filter: drop-shadow(0 0 0.5rem rgba(255, 255, 255, 0.1));
	}

	.wallet-overview {

		.wallet-links {
			grid-template-columns: repeat(auto-fit, minmax(120px, auto));

			.wallet-link {
				grid-template-columns: auto 1fr;
				align-items: center;
				border: 1px solid var(--border-color);
				color: var(--text-primary);
				text-decoration: none;
				font-weight: 500;
				font-size: 0.9rem;
				white-space: nowrap;

				&:hover {
					background-color: var(--background-secondary);
				}

				&::before {
					content: '';
					width: 1rem;
					height: 1rem;
					background-size: contain;
				}

				&.website::before {
					background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'/></svg>");
				}

				&.repo::before {
					background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/></svg>");
				}
			}
		}

		.wallet-platforms {
			font-size: 0.9rem;
			color: var(--text-secondary);

			.variant-disclaimer {
				font-style: italic;
			}
		}
	}

	.platforms-label {
		color: var(--accent);
	}

	.attribute-group {
		&:has(.attribute:nth-of-type(1)) { --attributesCount: 1; }
		&:has(.attribute:nth-of-type(2)) { --attributesCount: 2; }
		&:has(.attribute:nth-of-type(3)) { --attributesCount: 3; }
		&:has(.attribute:nth-of-type(4)) { --attributesCount: 4; }
		&:has(.attribute:nth-of-type(5)) { --attributesCount: 5; }
		&:has(.attribute:nth-of-type(6)) { --attributesCount: 6; }
		&:has(.attribute:nth-of-type(7)) { --attributesCount: 7; }
		&:has(.attribute:nth-of-type(8)) { --attributesCount: 8; }
		&:has(.attribute:nth-of-type(9)) { --attributesCount: 9; }

		timeline-scope: --AttributesViewTimeline;

		scroll-margin-top: 3.5rem;
		padding: 3rem 1.5rem;

		&::scroll-marker {
			content: attr(data-icon) '\00a0\00a0' attr(aria-label);

			padding: 0.45rem 2rem 0.45rem 0.45rem;

			font-size: 0.975em;

			color: inherit;
			font-weight: 500;
			text-decoration: none;

			border-radius: 0.375rem;
			background:
				radial-gradient(
					circle closest-side,
					var(--accent, var(--text-secondary)) calc(100% - 0.5px),
					transparent 100%
				)
				no-repeat right calc(1.15rem - 0.25em) center / 0.5em 0.5em
				var(--background-secondary)
			;

			transition-property: background-color, color, outline;
		}

		&::scroll-marker:hover:not(:target-current) {
			background-color: var(--background-primary);
			color: var(--accent);
		}

		&::scroll-marker:target-current {
			background-color: var(--background-primary);
			color: var(--accent);
			font-weight: 500;
		}

		&::scroll-marker:focus {
			outline: 2px solid var(--accent);
			outline-offset: -1px;
		}

		&::scroll-marker:active {
			background-color: var(--background-primary);
		}

		> header {
			padding-block: 1rem;

			&[data-sticky]::before {
				content: '';
				inset: -0.5rem -6rem;
				mask-image: linear-gradient(to top, transparent, white 0.5rem);
			}

			h2 {
				font-size: 1.8rem;
				font-weight: 700;
			}

			.section-controls {
				display: flex;
				align-items: center;
				gap: 1rem;

				.section-score {
					display: flex;
					align-items: center;
					gap: 0.25rem;
					padding: 0.5rem 1.15rem;
					border-radius: var(--border-radius);
					font-weight: 500;
					color: white;
					font-size: 0.9rem;
					box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
					background-color: var(--accent, transparent);

					.unrated-hint {
						cursor: help;
					}
				}
			}
		}

		.section-caption {
			opacity: 0.8;
			font-style: italic;
		}
	}

	.attributes-overview {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
		align-items: center;

		transition-property: background-color;

		@container not scroll-state(stuck: none) {
			background-color: transparent;
		}

		@container (max-width: 600px) {
			grid-template-columns: 1fr;
			justify-items: center;
		}

		> .attributes-pie {
			display: flex;
			align-items: center;

			font-size: 2.5em;
		}

		> .attributes-list {
			transition-property: translate, scale, opacity;

			@container not scroll-state(stuck: none) {
				translate: 0 -2rem;
				scale: 0.95;
				opacity: 0;
				pointer-events: none;
			}

			h3 {
				font-size: 1rem;
				font-weight: 700;
				margin: 0 0 0.5rem 0;
			}

			ul {
				list-style: none;
				margin: 0;
				padding: 0;

				li {
					display: contents;
				}

				a {
					display: grid;
					grid-template-columns: auto 1fr auto;
					gap: 0.5rem;
					align-items: center;
					padding: 0.5rem;
					color: var(--text-primary);
					text-decoration: none;
					font-size: 0.875rem;

					&:hover,
					&[data-highlighted] {
						background-color: var(--background-tertiary);
					}

					&::before {
						content: '';
						width: 1em;
						height: 1em;
						border-radius: 50%;
						border: 1px solid var(--border-color);
						flex-shrink: 0;
						background-color: var(--accent);
					}
				}
			}

			.no-attributes {
				color: var(--text-secondary);
				font-style: italic;
				font-size: 0.875rem;
				text-align: center;
				padding: 2rem 0;
			}
		}
	}

	@container (min-width: 1140px) {
		.attributes-overview-container {
			@supports (container-type: scroll-state) {
				container-type: scroll-state;
				position: sticky;
				top: -1rem;
			}
		}

		.attributes-pie {
			background-image: radial-gradient(circle closest-side, var(--background-secondary) 90%, transparent 90%);

			animation:
				AttributesPieAngleAnimation steps(var(--attributesCount), jump-end) forwards,
				AttributesPieTransformAnimation var(--transition-easeOutExpo) both
			;
			animation-range:
				entry 50% exit 50%,
				entry 0% exit 100%
			;
			animation-timeline: --AttributesViewTimeline;

			> :global(*) {
				transition-property: translate, scale, opacity;
				transition-duration: 0.5s;
				translate: var(--translate);
				scale: var(--scale);
				opacity: var(--opacity);
			}

			:global {
				.slice {
					transition-property: transform, opacity !important;
					opacity: calc(1 - clamp(0, abs(var(--pie-slice-highlightIndex) - var(--i)), 1) * 0.5 * var(--isTransformed));
				}
			}
		}

		@keyframes AttributesPieAngleAnimation {
			from {
				--isTransformed: 1;
				--pie-slice-highlightIndex: 0;
				--pie-rotate: calc(-0.25turn + 0.5turn / var(--attributesCount));
			}
			to {
				--isTransformed: 1;
				--pie-slice-highlightIndex: var(--attributesCount);
				--pie-rotate: calc(-0.25turn + 0.5turn / var(--attributesCount) + 1turn);
			}
			exit 100% {
				--isTransformed: 0;
				--pie-rotate: 1turn;
			}
		}

		@keyframes AttributesPieTransformAnimation {
			entry 40% {
				--translate: 0px 0px;
			}
			entry 55% {
				--translate: calc(-50% - 1rem) calc(50vh - 50%);
			}	

			exit 47.5% {
				--translate: calc(-50% - 1rem) calc(50vh - 50%);
				--scale: 1;
				--opacity: 1;
			}
			exit 75% {
				--opacity: 0;
			}
			exit 100% {
				--scale: 0;
				--translate: 0 0;
			}
		}
	}

	.attributes {
		view-timeline: --AttributesViewTimeline block;

		position: relative;

		.attributes-pie {
			position: sticky;
			left: 0;
			top: 50vh;
			width: max-content;
			height: 0;
			translate: -50% -50%;
		}
	}

	.attribute {
		position: relative;

		&::scroll-marker {
			content: attr(data-icon) '\00a0\00a0' attr(aria-label);

			margin-left: 1.5rem;
			padding: 0.45rem 0.75rem;

			position: relative;

			font-size: 0.9em;

			border-radius: 0.375rem;
			background:
				radial-gradient(
					circle closest-side,
					var(--accent, var(--text-secondary)) calc(100% - 0.5px),
					transparent 100%
				)
				no-repeat right calc(1.15rem - 0.25em) center / 0.5em 0.5em
				var(--background-secondary)
			;


			color: inherit;
			font-weight: 500;
			text-decoration: none;


			transition-property: background-color, color, outline;
		}

		&::scroll-marker:hover:not(:target-current) {
			background-color: var(--background-primary);
			color: var(--accent);
		}

		&::scroll-marker:target-current {
			background-color: var(--background-primary);
			color: var(--accent);
			font-weight: 500;
		}

		&::scroll-marker:focus {
			outline: 2px solid var(--accent);
			outline-offset: -1px;
		}

		&::scroll-marker:active {
			background-color: var(--background-primary);
		}

		> details {
			display: grid;
			scroll-margin-top: 3.5rem;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
			transition:
				box-shadow 0.2s ease,
				transform 0.2s ease;

			&:hover {
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
				transform: translateY(-1px);
			}

			> summary {
				padding: 1.5rem;

				> header {
					flex-grow: 1;

					> div {
						display: grid;
						gap: 0.5rem;

						h3 {
							font-weight: 600;
						}
					}
				}
			}

			&::details-content {
				padding: 1.5rem;
				padding-top: 0;

				display: grid;
				gap: 1.5rem;
			}

			&:not([open])::details-content {
				padding-block: 0;
			}

			.subsection-caption {
				opacity: 0.8;
				color: var(--text-secondary);
			}

			.rating-display {
				grid-template-columns: auto 1fr;
				font-weight: 500;
				background-color: color-mix(in srgb, var(--accent) 5%, var(--background-secondary));
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

				&[data-rating='exempt'] {
					opacity: 0.7;
				}

				.rating-icon {
					width: 1.5rem;
					height: 1.5rem;
					font-size: 1.2rem;
					color: var(--accent);
				}

				.rating-content > div {
					color: var(--text-secondary);
				}
			}

			.variant-caption {
				color: var(--text-secondary);
				font-style: italic;
				font-size: 0.9rem;
				opacity: 0.7;
			}

			.impact {
				color: var(--text-secondary);
				font-style: italic;
				opacity: 0.7;
			}
		}
	}

	.return-to-top {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		z-index: 10;
		display: grid;
		place-items: center;
		width: 3rem;
		height: 3rem;
		background-color: var(--accent);
		color: var(--text-inverse);
		border-radius: 50%;
		text-decoration: none;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		font-weight: bold;

		&:hover {
			background-color: var(--accent-light);
		}
	}

	.not-implemented {
		opacity: 0.7;
	}

	.methodology {

		.simple-scale,
		.example-scale {

			> h5 {
				margin: 0;
				font-size: 1rem;
				font-weight: 600;
			}
		}

		.simple-scale {
			line-height: 1.5;
			color: var(--text-secondary);
		}

		.example-scale > ul {
			padding-inline-start: 1rem;

			> li {
				padding-inline-start: 0.5rem;

				&::marker {
					content: attr(data-icon);
				}
			}
		}
	}

	.note {
		grid-template-columns: auto 1fr;

		.icon {
			font-size: 1.2rem;
		}

		p:first-child {
			margin-top: 0;
		}
	}

	.supported-hardware-wallets {

		h5 {
			margin: 0;
			font-size: 0.9rem;
			font-weight: 600;
		}

		.hw-wallet-list {
			.hw-wallet-badge {
				padding: 0.25rem 0.75rem;
				background-color: var(--background-tertiary);
				border-radius: var(--border-radius-sm);
				font-size: 0.85rem;
				font-weight: 500;
				transition-property: all;
				border: 1px solid transparent;
				box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

				&:hover {
					transform: translateY(-2px);
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
			}
		}
	}

	.attribute-accordions {
		details {
			--details-transition-duration: 0.25s;
			--details-transform-closed: translateY(-4px);

			summary {
				cursor: pointer;
				padding: 1rem;
				transition: background-color 0.2s ease;
				border: 1px solid transparent;

				h4 {
					margin: 0;
					font-size: 1rem;
					font-weight: 600;
				}
			}

			section {
				display: grid;
				gap: 1rem;
				padding: 1rem;
				border-radius: var(--border-radius);
			}
		}
	}
</style>
