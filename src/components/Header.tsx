import GitHubIcon from "@/assets/GitHubIcon";
import LogoHeader from "@/assets/LogoHeader";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const Header = () => {
  return (
    <header className="border-b-2 mx-4 pt-1 pb-2 flex items-center justify-between border-white">
      <Link href="/">
        <LogoHeader className="w-80" />
      </Link>
      <div className="flex items-center space-x-4">
        <ConnectButton />
        <Link href="https://www.github.com">
          <GitHubIcon className="w-12" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
