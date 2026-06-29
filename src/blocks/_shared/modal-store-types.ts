export type ModalState = {
	isModalOpen: boolean;
	modal: HTMLDialogElement | null;
	modalTitle: string;
	statusMessage?: string;
	status: 'loading' | 'error' | null;
	allowBodyScrollWhileOpen?: boolean;
	closeWithBackdropClick?: boolean;
	source: 'cnhsa-guidelines' | 'innerblocks';
	readonly cnhsaGuidelinesHidden: boolean;
	readonly innerBlocksHidden: boolean;
};
export type TriggerContext = {
	modalTitle: string;
	closeWithBackdropClick: boolean;
	allowBodyScrollWhileOpen: boolean;
	source: 'cnhsa-guidelines' | 'innerblocks';
	gformId?: number;
};
