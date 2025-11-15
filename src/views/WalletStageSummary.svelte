<script lang="ts">
	// Types/constants
	import { isTypographicContent } from '@/types/content'
	import type { RatedWallet } from '@/schema/wallet'
	import { WalletLadderType, ladders } from '@/schema/ladders'
	import { StageCriterionRating, type StageEvaluatableWallet, type WalletLadderEvaluation, type WalletStage } from '@/schema/stages'
	import { getCriterionAttributeId } from '@/utils/stage-attributes'
	import { slugifyCamelCase } from '@/types/utils/text'
	import { attributeTree } from '@/schema/attribute-groups'
	import { stageToColor } from '@/utils/colors'
	import { getStageNumber } from '@/utils/stage'


	// Components
	import Typography from '@/components/Typography.svelte'


	// Props
	const {
		wallet,
		stage,
		ladderEvaluation,
		showNextStageCriteria = true,
		onStageClick,
	}: {
		wallet: RatedWallet
		stage: WalletStage | 'NOT_APPLICABLE' | 'QUALIFIED_FOR_NO_STAGES' | null
		ladderEvaluation: WalletLadderEvaluation | null
		showNextStageCriteria?: boolean
		onStageClick?: (stageNumber: number) => void
	} = $props()


	// Derived
	const stageEvaluatableWallet: StageEvaluatableWallet = $derived({
		types: wallet.types,
		variants: wallet.variants,
		variantSpecificity: wallet.variantSpecificity,
		overall: wallet.overall,
		overrides: wallet.overrides,
	})
	const ladderType = $derived.by(() => {
		if (!ladderEvaluation) {
			return null
		}
		for (const [type, evaluation] of Object.entries(wallet.ladders)) {
			if (evaluation === ladderEvaluation) {
				return type as WalletLadderType
			}
		}
		return null
	})
	const ladderDefinition = $derived.by(() => {
		if (!ladderType) {
			return null
		}
		return ladders[ladderType]
	})
	const currentStageIndex = $derived.by(() => {
		if (!stage || typeof stage === 'string' || !ladderDefinition) {
			return null
		}
		return ladderDefinition.stages.findIndex(s => s.id === stage.id)
	})
	const stage0 = $derived.by(() => {
		if (!ladderDefinition) {
			return null
		}
		return ladderDefinition.stages[0] ?? null
	})
	const nextStage = $derived.by(() => {
		if (currentStageIndex === null || !ladderDefinition) {
			return null
		}
		const nextIndex = currentStageIndex + 1
		if (nextIndex >= ladderDefinition.stages.length) {
			return null
		}
		return ladderDefinition.stages[nextIndex]
	})
	const stageNumber = $derived(
		stage && ladderEvaluation ?
			getStageNumber(stage, ladderEvaluation)
		:
			null
	)
	const maxStages = $derived(
		ladderEvaluation?.ladder.stages.length ?? 3
	)
	const stageColor = $derived(
		stageToColor(stageNumber, maxStages)
	)
	const displayStage = $derived.by(() => {
		// For QUALIFIED_FOR_NO_STAGES, show stage 0
		if (stage === 'QUALIFIED_FOR_NO_STAGES' && stage0) {
			return stage0
		}
		return stage && typeof stage !== 'string' ? stage : null
	})
	const displayStageNumber = $derived.by(() => {
		if (stage === 'QUALIFIED_FOR_NO_STAGES') {
			return 0
		}
		return stageNumber
	})
	const displayStageColor = $derived(
		stageToColor(displayStageNumber, maxStages)
	)
	const displayNextStage = $derived.by(() => {
		// For QUALIFIED_FOR_NO_STAGES, next stage is stage 0 itself
		if (stage === 'QUALIFIED_FOR_NO_STAGES') {
			return stage0
		}
		return nextStage
	})
	const targetStage = $derived.by(() => {
		if (showNextStageCriteria) {
			// For QUALIFIED_FOR_NO_STAGES, show stage 0 criteria
			return stage === 'QUALIFIED_FOR_NO_STAGES' ? stage0 : nextStage
		} else {
			// Show criteria for the current stage
			if (stage === 'QUALIFIED_FOR_NO_STAGES') {
				return stage0
			}
			if (stage === 'NOT_APPLICABLE' || stage === null) {
				return null
			}
			return displayStage
		}
	})
	const criteria = $derived.by(() => {
		if (!targetStage || !ladderDefinition || typeof targetStage !== 'object' || !('criteriaGroups' in targetStage)) {
			return []
		}
		const results: Array<{ criteriaGroup: typeof targetStage.criteriaGroups[number], criterion: typeof targetStage.criteriaGroups[number]['criteria'][number], evaluation: ReturnType<typeof targetStage.criteriaGroups[number]['criteria'][number]['evaluate']> }> = []
		for (const criteriaGroup of targetStage.criteriaGroups) {
			for (const criterion of criteriaGroup.criteria) {
				if (typeof criterion.evaluate !== 'function') {
					continue
				}
				const evaluation = criterion.evaluate(stageEvaluatableWallet)
				if (showNextStageCriteria) {
					// Show missing criteria (non-PASS)
					if (evaluation.rating !== StageCriterionRating.PASS) {
						results.push({ criteriaGroup, criterion, evaluation })
					}
				} else {
					// Show all criteria for the current stage
					results.push({ criteriaGroup, criterion, evaluation })
				}
			}
		}
		return results
	})
	const targetStageNumber = $derived.by(() => {
		if (showNextStageCriteria) {
			return stage === 'QUALIFIED_FOR_NO_STAGES' ? 0 : (displayStageNumber ?? 0) + 1
		} else {
			return displayStageNumber ?? 0
		}
	})
	const targetStageColor = $derived(
		stageToColor(targetStageNumber, maxStages)
	)

