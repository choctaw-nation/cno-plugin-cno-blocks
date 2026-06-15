export type ModalState = {
	isModalOpen: boolean;
	modal: HTMLDialogElement | null;
	modalTitle: string;
	statusMessage?: string;
	status: 'loading' | 'error' | null;
	source: 'gform' | 'cnhsa-guidelines' | 'innerblocks';
};
