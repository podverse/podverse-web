import Link from "next/link"

export const Footer = () => {
    return (
      <footer className='footer'>
          <div className="footer-middle">
            <div className="footer-middle-site-links">
                <ul>
                    <li>
                        <a href="/contact">Contact</a>
                    </li>
                    <li>
                        <a href="/about">About</a>
                    </li>
                    <li>Terms</li>
                    <li>Premium</li>
                </ul>
            </div>
            <div className="footer-middle-site-links">
                <ul>
                    <li>GitHub</li>
                    <li>Twitter</li>
                    <li>Facebook</li>
                    <li>Reddit</li>
                </ul>
            </div>
          </div>
      </footer>
    )
  }
  