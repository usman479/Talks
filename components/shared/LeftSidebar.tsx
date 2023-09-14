'use client'
import React from 'react'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton } from '@clerk/nextjs'
import { SignedIn } from '@clerk/clerk-react'

export default function LeftSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <section className='custom-scrollbar leftsidebar'>
            <div className='flex w-full flex-1 flex-col gap-6 px-6'>
                {
                    sidebarLinks.map(link => {
                        const isActive = (
                            pathname.includes(link.route) &&
                            link.route.length > 1 ||
                            pathname === link.route
                        )
                        return (<Link href={link.route} key={link.label} className={`${isActive && 'bg-primary-500'} + leftsidebar_link `}>
                            <Image src={link.imgURL} alt={link.label} width={24} height={24} />
                            <p className='text-light-1 max-lg:hidden'>{link.label}</p>
                        </Link>
                        )
                    })
                }
            </div>
            <div className='mt-10 px-6'>
                <SignedIn>
                    <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                        <div className='flex cursor-pointer gap-4 p-4'>
                            <Image
                                src='/logout.svg'
                                alt='logout'
                                width={24}
                                height={24}
                            />
                            <p className='text-light-2 max-lg:hidden'>Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}
