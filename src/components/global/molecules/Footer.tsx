import { Globe, Mail, MapPin, Phone } from 'lucide-react'
import facebook from '../../../assets/facebook.png'
import instagram from '../../../assets/instagram.png'
import twitter from '../../../assets/tiktok.png'
import youtube from '../../../assets/youtube.png'
import logo from '../../../assets/LOGO SS-01.png'

function Footer() {
  return (
    <footer className='footer bg-[#647C6C] text-white' id='contact'>
      <div className='section__container footer__container grid gap-y-16 gap-x-8'>
        <div className='footer__col'>
          <div className=''>
            {/* <p className='font-greatvibes text-5xl mb-4'>StudySpace</p> */}
            <img className='h-20 w-auto object-contain mx-auto mb-2' src={logo} alt='logo' />
          </div>
          <p className=''>
            We provide a mobile app and website that allows users to easily search, compare and book study and group
            work spaces with just a few simple steps.
          </p>
        </div>
        <div className='footer__col'>
          <h4 className='mb-8 text-lg font-medium '>QUICK LINKS</h4>
          <ul className='footer__links list-none grid gap-4'>
            <li>
              <a className='transition-colors duration-300 hover:text-[#D7A883] '>Browse Destinations</a>
            </li>
            <li>
              <a className='transition-colors duration-300 hover:text-[#D7A883] '>Special Offers & Packages</a>
            </li>
            <li>
              <a className='transition-colors duration-300 hover:text-[#D7A883] '>Room Types & Amenities</a>
            </li>
          </ul>
        </div>
        <div className='footer__col'>
          <h4 className='mb-8 text-lg font-medium '>OUR SERVICES</h4>
          <ul className='footer__links list-none grid gap-4'>
            <li>
              <a className='transition-colors duration-300 hover:text-[#D7A883] '>Concierge Assistance</a>
            </li>
            <li>
              <a className='transition-colors duration-300 hover:text-[#D7A883] '>Flexible Booking Options</a>
            </li>
            <li>
              <a className='transition-colors duration-300 hover:text-[#D7A883] '>Airport Transfers</a>
            </li>
          </ul>
        </div>
        <div className='footer__col'>
          <h4 className='mb-8 text-lg font-medium '>CONTACT US</h4>
          <ul className='footer__links list-none grid gap-4'>
            <li>
              <a
                href='mailto:bigjump2024@gmail.com'
                className='transition-colors duration-300 hover:text-[#D7A883] flex justify-start items-center'
              >
                <Mail className='w-5 h-5 mr-2' />
                bigjump2024@gmail.com
              </a>
            </li>
            <li>
              <a className='transition-colors duration-300 hover:text-[#D7A883] flex justify-start items-center'>
                <Phone className='w-5 h-5 mr-2' /> 083 809 7512 (XB)
              </a>
            </li>
            <li>
              <a className='transition-colors duration-300 hover:text-[#D7A883] flex justify-start items-center'>
                <MapPin className='w-5 h-5 mr-2' /> Thu Duc City, Ho Chi Minh City
              </a>
            </li>
            <li>
              <a className='transition-colors duration-300 hover:text-[#D7A883] flex justify-start items-center'>
                <Globe className='w-5 h-5 mr-2' /> www.StudySpace.com
              </a>
            </li>
          </ul>
          <div className='footer__socials mt-8 flex items-center gap-4 flex-wrap'>
            <a href='https://www.facebook.com/profile.php?id=61562440290206' target='_blank'>
              <img
                className='max-w-[25px] opacity-80 transition duration-300 hover:opacity-100'
                src={facebook}
                alt='facebook'
              />
            </a>
            <a href='#'>
              <img
                className='max-w-[25px] opacity-80 transition duration-300  hover:opacity-100'
                src={instagram}
                alt='instagram'
              />
            </a>
            <a href='#'>
              <img
                className='max-w-[25px] opacity-80 transition duration-300  hover:opacity-100'
                src={youtube}
                alt='youtube'
              />
            </a>
            <a
              href='https://www.tiktok.com/@study.space8?_r=1&_d=secCgYIASAHKAESPgo8emElYaQx8z2hSqot5nyp33rJ%2BOlsXmWrZdwZz1N2eI6PlkLz6W69yf60U1h5y5IYblJiTHdGeeNbIR8iGgA%3D&checksum=2a003ab11b4f94d151f84ef296d003c8adbe8f4809f724b89696684548f20b6e&sec_uid=MS4wLjABAAAAI9BH-oK3i_x_wTqYaJ-fubBJ1MRG5z4tRuN71OtiZkyZT_sVuwASYSNBE_pgrDdf&sec_user_id=MS4wLjABAAAAuprtij9I_M0_gJjozUQXbYPjbHWPwDcYJqpt2b5W4z9jbqvcwSeKKEHJ30apVL_L&share_app_id=1180&share_author_id=7418288831411438609&share_link_id=06871A0B-5B0E-4B44-A89C-98386F38899D&sharer_language=vi&social_share_type=5&source=h5_t&timestamp=1731517689&tt_from=copy&u_code=deca0ldld0mdeh&ug_btm=b6880%2Cb5836&user_id=6871127121415586817&utm_campaign=client_share&utm_medium=ios&utm_source=copy'
              target='_blank'
            >
              <img
                className='max-w-[25px] rounded-md opacity-80 transition duration-300  hover:opacity-100'
                src={twitter}
                alt='twitter'
              />
            </a>
          </div>
        </div>
      </div>
      <div className='footer__bar pt-4 text-sm text-gray-500 text-center'>
        Copyright@ 2024 StudySpace.com . All Right Reserves.
      </div>
    </footer>
  )
}

export default Footer
