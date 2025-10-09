import {
	LuBadgeCheck,
	LuBadgeHelp,
	LuBuilding2,
	LuGithub,
	LuHouse,
	LuMessageCircleHeart,
} from 'react-icons/lu'

import { betaSiteRoot, repositoryUrl, socialChannel } from '@/constants'
import type { NavigationLinkItem } from '@/ui/organisms/Navigation'

export const navigationHome: NavigationLinkItem = {
	id: 'wallet-table',
	icon: <LuHouse />,
	title: 'Walletbeat',
	href: `${betaSiteRoot}/#`,
}

export const navigationFaq: NavigationLinkItem = {
	id: 'faq',
	icon: <LuBadgeHelp />,
	title: 'FAQ',
	href: `${betaSiteRoot}/faq`,
}

export const navigationAbout: NavigationLinkItem = {
	id: 'about',
	icon: <LuBuilding2 />,
	title: 'About Walletbeat',
	href: `${betaSiteRoot}/about`,
}

export const navigationCriteria: NavigationLinkItem = {
	id: 'criteria',
	icon: <LuBadgeCheck />,
	title: 'Evaluation Criteria',
	href: `${betaSiteRoot}/#criteria`,
}

export const navigationRepository: NavigationLinkItem = {
	id: 'code-repository',
	icon: <LuGithub />,
	title: 'Contribute on GitHub',
	href: repositoryUrl,
}

export const navigationFarcasterChannel: NavigationLinkItem = {
	id: 'farcaster-channel',
	icon: <LuMessageCircleHeart />,
	title: 'Discuss on Farcaster',
	href: socialChannel,
}

export const scrollPastHeaderPixels = 16
