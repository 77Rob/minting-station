import GitHubIcon from "@/assets/GitHubIcon";
import LogoHeader from "@/assets/LogoHeader";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const Header = () => {
  return (
    <header className="backdrop-invert-[0.03] px-4 py-1 w-full flex items-center justify-between ">
      <Link href="/">
        <LogoHeader className="w-80" />
      </Link>
      <div className="flex items-center gap-x-4">
        <ConnectButton label="CONNECT WALLET" />
        <Link href="https://www.github.com">
          <GitHubIcon className="w-8 hover:scale-[1.1]" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
