import { Box } from "lucide-react"
import { Button } from "./ui/Button";
import { useOutletContext } from "react-router";

const Navbar = () => {
  const { isSignedIn, userName, signIn, signOut } = useOutletContext<any>();

  async function handleAuthClick() {
    if (isSignedIn) {
      try {
        await signOut();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await signIn();
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <header className="navbar">
      <div className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className="name">Roomify</span>
          </div>
          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprice</a>
          </ul>
        </div>
        <div className="actions">
          {isSignedIn ? (
            <>
            <span className="greeting">Hi {userName}</span>
            <Button onClick={handleAuthClick} className="btn">log out</Button>
            </>
          ) :(
          <>
            <Button onClick={handleAuthClick} size="sm" variant="ghost">log in</Button>
            <a href="#upload" className="cta">get started</a>
          </>  
        )}
        </div>
      </div>
    </header>
  );
}

export default Navbar