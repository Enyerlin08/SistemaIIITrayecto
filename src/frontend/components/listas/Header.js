import React, { useContext, useState } from 'react'
import { SidebarContext } from '../context/SidebarContext'
import {
  BellIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
} from '../icons'
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  WindmillContext,
} from '@windmill/react-ui'
import usuariofoto from '../assets/img/usuario.png'
import { Link } from 'react-router-dom';

function Header() {
  const { toggleSidebar } = useContext(SidebarContext)
  const { mode, toggleMode } = useContext(WindmillContext)

  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleNotificationsClick = () => {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen)
  }

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* Botón menú izquierdo */}
        <div className="flex items-center">
          <button
            className="p-1 mr-5 -ml-1 rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <MenuIcon className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Iconos a la derecha */}
        <div className="flex items-center space-x-6">
          {/* Botón de modo claro/oscuro */}
          <button
            className="rounded-md focus:outline-none focus:shadow-outline-purple"
            onClick={toggleMode}
            aria-label="Toggle color mode"
          >
            {mode === 'dark' ? (
              <SunIcon className="w-5 h-5" aria-hidden="true" />
            ) : (
              <MoonIcon className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

          {/* Notificaciones */}
          <div className="relative">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={handleNotificationsClick}
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <BellIcon className="w-5 h-5" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
              ></span>
            </button>

            <Dropdown
              align="right"
              isOpen={isNotificationsMenuOpen}
              onClose={() => setIsNotificationsMenuOpen(false)}
            >
              <DropdownItem tag="a" href="#" className="justify-between">
                <span>Mensages</span>
                <Badge type="danger">00</Badge>
              </DropdownItem>
              <DropdownItem tag="a" href="#" className="justify-between">
                <span>Sales</span>
                <Badge type="danger">00</Badge>
              </DropdownItem>
              <DropdownItem onClick={() => alert('Alerts!')}>
                <span>Alertas</span>
                <Badge type="danger">0</Badge>
              </DropdownItem> 
            </Dropdown>
          </div>

          {/* Perfil */}
          <div className="relative">
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              <Avatar
                className="align-middle"
                src={usuariofoto}
                alt="Usuario"
                aria-hidden="true"
              />
            </button>

            <Dropdown
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            >
              <DropdownItem tag="a" href="#">
                <OutlinePersonIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>Profile</span>
              </DropdownItem>
              <DropdownItem tag="a" href="#">
                <OutlineCogIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem as={Link} to="/login">
                <OutlineLogoutIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>Cerrar Sesión</span>
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header


