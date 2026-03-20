'use client';

import SearchIcon from '@front/public/icon-search.svg';
import Image from 'next/image';

export default function SearchBar() {
	return (
		<label className='input h-full input-bordered flex items-center gap-2 w-72'>
			<input type='text' className='grow placeholder-gray-600 font-normal text-[14px]' placeholder='Rechercher une tâche' />
			<Image src={SearchIcon} alt='Icône commentaires' className='w-4 h-4' />
		</label>
	);
}
