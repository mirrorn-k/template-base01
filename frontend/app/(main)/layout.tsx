import Header from "@/components/header/Index";
import Footer from "@/components/footer/Index";
import MenuModal from "@/components/header/Modal/Index";
import ContactModal from "@/components/contactForm/Modal";
import Box from "@mui/material/Box";

interface ClientLayoutProps {
  children: React.ReactNode;
}
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header />
      <Box component="main">{children}</Box>
      <Footer />
      <MenuModal />
      <ContactModal />
    </>
  );
}
