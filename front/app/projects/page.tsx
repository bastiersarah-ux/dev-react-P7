import { getServerAuth } from '@front/lib/server-auth';
import TeamIcon from '@front/public/team.svg';
import { getDashboardProjects, getProjects } from '@front/services/projectsService';
import { ProjectMember } from '@front/types/api-types';
import { convertToProjectItemList } from '@front/types/project';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import UserInitialsButton from '../components/users/UserInitialsButton';

export default async function ProjectPage() {
	const { user } = await getServerAuth();
	const dashboardProjects = await getDashboardProjects({ cache: 'no-store' });
	const ownerProjects = await getProjects({ cache: 'no-store' });

	const projects = convertToProjectItemList(dashboardProjects, ownerProjects);

	return (
		<main className='md:px-44 md:py-17.5 p-10  flex flex-col gap-19  flex-1'>
			<div className='w-full'>
				<PageHeader title='Mes projets' subtitle='Gérez vos projets' />
			</div>
			{projects.length === 0 ? (
				<div className='flex-1 flex items-center justify-center'>
					<p className='text-gray-400 text-lg'>Aucun projet</p>
				</div>
			) : (
				<div className='grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-fr'>
					{projects.map((project) => {
						const { done, total, percentage } = project;
						const members: ProjectMember[] = project.members ?? [];

						return (
							<div key={project.id} className='h-full'>
								<Link
									href={`/projects/${project.id}`}
									key={project.id}
									className='card h-full p-5 gap-14 no-link bg-white flex flex-col'>
									<div>
										<h3>{project.name}</h3>
										<h4>{project.description}</h4>
									</div>

									{total > 0 && (
										<div>
											<div className='flex justify-between'>
												<h5>Progression</h5>
												<span>{percentage}%</span>
											</div>
											<progress className='progress w-full bg-gray-200' value={percentage} max={100} />
											<h6>
												{done}/{total} tâches terminées
											</h6>
										</div>
									)}

									{total === 0 && <p>Aucune tâche pour ce projet</p>}
									<div className='flex flex-col gap-2 mt-auto'>
										<div className='flex items-center gap-2'>
											<Image src={TeamIcon} alt='Icône équipe' width={11.58} height={11} />
											<h6>Équipe ({members.length ?? 0})</h6>
										</div>
										<div className='flex gap-2 h-6.75 flex-wrap text-[10px]'>
											{members
												.filter((m) => m.role == 'OWNER')
												.map((member) => (
													<UserInitialsButton
														key={member.id}
														user={member.user}
														variant={'Variant3'}
														size='27px'
														showFull={member.role === 'OWNER'}
														fullNameAlt={member.user.id == user?.id}
													/>
												))}
											<div className='flex -space-x-1 text-[10px]'>
												{members
													.filter((m) => m.role != 'OWNER')
													.map((member, index) => (
														<div
															key={member.id}
															className='shadow-[0_0_0_2px_white] rounded-full'
															style={{ zIndex: index + 1 }}>
															<UserInitialsButton user={member.user} variant={'Variant2'} size='27px' />
														</div>
													))}
											</div>
										</div>
									</div>
								</Link>
							</div>
						);
					})}
				</div>
			)}
		</main>
	);
}
