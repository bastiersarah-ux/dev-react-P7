'use client';

import { useUserSearch } from '@front/hooks/useUserSearch';
import { User } from '@front/types/api-types';
import { useState } from 'react';

interface UserSelectorProps {
	selectedUsers: User[];
	setSelectedUsers: (users: User[]) => void;
}

export default function UserSelector({ selectedUsers, setSelectedUsers }: UserSelectorProps) {
	const [query, setQuery] = useState('');
	const { users } = useUserSearch(query);

	const addUser = (user: User) => {
		if (!selectedUsers.some((u) => u.id === user.id)) {
			setSelectedUsers([...selectedUsers, user]);
		}
		setQuery('');
	};

	const removeUser = (id: string) => {
		setSelectedUsers(selectedUsers.filter((u) => u.id !== id));
	};

	return (
		<fieldset className='fieldset relative'>
			<legend className='fieldset-legend'>Assigné à</legend>
			<input
				type='text'
				placeholder='Choisir un ou plusieurs collaborateurs (Tapez au moins deux lettres)'
				className='input input-bordered w-full'
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				aria-label='Rechercher un collaborateur'
			/>

			{users.length > 0 && (
				<ul className='menu bg-base-100 rounded-box shadow w-full absolute z-10 top-11 max-h-48 overflow-auto mt-1'>
					{users.map((user) => (
						<li key={user.id}>
							<button type='button' onClick={() => addUser(user)}>
								{user.name} ({user.email})
							</button>
						</li>
					))}
				</ul>
			)}

			{selectedUsers.length > 0 && (
				<div className='mt-2 flex flex-wrap gap-2'>
					{selectedUsers.map((user) => (
						<button
							type='button'
							key={user.id}
							className='btn btn-ghost badge badge-outline flex items-center gap-1'
							onClick={() => removeUser(user.id)}
							aria-label={`Retirer ${user.name}`}>
							{user.name} ✕
						</button>
					))}
				</div>
			)}
		</fieldset>
	);
}
