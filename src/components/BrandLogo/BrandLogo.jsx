import { useId } from 'react'
import './BrandLogo.css'

export default function BrandLogo(props) {
  const uid = useId()

  return (
    <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="brand-icon" {...props}>
      <rect x="4.00003" y="7.65625" width="3" height="13" rx="1.5" fill={`url(#${uid}0)`}/>
      <rect x="7.00003" y="14" width="3" height="14" rx="1.5" transform="rotate(180 7.00003 14)" fill={`url(#${uid}1)`} className="orange-rect rect-2"/>
      <rect x="16" y="11.3281" width="3" height="6" rx="1.5" fill={`url(#${uid}2)`}/>
      <rect x="19" y="14" width="3" height="14" rx="1.5" transform="rotate(180 19 14)" fill={`url(#${uid}3)`} className="orange-rect rect-5"/>
      <rect x="12" y="11" width="3" height="9" rx="1.5" fill={`url(#${uid}4)`}/>
      <rect x="15" y="14" width="3" height="9" rx="1.5" transform="rotate(180 15 14)" fill={`url(#${uid}5)`} className="orange-rect rect-4"/>
      <rect x="8.00003" y="11.3281" width="3" height="5" rx="1.5" fill={`url(#${uid}6)`}/>
      <rect x="11" y="14" width="3" height="12" rx="1.5" transform="rotate(180 11 14)" fill={`url(#${uid}7)`} className="orange-rect rect-3"/>
      <rect y="11" width="3" height="8" rx="1.5" fill={`url(#${uid}8)`}/>
      <rect x="3" y="14.3281" width="3" height="11" rx="1.5" transform="rotate(180 3 14.3281)" fill={`url(#${uid}9)`} className="orange-rect rect-1"/>
      <defs>
        <linearGradient id={`${uid}0`} x1="5.50003" y1="5.65625" x2="5.50003" y2="20.6562" gradientUnits="userSpaceOnUse"><stop stopColor="#F4320B"/><stop offset="1" stopColor="#5465F7"/></linearGradient>
        <linearGradient id={`${uid}1`} x1="8.50003" y1="28" x2="8.50003" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#F99885"/><stop offset="1" stopColor="#DF392B"/></linearGradient>
        <linearGradient id={`${uid}2`} x1="17.5" y1="11.3281" x2="17.5" y2="17.3281" gradientUnits="userSpaceOnUse"><stop stopColor="#F4320B"/><stop offset="1" stopColor="#5465F7"/></linearGradient>
        <linearGradient id={`${uid}3`} x1="20.5" y1="28" x2="20.5" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#F99885"/><stop offset="1" stopColor="#DF392B"/></linearGradient>
        <linearGradient id={`${uid}4`} x1="13.5" y1="11" x2="13.5" y2="20" gradientUnits="userSpaceOnUse"><stop stopColor="#F4320B"/><stop offset="1" stopColor="#5465F7"/></linearGradient>
        <linearGradient id={`${uid}5`} x1="16.5" y1="23" x2="16.5" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#F99885"/><stop offset="1" stopColor="#DF392B"/></linearGradient>
        <linearGradient id={`${uid}6`} x1="9.50003" y1="11.3281" x2="9.50003" y2="16.3281" gradientUnits="userSpaceOnUse"><stop stopColor="#F4320B"/><stop offset="1" stopColor="#5465F7"/></linearGradient>
        <linearGradient id={`${uid}7`} x1="12.5" y1="26" x2="12.5" y2="14" gradientUnits="userSpaceOnUse"><stop stopColor="#F99885"/><stop offset="1" stopColor="#DF392B"/></linearGradient>
        <linearGradient id={`${uid}8`} x1="1.5" y1="11" x2="1.5" y2="19" gradientUnits="userSpaceOnUse"><stop stopColor="#F4320B"/><stop offset="1" stopColor="#5465F7"/></linearGradient>
        <linearGradient id={`${uid}9`} x1="4.5" y1="25.3281" x2="4.5" y2="14.3281" gradientUnits="userSpaceOnUse"><stop stopColor="#F99885"/><stop offset="1" stopColor="#DF392B"/></linearGradient>
      </defs>
    </svg>
  )
}
