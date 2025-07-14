import React from "react";

export default function Footer() {
  return (
    <div className="m-8">
      <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
        <aside>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-current"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p>
            Auto trading tools
            <br />
            Providing reliable tech since 1992
          </p>
        </aside>
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Branding</a>
          <a className="link link-hover">Design</a>
          <a className="link link-hover">Marketing</a>
          <a className="link link-hover">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
          <a className="link link-hover">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
      {/* footer disclaimer  */}
      <div>
        <div className="mb-2 text-sm">
          rading is risky and many will lose money in connection with trading
          activities. All content on this site is not intended to, and should
          not be, construed as financial advice. Decisions to buy, sell, hold or
          trade in securities, commodities and other markets involve risk and
          are best made based on the advice of qualified financial
          professionals.
        </div>
        <div className="mb-2 text-sm">
          Past performance does not guarantee future results. Hypothetical or
          Simulated performance results have certain limitations. Unlike an
          actual performance record, simulated results do not represent actual
          trading.
        </div>
        <div className="mb-2 text-sm">
          Also, since the trades have not been executed, the results may have
          under-or-over compensated for the impact, if any, of certain market
          factors, including, but not limited to, lack of liquidity. Simulated
          trading programs in general are designed with the benefit of
          hindsight, and are based on historical information. No representation
          is being made that any account will or is likely to achieve profit or
          losses similar to those shown.
        </div>
        <div className="mb-2 text-sm">
          Testimonials appearing on this website may not be representative of
          other clients or customers and is not a guarantee of future
          performance or success.
        </div>
        <div className="mb-6 text-sm ">
          As a provider of technical analysis tools for charting platforms, we
          do not have access to the personal trading accounts or brokerage
          statements of our customers. As a result, we have no reason to believe
          our customers perform better or worse than traders as a whole based on
          any content or tool we provide. Charts used on this site are by
          TradingView in which the majority of our tools are built on.
          TradingView® is a registered trademark of TradingView, Inc.
          www.TradingView.com. TradingView® has no affiliation with the owner,
          developer, or provider of the Services described herein. This does not
          represent our full Disclaimer. Please read our full disclaimer.
        </div>
      </div>
    </div>
  );
}
