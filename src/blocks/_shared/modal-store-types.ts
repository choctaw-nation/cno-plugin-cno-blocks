export type ModalState = {
	isModalOpen: boolean;
	modal: HTMLDialogElement | null;
	modalTitle: string;
	statusMessage?: string;
	status: 'loading' | 'error' | null;
	allowBodyScrollWhileOpen?: boolean;
	closeWithBackdropClick?: boolean;
	source: 'gform' | 'cnhsa-guidelines' | 'innerblocks';
};
export type TriggerContext = {
	modalTitle: string;
	closeWithBackdropClick: boolean;
	allowBodyScrollWhileOpen: boolean;
	source: 'cnhsa-guidelines' | 'innerblocks';
	gformId?: number;
};
