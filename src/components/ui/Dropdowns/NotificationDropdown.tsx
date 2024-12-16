"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'

type Notification = {
    id: string
    title: string
    description: string
    time: string
    read: boolean
}

const initialNotifications: Notification[] = [
    {
        id: '1',
        title: 'New Message',
        description: 'You have a new message from John Doe',
        time: '5 minutes ago',
        read: false,
    },
    {
        id: '2',
        title: 'Payment Received',
        description: 'Payment of $500 has been credited to your account',
        time: '1 hour ago',
        read: false,
    },
    {
        id: '3',
        title: 'New Update Available',
        description: 'A new software update is available for download',
        time: '2 hours ago',
        read: true,
    },
    {
        id: '4',
        title: 'Meeting Reminder',
        description: 'Your meeting with the team starts in 30 minutes',
        time: '3 hours ago',
        read: true,
    },
]

export function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ))
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })))
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 px-3 py-2"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
                    <div className="p-4 border-b">
                        <h3 className="text-sm font-medium">Notifications</h3>
                        <p className="text-xs text-gray-500">You have {unreadCount} unread messages</p>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="p-4 hover:bg-gray-50 cursor-pointer"
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">
                                        {notification.title}
                                        {!notification.read && <span className="ml-2 text-xs text-blue-500">New</span>}
                                    </p>
                                    <p className="text-xs text-gray-500">{notification.description}</p>
                                    <p className="text-xs text-gray-400">{notification.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t">
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-500 hover:text-blue-600"
                        >
                            Mark all as read
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
