import { For, createSignal } from 'solid-js';

type TeamMemberProps = {
    name: string;
    role: string;
    imageUrl: string;
};

function TeamMember(props: TeamMemberProps) {
    return (
        <div class="p-4 md:w-1/5">
            <div class="bg-base-200 rounded-lg p-6 hover:shadow-lg transition duration-300">
                <div class="flex justify-center">
                    <img
                        class="w-24 h-24 rounded-full object-cover"
                        src={props.imageUrl}
                        alt={`${props.name}'s profile`}
                    />
                </div>
                <div class="text-center mt-4">
                    <h2 class="text-lg font-medium">{props.name}</h2>
                    <p class="text-gray-500 text-sm">{props.role}</p>
                </div>
            </div>
        </div>
    );
}

function Team() {
    const [teamMembers] = createSignal([
        {
            name: 'John Doe',
            role: 'CEO',
            imageUrl: 'https://via.placeholder.com/150',
        },
        {
            name: 'Jane Smith',
            role: 'Designer',
            imageUrl: 'https://via.placeholder.com/150',
        },
        {
            name: 'Bob Johnson',
            role: 'Developer',
            imageUrl: 'https://via.placeholder.com/150',
        },
        {
            name: 'Bob Johnson',
            role: 'Developer',
            imageUrl: 'https://via.placeholder.com/150',
        },
        {
            name: 'Bob Johnson',
            role: 'Developer',
            imageUrl: 'https://via.placeholder.com/150',
        },
    ]);

    return (
        <div class="flex flex-col bg-base-100 py-10 items-center">
            <h1 class="text-3xl font-semibold mb-4">Our Team</h1>
            <div class="flex flex-wrap m-4">
                <For each={teamMembers()}>
                    {(teamMember: TeamMemberProps) => (
                        <TeamMember name={teamMember.name} role={teamMember.role} imageUrl={teamMember.imageUrl} />
                    )}
                </For>
            </div>
        </div>
    );
}

export default Team;
