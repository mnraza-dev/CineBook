import { Link } from 'react-router-dom'
import { assets } from "../../assets/assets"
const AdminNavbar = () => {
  return (
    <div className='flex items-center justify-between px-8 md:px-10 border-b border-gray-300/30 '>
      <Link to="/admin">
        <img src={assets.logo} alt="logo" className='w-36 h-24' />
      </Link>
      <div className='text-right hidden sm:block'>
        <p className='text-white text-sm font-medium'>Admin</p>
        <p className='text-xs text-gray-400'>admin@cinebook.com</p>
      </div>
    </div>
  )
}
export default AdminNavbar