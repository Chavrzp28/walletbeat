<script lang="ts">
	// Types/constants
	import { isTypographicContent } from '@/types/content'
	import type { RatedWallet } from '@/schema/wallet'
	import { ladders } from '@/schema/ladders'
	import { StageCriterionRating, type StageEvaluatableWallet, type WalletLadderEvaluation, type WalletStage } from '@/schema/stages'
	import { getCriterionAttributeId, findAttributeById } from '@/utils/stage-attributes'
	import { slugifyCamelCase } from '@/types/utils/text'
	import { getStageNumber, getLadderType } from '@/utils/stage'


	// Components
	import Typography from '@/components/Typography.svelte'
	import WalletStageBadge from './WalletStageBadge.svelte'


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
	const ladderType = $derived(getLadderType(wallet, ladderEvaluation))
	const ladderDefinition = $derived(ladderType ? ladders[ladderType] : null)
	const stageNumber = $derived(
		stage && ladderEvaluation ? getStageNumber(stage, ladderEvaluation) : null
	)
	
	// Helper: get stage 0 from ladder
	const stage0 = $derived(ladderDefinition?.stages[0] ?? null)
	
	// Helper: get current stage index
	const currentStageIndex = $derived.by(() => {
		if (!stage || typeof stage === 'string' || !ladderDefinition) return null
		return ladderDefinition.stages.findIndex(s => s.id === stage.id)
	})
	
	// Helper: get next stage
	const nextStage = $derived.by(() => {
		if (currentStageIndex === null || !ladderDefinition) return null
		const nextIndex = currentStageIndex + 1
		return nextIndex < ladderDefinition.stages.length ? ladderDefinition.stages[nextIndex] : null
	})
	
	// Display stage: for QUALIFIED_FOR_NO_STAGES, show stage 0; otherwise show the actual stage
	const displayStage = $derived.by(() => {
		if (stage === 'QUALIFIED_FOR_NO_STAGES' && stage0) return stage0
		return stage && typeof stage !== 'string' ? stage : null
	})
	
	const displayStageNumber = $derived.by(() => {
		return stage === 'QUALIFIED_FOR_NO_STAGES' ? 0 : stageNumber
	})
	
	// Target stage: what criteria to show
	const targetStage = $derived.by(() => {
		if (showNextStageCriteria) {
			return stage === 'QUALIFIED_FOR_NO_STAGES' ? stage0 : nextStage
		}
		if (stage === 'QUALIFIED_FOR_NO_STAGES') return stage0
		if (stage === 'NOT_APPLICABLE' || stage === null) return null
		return displayStage
	})
	const criteria = $derived.by(() => {
		if (!targetStage || typeof targetStage !== 'object' || !('criteriaGroups' in targetStage)) {
			return []
		}
		
		return targetStage.criteriaGroups.flatMap(criteriaGroup =>
			criteriaGroup.criteria
				.filter(criterion => typeof criterion.evaluate === 'function')
				.map(criterion => {
					const evaluation = criterion.evaluate(stageEvaluatableWallet)
					return { criteriaGroup, criterion, evaluation }
				})
				.filter(({ evaluation }) => 
					showNextStageCriteria ? evaluation.rating !== StageCriterionRating.PASS : true
				)
		)
	})
	
	const targetStageNumber = $derived.by(() => {
		return showNextStageCriteria 
			? (stage === 'QUALIFIED_FOR_NO_STAGES' ? 0 : (displayStageNumber ?? 0) + 1)
			: (displayStageNumber ?? 0)
	})
	
	// Rating display helpers
	const getRatingIcon = (rating: StageCriterionRating) => 
		rating === StageCriterionRating.FAIL ? '❌' :
		rating === StageCriterionRating.EXEMPT ? '⚠️' :
		'❓'
	
	const getRatingColor = (rating: StageCriterionRating) =>
		rating === StageCriterionRating.FAIL ? 'var(--rating-fail)' :
		rating === StageCriterionRating.EXEMPT ? 'var(--rating-exempt)' :
		'var(--rating-unrated)'
	
	// Helper to wrap badge with click handler or link
	const handleBadgeClick = (stageNum: number) => (e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		onStageClick?.(stageNum)
	}

</script>


<section data-column>
	{#if stage === 'NOT_APPLICABLE'}
		<header data-column="gap-2">
			<h2 data-row="gap-2">
				<WalletStageBadge stage={stage} ladderEvaluation={ladderEvaluation} size="large" />
			</h2>
		</header>
		<p>
			Stage rating is not applicable to this wallet.
		</p>
	{:else if stage === 'QUALIFIED_FOR_NO_STAGES'}
		<header data-column="gap-2">
			<h3 data-row="gap-2">
				{#if onStageClick}
					<button type="button" onclick={handleBadgeClick(0)}>
						<WalletStageBadge stage={stage} ladderEvaluation={ladderEvaluation} size="large" />
					</button>
				{:else}
					<WalletStageBadge stage={stage} ladderEvaluation={ladderEvaluation} size="large" />
				{/if}
			</h3>
		</header>
	{:else if displayStage && displayStageNumber !== null}
		<header data-column="gap-2">
			<h3 data-row="gap-2 start">
				{#if onStageClick}
					<button type="button" onclick={handleBadgeClick(displayStageNumber)}>
						<WalletStageBadge stage={displayStage} ladderEvaluation={ladderEvaluation} size="large" />
					</button>
				{:else}
					<a data-link="camouflaged" href={`/${wallet.metadata.id}#stage-${displayStageNumber}`}>
						<WalletStageBadge stage={displayStage} ladderEvaluation={ladderEvaluation} size="large" />
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
			{#if showNextStageCriteria && targetStage}
				<h4>
					Criteria needed to advance to
					{#if onStageClick}
						<button type="button" onclick={handleBadgeClick(targetStageNumber)}>
							<WalletStageBadge stage={targetStage} ladderEvaluation={ladderEvaluation} size="medium" />
						</button>
					{:else}
						<a data-link="camouflaged" href={`/${wallet.metadata.id}#stage-${targetStageNumber}`}>
							<WalletStageBadge stage={targetStage} ladderEvaluation={ladderEvaluation} size="large" />
						</a>
					{/if}
					:
				</h4>
			{/if}

			<ul data-column="gap-2">
				{#each criteria as { criteriaGroup, criterion, evaluation }}
					{@const attributeId = getCriterionAttributeId(criterion)}
					{@const attribute = attributeId ? findAttributeById(attributeId) : null}
					{@const attributeName = attribute?.displayName ?? attributeId}
					{@const attributeLink = attributeId ? `/${wallet.metadata.id}#${slugifyCamelCase(attributeId)}` : null}

					<li data-row="start gap-2">
						<span style="color: {getRatingColor(evaluation.rating)}">{getRatingIcon(evaluation.rating)}</span>
						<span>
							{#if attribute}
								<span>{@html attribute.icon}</span>
							{/if}
							{#if attributeName}
								{#if attributeLink}
									<a data-link="camouflaged" href={attributeLink} title={attributeName}>
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
