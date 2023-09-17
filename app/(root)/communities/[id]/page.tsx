import ThreadsTab from "@/components/shared/ThreadsTab";
import { communityTabs } from "@/constants";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";

import ProfileHeader from "@/components/shared/ProfileHeader";
import PostThread from "@/components/forms/PostThread";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchCommunityDetails } from "@/lib/actions/community.actions";
import UserCard from "@/components/cards/UserCard";


export default async function page({ params }: { params: { id: string } }) {
    const user = await currentUser();

    if (!user) return null;

    const communityDetails = await fetchCommunityDetails(params.id);
    return (
        <section>
            <ProfileHeader
                accountId={communityDetails.id}
                authUserId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                imgUrl={communityDetails.image}
                bio={communityDetails.bio}
                type='Community'
            />
            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {
                            communityTabs.map(tab => (
                                <TabsTrigger key={tab.label} value={tab.value} className="tab" >
                                    <Image
                                        src={tab.icon}
                                        alt={tab.label}
                                        height={24}
                                        width={24}
                                        className="object-contain"
                                    />
                                    <p className="max-sm:hidden">{tab.label}</p>
                                    {
                                        tab.label === 'Threads' && (
                                            <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                                {communityDetails?.threads?.length}
                                            </p>
                                        )
                                    }
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>

                    <TabsContent  value='threads' className="w-full text-light-1">
                        <ThreadsTab
                            currentUserId={user.id}
                            accountId={communityDetails.id}
                            accountType='Community'
                        />
                    </TabsContent>
                    <TabsContent  value='members' className="w-full text-light-1">
                        <section className="mt-9 flex flex-col gap-10">
                            {
                                communityDetails?.members.map((member:any) => (
                                    <UserCard 
                                     key={member.id}
                                     name={member.name}
                                     id={member.id}
                                     username={member.username}
                                     imgUrl={member.image}
                                     personType="Community"
                                    />
                                ))
                            }
                        </section>
                    </TabsContent>
                    <TabsContent  value='requests' className="w-full text-light-1">
                        <ThreadsTab
                            currentUserId={user.id}
                            accountId={communityDetails.id}
                            accountType='Community'
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}
