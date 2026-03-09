import { FaEnvelope, FaFacebook, FaInstagram, FaPhone } from "react-icons/fa";
import Link from "next/link";
import Logo from "./logo";

function Footer() {
  return (
    <>
      <footer className="p-10 mx-auto container bg-gradient-to-b from-rose-300 to-rose-600 text-white border-b-0 rounded-t-4xl">
        <div className="text-white flex flex-col items-center gap-4 lg:items-start mx-auto lg:mx-0">
          <Logo className={"h-[50px] min-w-[200px] px-2 rounded-2xl"} />
          <p
            className="text-xl max-w-lg text-center lg:text-start"
            style={{ color: "#fff" }}
          >
            Stop begging your tech friend. With Teacup, your business runs
            smoother than your cousin’s overpriced agency ever could.
          </p>
        </div>
        <div className=" border-white border-b-4 h-2 w-full my-3 mt-5"></div>
        <div className="text-white flex justify-between items-center flex-col lg:flex-row w-full">
          <div className="flex flex-col items-center lg:items-start gap-2">
            <span className="text-xs sm:text-lg">
              &copy; All rights reserved, Teacup 2026
            </span>
            <div className="flex gap-4 text-sm"></div>
          </div>
          <div className="flex gap-4 text-sm ">
            <Link className="hover:underline" href="/terms">
              Terms &amp; Conditions
            </Link>
            <Link
              className="hover:underline"
              href="/refund-policy
              "
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
