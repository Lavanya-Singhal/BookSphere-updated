import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">University Library System</h3>
            <p className="text-gray-300 text-sm">
              Our library management system helps students and faculty access educational resources easily.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Quick Links</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li><Link href="/help"><a className="hover:text-white">Help Center</a></Link></li>
              <li><Link href="/privacy"><a className="hover:text-white">Privacy Policy</a></Link></li>
              <li><Link href="/terms"><a className="hover:text-white">Terms of Service</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-white">Contact Support</a></Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">Library Hours</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>Monday - Friday: 8:00 AM - 10:00 PM</li>
              <li>Saturday: 10:00 AM - 6:00 PM</li>
              <li>Sunday: 12:00 PM - 8:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} University Library System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
