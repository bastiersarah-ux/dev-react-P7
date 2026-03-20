'use client';

export default function DrawerOverlay() {
	const handleClose = () => {
		const toggle = document.getElementById('drawer-toggle') as HTMLInputElement;
		if (toggle) toggle.checked = false;
	};

	return (
		<div
			className='drawer-overlay'
			aria-label='Fermer le menu'
			role='button'
			tabIndex={0}
			onClick={handleClose}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					handleClose();
				}
			}}
		/>
	);
}
