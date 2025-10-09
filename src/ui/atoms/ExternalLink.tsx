import { Link, type TypographyOwnProps } from '@mui/material'
import type React from 'react'
import { useState } from 'react'
import { LuExternalLink } from 'react-icons/lu'

import { labeledUrl, type Url } from '@/schema/url'

export function ExternalLink({
	url,
	defaultLabel = undefined,
	color = undefined,
	style = undefined,
	rel = 'noopener noreferrer nofollow',
	children = undefined,
}: {
	url: Url
	defaultLabel?: string
	color?: TypographyOwnProps['color']
	style?: React.CSSProperties
	rel?: string
	children?: React.ReactNode
}): React.JSX.Element {
	const labeled = labeledUrl(url, defaultLabel)
	const [hovered, setHovered] = useState(false)

	return (
		<span className='inline-block'>
			<Link
				href={labeled.url}
				target='_blank'
				rel={rel}
				style={{
					color: color ?? 'var(--link-color)',
					...style,
				}}
				className='flex flex-row gap-2 items-baseline'
				onMouseEnter={() => {
					setHovered(true)
				}}
				onMouseLeave={() => {
					setHovered(false)
				}}
			>
 			<span
 				className='inline-block'
 				style={{ textDecoration: 'underline' }}
 			>
 				{children ?? labeled.label}
 			</span>{' '}
				<LuExternalLink />
			</Link>
		</span>
	)
}
