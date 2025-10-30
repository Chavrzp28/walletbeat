export enum FirmwareType {
	PASS = 'PASS',
	PARTIAL = 'PARTIAL',
	FAIL = 'FAIL',
}

export interface FirmwareSupport {
	type: FirmwareType
	url?: string
	details?: string
	silentUpdateProtection: FirmwareType | null
	firmwareOpenSource: FirmwareType | null
	reproducibleBuilds: FirmwareType | null
	customFirmware: FirmwareType | null
}
