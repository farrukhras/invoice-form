import Image from 'next/image';
import headerImage from '../../public/header.png';

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full h-20 bg-white flex items-center justify-center border-b border-[#D0D5DD]">
      <div className="relative w-24 h-10">
        <Image 
          src={headerImage}
          alt="Header Logo" 
          layout="fill" 
          objectFit="contain" 
          priority
        />
      </div>
    </header>
  );
}

export default Header;
