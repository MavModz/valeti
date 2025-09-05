import valetiLogoBlack from '@/assets/images/valeti-logo-black.png';
import valetiLogoWhite from '@/assets/images/valeti-logo-white.png';
import valetiFavLogo from '@/assets/images/valeti-fav-logo-white.svg';
import Image from 'next/image';
import Link from 'next/link';
const LogoBox = () => {
  return <div className="logo-box">
      <Link href="/dashboards/analytics" className="logo-dark">
        <Image width={28} height={28} src={valetiFavLogo} className="logo-sm" alt="Valeti favicon" />
        <Image 
          width={125} 
          height={60} 
          src={valetiLogoBlack} 
          className="logo-lg" 
          alt="Valeti logo dark"
          style={{ width: '90%', height: '60px', objectFit: 'scale-down' }}
        />
      </Link>
      <Link href="/dashboards/analytics" className="logo-light">
        <Image width={28} height={28} src={valetiFavLogo} className="logo-sm" alt="Valeti favicon" />
        <Image 
          width={125} 
          height={60} 
          src={valetiLogoWhite} 
          className="logo-lg" 
          alt="Valeti logo light"
          style={{ width: '90%', height: '60px', objectFit: 'scale-down' }}
        />
      </Link>
    </div>;
};
export default LogoBox;