</script>


<section data-column>
	{#if stage === 'NOT_APPLICABLE'}
		<header data-column="gap-2">
			<h2 data-row="gap-2">
				<data
					data-badge="large"
					value="NOT_APPLICABLE"
				>
					<strong>N/A</strong>
				</data>
			</h2>
		</header>
		<p>
			Stage rating is not applicable to this wallet.
		</p>
	{:else if stage === 'QUALIFIED_FOR_NO_STAGES'}
		<header data-column="gap-2">
			<h3 data-row="gap-2">
				{#if onStageClick}
					<button
						type="button"
						onclick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							onStageClick(0)
						}}
					>
						<data
							data-badge="large"
							value="NO_STAGES"
						>
							<strong>No Stage</strong>
						</data>
					</button>
				{:else}
					<data
						data-badge="large"
						value="NO_STAGES"
					>
						<strong>No Stage</strong>
					</data>
				{/if}
			</h3>
		</header>
	{:else if displayStage && displayStageNumber !== null}
		<header data-column="gap-2">
			<h3 data-row="gap-2 start">
				{#if onStageClick}
					<button
						type="button"
						onclick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							onStageClick(displayStageNumber)
						}}
					>
						<data
							data-badge="large"
							value={`STAGE_${displayStageNumber}`}
							style:--accent={displayStageColor}
						>
							<strong>
								Stage {displayStageNumber}
							</strong>
						</data>
					</button>
				{:else}
					<a data-link="camouflaged" href={`/${wallet.metadata.id}#stage-${displayStageNumber}`}>
						<data
							data-badge="large"
							value={`STAGE_${displayStageNumber}`}
							style:--accent={displayStageColor}
						>
							<strong>
								Stage {displayStageNumber}
							</strong>
						</data>
					</a>
				{/if}
				{#if isTypographicContent(displayStage.description)}
					<Typography content={displayStage.description} />
				{:else}
					{displayStage.id}
				{/if}
			</h3>
		</header>
	{/if}

	{#if targetStage && criteria.length > 0 && displayStageNumber !== null}
		{#if showNextStageCriteria}
			<hr>
		{/if}

		<section data-column="gap-4">
			{#if showNextStageCriteria}
				<h4>
					Criteria needed to advance to
					{#if onStageClick}
						<button
							type="button"
							onclick={(e) => {
								e.preventDefault()
								e.stopPropagation()
								onStageClick(targetStageNumber)
							}}
						>
							<data
								data-badge="medium"
								value={`STAGE_${targetStageNumber}`}
								style:--accent={targetStageColor}
							>
								<strong>
									Stage {targetStageNumber}
								</strong>
							</data>
						</button>
					{:else}
						<a data-link="camouflaged" href={`/${wallet.metadata.id}#stage-${targetStageNumber}`}>
							<data
								data-badge="large"
								value={`STAGE_${targetStageNumber}`}
								style:--accent={targetStageColor}
							>
								<strong>
									Stage {targetStageNumber}
								</strong>
							</data>
						</a>
					{/if}
					:
				</h4>
			{/if}

			<ul data-column="gap-2">
				{#each criteria as { criteriaGroup, criterion, evaluation }}
					{@const ratingIcon = evaluation.rating === StageCriterionRating.FAIL ? '❌' :
						evaluation.rating === StageCriterionRating.EXEMPT ? '⚠️' :
						'❓'
					}
					{@const ratingColor = evaluation.rating === StageCriterionRating.FAIL ? 'var(--rating-fail)' :
						evaluation.rating === StageCriterionRating.EXEMPT ? 'var(--rating-exempt)' :
						'var(--rating-unrated)'
					}
					{@const attributeId = getCriterionAttributeId(criterion)}
					{@const attributeLink = attributeId ? `/${wallet.metadata.id}#${slugifyCamelCase(attributeId)}` : null}
					{@const attribute = attributeId ? (() => {
						for (const attrGroup of Object.values(attributeTree)) {
							for (const attr of Object.values(attrGroup.attributes)) {
								if (attr.id === attributeId) {
									return attr
								}
							}
						}
						return null
					})() : null}
					{@const attributeName = attribute?.displayName ?? attributeId}
					{@const attributeTitle = attribute?.displayName ?? attributeId}

					<li data-row="start gap-2">
						<span style="color: {ratingColor}">{ratingIcon}</span>
						<span>
							{#if attribute}
								<span>{@html attribute.icon}</span>
							{/if}
							{#if attributeName}
								{#if attributeLink}
									<a data-link="camouflaged" href={attributeLink} title={attributeTitle}>
										<strong>{attributeName}</strong>
									</a>:
								{:else}
									<strong>{attributeName}</strong>:
								{/if}
								<span>
									{#if isTypographicContent(criterion.description)}
										<Typography content={criterion.description} />
									{:else}
										{criterion.id}
									{/if}
								</span>
							{:else}
								{#if isTypographicContent(criterion.description)}
									<Typography content={criterion.description} />
								{:else}
									{criterion.id}
								{/if}
							{/if}
						</span>
					</li>
				{/each}
			</ul>
		</section>
	{:else if showNextStageCriteria && nextStage}
		<p>
			<strong>All criteria met for next stage!</strong>
		</p>
	{/if}
</section>


<style>
	button {
		background: none;
		border: none;
		padding: 0;
	}

	li > span > span:last-child {
		color: var(--text-secondary);
	}
</style>
