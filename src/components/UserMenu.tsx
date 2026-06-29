import type { User } from '@supabase/supabase-js'
import { signOut } from '@/hooks/useAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User as UserIcon } from 'lucide-react'

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const avatarUrl = user.user_metadata?.avatar_url as string | undefined
  const name = (user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? '') as string
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full p-0.5 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="h-8 w-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 border border-blue-200">
              {initials || <UserIcon className="h-4 w-4" />}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => void signOut()}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
