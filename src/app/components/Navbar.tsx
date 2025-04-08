"use client"
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import BloggyLogo from '../images/Bloggy.png'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

// เริ่มต้นด้วยค่าเริ่มต้น แต่จะถูกอัพเดตตาม URL ที่ใช้งานอยู่
const defaultNavigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'Bloggy', href: '/blog', current: false },
    
    { name: 'Login', href: '/login', current: false },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname() // ใช้ usePathname แทน router.pathname
    const [navigation, setNavigation] = useState(defaultNavigation)
    
    // อัพเดตสถานะ current ตาม URL ปัจจุบัน
    useEffect(() => {
        const updatedNavigation = defaultNavigation.map(item => ({
            ...item,
            current: item.href === pathname, // ใช้ pathname แทน router.pathname
        }))
        setNavigation(updatedNavigation)
    }, [pathname]) // ใช้ pathname ในการติดตามการเปลี่ยนแปลง
    
    // จัดการการคลิกที่ปุ่ม
    const handleNavClick = (href: string, index: number) => {
        // อัพเดตสถานะปุ่มทั้งหมด
        const updatedNavigation = navigation.map((item, idx) => ({
            ...item,
            current: idx === index,
        }))
        
        setNavigation(updatedNavigation)
        
        // นำทางไปยัง URL ที่เกี่ยวข้อง
        if (href !== '#') {
            router.push(href)
        }
    }

    return (
        <Disclosure as="nav" className="bg-white border-b-2 border-gray-300 shadow-md ">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                                    <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                                </DisclosureButton>
                            </div>
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex shrink-0 items-center">
                                    <img
                                        alt="Bloggy"
                                        src="../images/Bloggy.png"
                                        className="h-6 w-auto"
                                    />
                                </div>

                            </div>
                            <div className='flex justify-end'>
                                <div className="hidden sm:ml-6 sm:block ">
                                    <div className="flex space-x-4">
                                        {navigation.map((item, index) => (
                                            <button
                                                key={item.name}
                                                onClick={() => handleNavClick(item.href, index)}
                                                aria-current={item.current ? 'page' : undefined}
                                                className={classNames(
                                                    item.current ? 'bg-blue-600 text-white' : 'text-black hover:bg-blue-600 hover:text-white',
                                                    'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200',
                                                )}
                                            >
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <img
                                                alt=""
                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                className="size-8 rounded-full"
                                            />
                                        </MenuButton>
                                    </div>
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                    >
                                        <MenuItem>
                                            <a
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Your Profile
                                            </a>
                                        </MenuItem>
                                       
                                        <MenuItem>
                                            <a
                                                href="/"
                                                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                                            >
                                                Sign out
                                            </a>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <DisclosurePanel className="sm:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {navigation.map((item, index) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavClick(item.href, index)}
                                    aria-current={item.current ? 'page' : undefined}
                                    className={classNames(
                                        item.current ? 'bg-blue-600 text-white' : 'text-black hover:bg-blue-600 hover:text-white',
                                        'block w-full text-left rounded-md px-3 py-2 text-base font-medium transition-colors duration-200',
                                    )}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    )
}