'use client';

import styles from './PageHeader.module.css';
import CreateOrUpdateProject from './dialogs/CreateOrUpdateProject';

/** Props du header de page */
type PageHeaderProp = {
	title: string;
	subtitle: string;
};

/** Header d'une page avec titre et bouton de création */
export default function PageHeader({ title, subtitle }: PageHeaderProp) {
	return (
		<div className={styles['dashboard-header-custom']}>
			<div>
				<h2>{title}</h2>

				<h3>{subtitle}</h3>
			</div>

			<CreateOrUpdateProject />
		</div>
	);
}
